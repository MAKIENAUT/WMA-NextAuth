// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Define protected routes that require authentication
const PROTECTED_ROUTES = [
  '/forms',
  '/profile',
  '/protected-content',
];

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const isAuthenticated = !!token;

  // Define route types - updated for new route structure
  const isDashboardRoute = request.nextUrl.pathname.startsWith('/dashboard');
  const isSigninRoute = request.nextUrl.pathname.startsWith('/signin');
  const isSignoutRoute = request.nextUrl.pathname.startsWith('/signout');
  const isSignupRoute = request.nextUrl.pathname.startsWith('/signup');
  const isAuthRoute = isSigninRoute || isSignoutRoute || isSignupRoute;

  // Check if current path is in protected routes
  const isProtectedRoute = PROTECTED_ROUTES.some(route => 
    request.nextUrl.pathname.startsWith(route)
  );

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

  // Protected routes just need authentication
  if (isProtectedRoute && !isAuthenticated) {
    const callbackUrl = encodeURIComponent(request.nextUrl.pathname);
    return NextResponse.redirect(new URL(`/signin?callbackUrl=${callbackUrl}`, request.url));
  }

  // Redirect authenticated users away from auth pages
  if (isAuthRoute && isAuthenticated && !isSignoutRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// Updated matcher patterns to include new protected routes
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/forms/:path*',
    '/profile/:path*',
    '/protected-content/:path*',
    '/signin',
    '/signout',
    '/signup',
    '/unauthorized'
  ],
};