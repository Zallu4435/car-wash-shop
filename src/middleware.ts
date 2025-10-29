import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Cookie keys used for lightweight auth/role checks in middleware
// const ROLE_COOKIE_KEY = 'auth_role';
// const TOKEN_COOKIE_KEY = 'auth_token';

// function isAuthenticated(request: NextRequest): boolean {
//   const token = request.cookies.get(TOKEN_COOKIE_KEY)?.value;
//   return Boolean(token);
// }

// function getRole(request: NextRequest): 'customer' | 'staff' | 'admin' | undefined {
//   const role = request.cookies.get(ROLE_COOKIE_KEY)?.value as
//     | 'customer'
//     | 'staff'
//     | 'admin'
//     | undefined;
//   return role;
// }

export function middleware(request: NextRequest) {
  // const { pathname } = request.nextUrl;
  // const role = getRole(request);
  // const isAuthed = isAuthenticated(request);

  // // Protect Staff routes
  // if (pathname.startsWith('/staff')) {
  //   if (!isAuthed || role !== 'staff') {
  //     const url = request.nextUrl.clone();
  //     url.pathname = '/staff/auth/login';
  //     url.searchParams.set('next', pathname);
  //     return NextResponse.redirect(url);
  //   }
  // }

  // // Protect Admin routes
  // if (pathname.startsWith('/admin')) {
  //   if (!isAuthed || role !== 'admin') {
  //     const url = request.nextUrl.clone();
  //     url.pathname = '/admin/auth/login';
  //     url.searchParams.set('next', pathname);
  //     return NextResponse.redirect(url);
  //   }
  // }

  // // Prevent authenticated users visiting auth pages
  // if (
  //   pathname === '/auth/login' ||
  //   pathname === '/auth/register' ||
  //   pathname.startsWith('/staff/auth') ||
  //   pathname.startsWith('/admin/auth')
  // ) {
  //   if (isAuthed && role) {
  //     const url = request.nextUrl.clone();
  //     if (role === 'staff') url.pathname = '/staff/dashboard';
  //     else if (role === 'admin') url.pathname = '/admin/dashboard';
  //     else url.pathname = '/';
  //     return NextResponse.redirect(url);
  //   }
  // }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all paths except static assets and API routes
    '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
  ],
};
