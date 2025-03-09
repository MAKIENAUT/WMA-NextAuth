// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const isAuthenticated = !!token;

  // Define route types
  const isDashboardRoute = request.nextUrl.pathname.startsWith('/dashboard');
  const isProtectedContentRoute = request.nextUrl.pathname.startsWith('/protected-content');
  const isAuthRoute = request.nextUrl.pathname.startsWith('/auth');

  // Dashboard routes need special permission
  if (isDashboardRoute) {
    if (!isAuthenticated) {
      const callbackUrl = encodeURIComponent(request.nextUrl.pathname);
      return NextResponse.redirect(new URL(`/auth/signin?callbackUrl=${callbackUrl}`, request.url));
    }
    
    // User is authenticated but check if their email is allowed for dashboard
    if (!token.isAllowedDashboard) {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  // Regular protected content just needs authentication
  if (isProtectedContentRoute && !isAuthenticated) {
    const callbackUrl = encodeURIComponent(request.nextUrl.pathname);
    return NextResponse.redirect(new URL(`/auth/signin?callbackUrl=${callbackUrl}`, request.url));
  }

  // Redirect authenticated users away from auth pages
  if (isAuthRoute && isAuthenticated && request.nextUrl.pathname !== '/auth/signout') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/dashboard/:path*', '/auth/:path*', '/protected-content/:path*', '/unauthorized'],
};