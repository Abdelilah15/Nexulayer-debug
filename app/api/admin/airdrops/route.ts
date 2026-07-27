import { NextResponse } from 'next/server';
import { requireAdmin } from '@/app/lib/auth/admin';
import { createAirdrop } from '@/app/lib/airdrops';

export async function POST(request: Request) {
  try {
    // 1. Strict Server-Side Authentication
    const adminSession = await requireAdmin();
    if (!adminSession) {
      return NextResponse.json(
        { error: 'Unauthorized. Invalid or missing admin session.' },
        { status: 401 }
      );
    }

    // 2. Process Request
    const body = await request.json();
    const newAirdrop = await createAirdrop(body);

    return NextResponse.json(
      { success: true, data: newAirdrop },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('POST /api/admin/airdrops error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error during creation.' },
      { status: 500 }
    );
  }
}
