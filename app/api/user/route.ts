import { NextResponse } from 'next/server';
import clientPromise from '../../lib/mongodb';
import { getSessionAddress } from '@/app/lib/auth/session';

export async function GET() {
  try {
    // 🔒 Extract identity ONLY from secure session
    const address = await getSessionAddress();
    if (!address) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db('Nexulayer');
    const user = await db.collection('users').findOne({
      address: { $regex: new RegExp(`^${address}$`, 'i') }
    });

    if (!user) return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error('MONGODB API CRASH (GET):', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST() {
  try {
    // 🔒 Extract identity ONLY from secure session
    const address = await getSessionAddress();
    if (!address) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const client = await clientPromise;
    const db = client.db('Nexulayer');
    const collection = db.collection('users');

    let user = await collection.findOne({ address: { $regex: new RegExp(`^${address}$`, 'i') } });

    if (!user) {
      const randomAvatar = `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${address.substring(2, 8)}`;
      const newUser = {
        address: address.toLowerCase(),
        username: `Nexulayer_${address.substring(2, 6).toUpperCase()}`,
        domain: '',
        avatar: randomAvatar,
        joinedAt: new Date().toISOString(),
      };
      await collection.insertOne(newUser);
      user = newUser as any;
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error('MONGODB API CRASH (POST):', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    // 🔒 Extract identity ONLY from secure session
    const address = await getSessionAddress();
    if (!address) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { username, avatar } = body; // Notice we ignore 'address' from the body

    const client = await clientPromise;
    const db = client.db('Nexulayer');
    const collection = db.collection('users');

    const updateDoc: any = {};
    if (username) updateDoc.username = username;
    if (avatar) updateDoc.avatar = avatar;

    await collection.updateOne(
      { address: { $regex: new RegExp(`^${address}$`, 'i') } },
      { $set: updateDoc }
    );

    const updatedUser = await collection.findOne({
      address: { $regex: new RegExp(`^${address}$`, 'i') }
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error('MONGODB API CRASH (PUT):', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
