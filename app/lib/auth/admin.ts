import { cookies } from 'next/headers';
import { verifyAdminSession } from '@/app/lib/auth';

export async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get('nexulayer_admin_session')?.value;

  if (!token) {
    return null;
  }

  try {
    const payload = await verifyAdminSession(token);
    // Ensure the token is valid and specifically holds the admin role
    if (payload && payload.role === 'admin') {
      return payload;
    }
    return null;
  } catch (error) {
    console.error('Admin session verification failed:', error);
    return null;
  }
}
