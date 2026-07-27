import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isExactAdminLogin = pathname === '/admin';
  const isProtectedAdminPage = pathname.startsWith('/admin/') && !isExactAdminLogin;
  const isAdminApiRoute = pathname.startsWith('/api/admin/');

  // Fast edge-check for cookie presence.
  // Deep cryptographic JWT verification is deferred to the API routes.
  const hasAdminCookie = request.cookies.has('nexulayer_admin_session');

  // 1. Block unauthorized access to nested admin pages & APIs
  if (!hasAdminCookie) {
    if (isProtectedAdminPage) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    if (isAdminApiRoute) {
      return NextResponse.json({ error: 'Unauthorized. Missing admin session.' }, { status: 401 });
    }
  }

  // 2. Prevent the 307 loop and enhance UX: redirect authenticated admins away from the login page
  if (isExactAdminLogin && hasAdminCookie) {
    return NextResponse.redirect(new URL('/admin/airdrops', request.url));
  }

  // 3. Allow valid requests to proceed normally
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
