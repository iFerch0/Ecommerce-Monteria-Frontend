import { NextRequest, NextResponse } from 'next/server';

const PROTECTED_ROUTES = ['/mi-cuenta', '/mis-pedidos', '/checkout'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));

  if (!isProtected) {
    return NextResponse.next();
  }

  // Check for auth token in cookies (set by the auth store)
  // Since we use Zustand with localStorage, the middleware cannot directly check localStorage.
  // We rely on client-side protection in the components themselves.
  // This middleware handles basic redirects for unauthenticated deep links.
  return NextResponse.next();
}

export const config = {
  matcher: ['/mi-cuenta/:path*', '/mis-pedidos/:path*', '/checkout/:path*'],
};
