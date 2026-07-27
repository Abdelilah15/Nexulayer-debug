import { NextResponse } from 'next/server';
import { requireAdmin } from '@/app/lib/auth/admin';
import { supabaseAdmin } from '@/app/lib/supabase';

export async function POST(request: Request) {
  try {
    // 1. Security Check
    const adminSession = await requireAdmin();
    if (!adminSession) {
      return NextResponse.json({ error: 'Unauthorized. Invalid or expired admin session.' }, { status: 401 });
    }

    // 2. Retrieve the file
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'The file must be an image.' }, { status: 400 });
    }

    // 3. Prepare the file for Supabase
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const fileExtension = file.name.split('.').pop();
    const fileName = `${uniqueSuffix}.${fileExtension}`;

    // 4. Upload to the bucket
    const adminClient = supabaseAdmin();
    const { error } = await adminClient
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

    // 5. Retrieve public URL
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
    return NextResponse.json({ error: error.message || 'Upload failed.' }, { status: 500 });
  }
}
