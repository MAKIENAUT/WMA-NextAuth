// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const isAuthenticated = !!token;

  // Define route types - updated for new route structure
  // Note: route groups don't affect URL paths
  const isDashboardRoute = request.nextUrl.pathname.startsWith('/dashboard');
  const isProtectedContentRoute = request.nextUrl.pathname.startsWith('/protected-content');
  const isSigninRoute = request.nextUrl.pathname.startsWith('/signin');
  const isSignoutRoute = request.nextUrl.pathname.startsWith('/signout');
  const isSignupRoute = request.nextUrl.pathname.startsWith('/signup');
  const isAuthRoute = isSigninRoute || isSignoutRoute || isSignupRoute;

  // Dashboard routes need special permission
  if (isDashboardRoute) {
    if (!isAuthenticated) {
      const callbackUrl = encodeURIComponent(request.nextUrl.pathname);
      return NextResponse.redirect(new URL(`/signin?callbackUrl=${callbackUrl}`, request.url));
    }
    
    // User is authenticated but check if their email is allowed for dashboard
    if (!token.isAllowedDashboard) {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  // Regular protected content just needs authentication
  if (isProtectedContentRoute && !isAuthenticated) {
    const callbackUrl = encodeURIComponent(request.nextUrl.pathname);
    return NextResponse.redirect(new URL(`/signin?callbackUrl=${callbackUrl}`, request.url));
  }

  // Redirect authenticated users away from auth pages
  if (isAuthRoute && isAuthenticated && !isSignoutRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// Updated matcher patterns for the new route structure
export const config = {
  matcher: [
    '/dashboard/:path*', 
    '/protected-content/:path*', 
    '/signin', 
    '/signout',
    '/signup', 
    '/unauthorized'
  ],
};