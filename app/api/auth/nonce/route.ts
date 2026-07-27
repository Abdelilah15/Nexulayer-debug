import { NextResponse } from 'next/server';
import { generateNonce } from '@/app/lib/auth/nonce';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');

  if (!address) {
    return NextResponse.json({ error: 'Address is required' }, { status: 400 });
  }

  try {
    const nonce = await generateNonce(address);
    const message = `Welcome to Nexulayer!\n\nClick to sign in and authenticate your session.\n\nThis request will not trigger a blockchain transaction or cost any gas fees.\n\nWallet Address:\n${address}\n\nNonce:\n${nonce}`;

    return NextResponse.json({ message });
  } catch (error) {
    console.error('Nonce generation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
