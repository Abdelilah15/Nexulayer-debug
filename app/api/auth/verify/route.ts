import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import clientPromise from '@/app/lib/mongodb';
import { getAndInvalidateNonce } from '@/app/lib/auth/nonce';
import { createSession as createUserSession } from '@/app/lib/auth/session';
import { verifyWalletSignature, isAddressPublisher, createAdminSession } from '@/app/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { address, signature, message } = body;

    if (!address || !signature || !message) {
      return NextResponse.json({ error: 'Missing authentication parameters.' }, { status: 400 });
    }

    // 1. Recover the wallet address cryptographically from the signature
    const recoveredAddress = await verifyWalletSignature(message, signature);
    if (!recoveredAddress) {
      return NextResponse.json({ error: 'Invalid signature.' }, { status: 401 });
    }

    // 2. Ensure the recovered address matches the provided address (prevents address spoofing)
    if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
      return NextResponse.json({ error: 'Address mismatch with signature.' }, { status: 401 });
    }

    // 3. Retrieve and invalidate the single-use nonce (Mandatory for BOTH users and admins)
    const storedNonce = await getAndInvalidateNonce(recoveredAddress);
    if (!storedNonce) {
      return NextResponse.json({ error: 'Invalid or expired nonce.' }, { status: 401 });
    }

    // 4. Validate the expected authentication message structure securely
    const expectedPrefix = 'Welcome to Nexulayer!';
    if (
      !message.startsWith(expectedPrefix) ||
      !message.toLowerCase().includes(recoveredAddress.toLowerCase()) ||
      !message.includes(storedNonce)
    ) {
      return NextResponse.json({ error: 'Invalid authentication message format.' }, { status: 401 });
    }

    // 5. Only after successful signature and nonce verification, check admin status via Smart Contract
    const isAuthorizedAdmin = await isAddressPublisher(recoveredAddress as `0x${string}`);

    const cookieStore = await cookies();

    if (isAuthorizedAdmin) {
      console.log('✅ [DEBUG] Admin verified and authorized:', recoveredAddress);

      // Create admin session token (JWT)
      const adminToken = await createAdminSession(recoveredAddress);

      cookieStore.set({
        name: 'nexulayer_admin_session',
        value: adminToken,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24, // 24 hours
      });
    }

    // 6. Find or create the user profile in MongoDB for standard app features (Likes, Saves, etc.)
    const client = await clientPromise;
    const db = client.db('Nexulayer');
    const collection = db.collection('users');

    let user = await collection.findOne({ address: { $regex: new RegExp(`^${recoveredAddress}$`, 'i') } });

    if (!user) {
      const randomAvatar = `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${recoveredAddress.substring(2, 8)}`;
      const newUser = {
        address: recoveredAddress.toLowerCase(),
        username: `Nexulayer_${recoveredAddress.substring(2, 6).toUpperCase()}`,
        domain: '',
        avatar: randomAvatar,
        joinedAt: new Date().toISOString(),
      };
      await collection.insertOne(newUser);
      console.log('✅ [DEBUG] New MongoDB user profile created:', recoveredAddress);
    }

    // 7. Create secure HttpOnly standard user session cookie
    await createUserSession(recoveredAddress);

    return NextResponse.json({
      success: true,
      address: recoveredAddress,
      isAdmin: isAuthorizedAdmin,
    }, { status: 200 });

  } catch (error) {
    console.error('Error during secure auth verification:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
