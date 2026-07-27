import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyAdminSession } from '@/app/lib/auth';
import AdminTopbar from '@/components/admin/AdminTopbar';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Retrieve the secure HTTP-Only cookie
  const cookieStore = await cookies();
  const adminToken = cookieStore.get('nexulayer_admin_session')?.value;

  // 2. Cryptographically verify the JWT session and check for the exact admin role
  let isValidAdmin = false;
  if (adminToken) {
    const payload = await verifyAdminSession(adminToken);
    if (payload && payload.role === 'admin') {
      isValidAdmin = true;
    }
  }

  // 3. Safely determine the current path using internal routing headers
  const headersList = await headers();
  const currentPath = headersList.get('x-invoke-path') || headersList.get('x-next-url') || '';
  const isLoginPage = currentPath === '/admin' || currentPath.endsWith('/admin');

  // 4. Security Enforcement: Redirect unauthorized access attempts to the login page
  if (!isValidAdmin && !isLoginPage) {
    redirect('/admin');
  }

  // 5. UX Enhancement: Auto-redirect successfully authenticated admins to the dashboard
  if (isValidAdmin && isLoginPage) {
    redirect('/admin/airdrops');
  }

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col font-sans">
      {/* Conditionally render the Topbar so it doesn't appear on the login page */}
      {isValidAdmin && !isLoginPage && <AdminTopbar />}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
