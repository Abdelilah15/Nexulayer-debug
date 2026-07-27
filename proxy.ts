import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isNestedAdminPage = pathname.startsWith('/admin/') && pathname !== '/admin';
  const isAdminApiRoute = pathname.startsWith('/api/admin/');

  if (isNestedAdminPage || isAdminApiRoute) {
    const hasAdminCookie = request.cookies.has('nexulayer_admin_session');

    if (!hasAdminCookie) {
      if (isAdminApiRoute) {
        return NextResponse.json(
          { error: 'Unauthorized. Admin session missing.' },
          { status: 401 },
        );
      }

      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
