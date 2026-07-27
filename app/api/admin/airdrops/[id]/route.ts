import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAdminSession } from '@/app/lib/auth';
import { updateAirdrop, deleteAirdrop } from '@/app/lib/airdrops';

// Helper function to enforce strict admin JWT validation
async function enforceAdminAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get('nexulayer_admin_session')?.value;
  if (!token) return false;

  const payload = await verifyAdminSession(token);
  return payload && payload.role === 'admin';
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    // 1. Security Check (Admin Cookie Verification)
    const isAuthorized = await enforceAdminAuth();
    if (!isAuthorized) {
      return NextResponse.json({ error: 'Forbidden. Invalid or expired admin session.' }, { status: 403 });
    }

    const body = await request.json();
    const updatedAirdrop = await updateAirdrop(params.id, body);

    return NextResponse.json({ success: true, data: updatedAirdrop }, { status: 200 });
  } catch (error: any) {
    console.error(`PUT /api/admin/airdrops/${params.id} error:`, error);
    return NextResponse.json({ error: error.message || 'Internal error during update.' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    // 1. Security Check (Admin Cookie Verification)
    const isAuthorized = await enforceAdminAuth();
    if (!isAuthorized) {
      return NextResponse.json({ error: 'Forbidden. Invalid or expired admin session.' }, { status: 403 });
    }

    await deleteAirdrop(params.id);

    return NextResponse.json({ success: true, message: 'Airdrop deleted successfully.' }, { status: 200 });
  } catch (error: any) {
    console.error(`DELETE /api/admin/airdrops/${params.id} error:`, error);
    return NextResponse.json({ error: error.message || 'Internal error during deletion.' }, { status: 500 });
  }
}
