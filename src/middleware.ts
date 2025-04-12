// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Protected routes that require authentication
const PROTECTED_ROUTES = [
  '/forms',
  '/profile',
  '/protected-content',
];

// Admin-only routes
const ADMIN_ROUTES = [
  '/admin',
];

// Dashboard routes that require special permission
const DASHBOARD_ROUTES = [
  '/dashboard',
];

export async function middleware(request: NextRequest) {
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET 
  });
  
  const isAuthenticated = !!token;
  const pathname = request.nextUrl.pathname;

  // Check route types
  const isAdminRoute = ADMIN_ROUTES.some(route => pathname.startsWith(route));
  const isDashboardRoute = DASHBOARD_ROUTES.some(route => pathname.startsWith(route));
  const isAuthRoute = ['/signin', '/signup', '/forgot-password', '/reset-password'].some(
    route => pathname.startsWith(route)
  );
  const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route));

  // Handle admin routes
  if (isAdminRoute) {
    if (!isAuthenticated || token.role !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  // Handle dashboard routes
  if (isDashboardRoute) {
    if (!isAuthenticated) {
      const callbackUrl = encodeURIComponent(pathname);
      return NextResponse.redirect(new URL(`/signin?callbackUrl=${callbackUrl}`, request.url));
    }
    
    if (!token.isAllowedDashboard) {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  // Handle other protected routes
  if (isProtectedRoute && !isAuthenticated) {
    const callbackUrl = encodeURIComponent(pathname);
    return NextResponse.redirect(new URL(`/signin?callbackUrl=${callbackUrl}`, request.url));
  }

  // Redirect authenticated users away from auth pages
  if (isAuthRoute && isAuthenticated) {
    // Allow signout even if authenticated
    if (pathname.startsWith('/signout')) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/dashboard/:path*',
    '/forms/:path*',
    '/profile/:path*',
    '/protected-content/:path*',
    '/signin',
    '/signup',
    '/signout',
    '/forgot-password',
    '/reset-password',
    '/unauthorized'
  ],
};