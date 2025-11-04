import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const COOKIE_IS_LOGGED = 'auth_is_logged';
const COOKIE_ROLE = 'auth_role';

function isLogged(request: NextRequest) {
  return request.cookies.get(COOKIE_IS_LOGGED)?.value === 'true';
}

function getRole(request: NextRequest) {
  return request.cookies.get(COOKIE_ROLE)?.value as 'customer' | 'staff' | 'admin' | undefined;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const logged = isLogged(request);
  const role = getRole(request);

  const isAuthRoute = pathname.startsWith('/auth');
  const isAdminRoute = pathname.startsWith('/admin');
  const isStaffRoute = pathname.startsWith('/staff');
  const isProtected = isAdminRoute || isStaffRoute || pathname.startsWith('/account') || pathname.startsWith('/orders');

  // If logged in, prevent access to auth pages
  if (logged && isAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  // If not logged in and hitting protected pages, go to login
  if (!logged && isProtected) {
    const url = request.nextUrl.clone();
    url.pathname = '/auth/login';
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  // Role gates
  if (isAdminRoute) {
    if (role !== 'admin') {
      const url = request.nextUrl.clone();
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
  }

  if (isStaffRoute) {
    if (role !== 'staff' && role !== 'admin') {
      const url = request.nextUrl.clone();
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
  ],
};
