import { NextResponse } from 'next/server';
import { requireAdmin } from '@/app/lib/auth/admin';
import { updateAirdrop, deleteAirdrop } from '@/app/lib/airdrops';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const adminSession = await requireAdmin();
    if (!adminSession) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    return NextResponse.json({ success: true, id: params.id }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const adminSession = await requireAdmin();
    if (!adminSession) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const body = await request.json();
    const updatedAirdrop = await updateAirdrop(params.id, body);

    return NextResponse.json({ success: true, data: updatedAirdrop }, { status: 200 });
  } catch (error: any) {
    console.error(`PUT /api/admin/airdrops/${params.id} error:`, error);
    return NextResponse.json({ error: error.message || 'Internal error during update.' }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const adminSession = await requireAdmin();
    if (!adminSession) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const body = await request.json();
    const updatedAirdrop = await updateAirdrop(params.id, body);

    return NextResponse.json({ success: true, data: updatedAirdrop }, { status: 200 });
  } catch (error: any) {
    console.error(`PATCH /api/admin/airdrops/${params.id} error:`, error);
    return NextResponse.json({ error: error.message || 'Internal error during partial update.' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const adminSession = await requireAdmin();
    if (!adminSession) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    await deleteAirdrop(params.id);

    return NextResponse.json({ success: true, message: 'Airdrop deleted successfully.' }, { status: 200 });
  } catch (error: any) {
    console.error(`DELETE /api/admin/airdrops/${params.id} error:`, error);
    return NextResponse.json({ error: error.message || 'Internal error during deletion.' }, { status: 500 });
  }
}
