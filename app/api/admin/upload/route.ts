import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAdminSession } from '@/app/lib/auth';
import { supabaseAdmin } from '@/app/lib/supabase';

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
      return NextResponse.json({ error: 'Forbidden. Invalid or expired admin session.' }, { status: 403 });
    }

    // 2. Retrieve the file from the FormData request
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
    }

    // (Optional) Verify the file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'The file must be an image.' }, { status: 400 });
    }

    // 3. Prepare the file for Supabase
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate a unique filename to avoid collisions
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const fileExtension = file.name.split('.').pop();
    const fileName = `${uniqueSuffix}.${fileExtension}`;

    // 4. Upload to the Supabase "airdrop-assets" bucket
    const adminClient = supabaseAdmin();
    const { data, error } = await adminClient
      .storage
      .from('airdrop-assets')
      .upload(fileName, buffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      throw new Error(`Supabase Storage error: ${error.message}`);
    }

    // 5. Retrieve the public URL
    const { data: publicUrlData } = adminClient
      .storage
      .from('airdrop-assets')
      .getPublicUrl(fileName);

    return NextResponse.json(
      {
        success: true,
        url: publicUrlData.publicUrl
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('POST /api/admin/upload error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
