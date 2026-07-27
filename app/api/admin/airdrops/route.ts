import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAdminSession } from '@/app/lib/auth';
import { createAirdrop } from '@/app/lib/airdrops';

// Helper function to enforce strict admin JWT validation
async function enforceAdminAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get('nexulayer_admin_session')?.value;
  if (!token) return false;

  const payload = await verifyAdminSession(token);
  return payload && payload.role === 'admin';
}

export async function POST(request: Request) {
  try {
    // 1. Security Check (Admin Cookie Verification)
    const isAuthorized = await enforceAdminAuth();
    if (!isAuthorized) {
      return NextResponse.json(
        { error: 'Forbidden. Invalid or expired admin session.' },
        { status: 403 }
      );
    }

    // 2. Request Processing
    const body = await request.json();
    const newAirdrop = await createAirdrop(body);

    return NextResponse.json(
      { success: true, data: newAirdrop },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('POST /api/admin/airdrops error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal error during creation.' },
      { status: 500 }
    );
  }
}
