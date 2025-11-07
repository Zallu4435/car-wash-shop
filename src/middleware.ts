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


  const isCustomerAuthRoute = pathname.startsWith('/auth');
  const isAdminAuthRoute = pathname.startsWith('/admin/auth');
  const isStaffAuthRoute = pathname.startsWith('/staff/auth');
  const isAuthRoute = isCustomerAuthRoute || isAdminAuthRoute || isStaffAuthRoute;
  
  const isAdminRoute = pathname.startsWith('/admin');
  const isStaffRoute = pathname.startsWith('/staff');
  
  // Public browsing - always accessible
  const isPublicBrowsing = pathname === '/' || 
                           pathname === '/products' || 
                           pathname.startsWith('/products/') ||
                           pathname === '/services' || 
                           pathname.startsWith('/services/');
  
  // Protected customer-only routes (require login)
  const customerRoutes = ['/account', '/orders', '/cart', '/checkout', '/profile', 
                          '/notifications', '/book', '/feedback', '/support', '/payment'];
  const isCustomerRoute = customerRoutes.some(route => {
    if (route === '/') return pathname === '/';
    return pathname === route || pathname.startsWith(route + '/');
  });
  
  const isProtected = 
    (isAdminRoute && !isAdminAuthRoute) ||
    (isStaffRoute && !isStaffAuthRoute) ||
    isCustomerRoute;


  // If logged in, prevent access to auth pages and send to role home
  if (logged && isAuthRoute) {
    const url = request.nextUrl.clone();
    if (isAdminAuthRoute) {
      url.pathname = '/admin/dashboard';
    } else if (isStaffAuthRoute) {
      url.pathname = '/staff/dashboard';
    } else {
      url.pathname = '/';
    }
    return NextResponse.redirect(url);
  }


  // If not logged in and hitting protected pages, redirect to login
  if (!logged && isProtected) {
    const url = request.nextUrl.clone();
    if (isAdminRoute) {
      url.pathname = '/admin/auth/login';
    } else if (isStaffRoute) {
      url.pathname = '/staff/auth/login';
    } else {
      url.pathname = '/auth/login';
    }
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }


  // Role gates for admin
  if (isAdminRoute && !isAdminAuthRoute) {
    if (role !== 'admin') {
      const url = request.nextUrl.clone();
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
  }


  // Role gates for staff
  if (isStaffRoute && !isStaffAuthRoute) {
    if (role !== 'staff' && role !== 'admin') {
      const url = request.nextUrl.clone();
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
  }


  // Prevent non-customers from accessing customer-only routes
  if (isCustomerRoute && logged && role !== 'customer') {
    const url = request.nextUrl.clone();
    url.pathname = role === 'admin' ? '/admin/dashboard' : '/staff/dashboard';
    return NextResponse.redirect(url);
  }


  return NextResponse.next();
}
