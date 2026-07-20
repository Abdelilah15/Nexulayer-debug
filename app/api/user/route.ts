import { NextResponse } from 'next/server';
import clientPromise from '../../lib/mongodb';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { address } = body;

    if (!address) {
      return NextResponse.json({ error: 'Address is required' }, { status: 400 });
    }

    console.log('Attempting MongoDB connection for address:', address);

    const client = await clientPromise;
    const db = client.db('Nexulayer');
    const collection = db.collection('users');

    let user = await collection.findOne({ address: address });

    if (!user) {
      console.log('New user! Creating profile...');

      const defaultAvatars = [
        'https://api.dicebear.com/9.x/bottts-neutral/svg?seed=Alpha',
        'https://api.dicebear.com/9.x/bottts-neutral/svg?seed=Beta',
        'https://api.dicebear.com/9.x/bottts-neutral/svg?seed=Gamma',
        'https://api.dicebear.com/9.x/bottts-neutral/svg?seed=Delta',
      ];

      const randomAvatar = defaultAvatars[Math.floor(Math.random() * defaultAvatars.length)];

      const newUser = {
        address: address,
        username: `Nexulayer_${address.substring(2, 6).toUpperCase()}`,
        domain: '',
        avatar: randomAvatar,
        joinedAt: new Date().toISOString(),
      };

      await collection.insertOne(newUser);
      user = newUser as any;

      console.log('Profile created successfully:', newUser.username);
    } else {
      console.log('Existing user found:', user.username);
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error('MONGODB API CRASH (POST):', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { address, username, avatar } = body;

    if (!address) {
      return NextResponse.json({ error: 'Address is required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('Nexulayer');
    const collection = db.collection('users');

    const updateDoc: any = {};
    if (username) updateDoc.username = username;
    if (avatar) updateDoc.avatar = avatar;

    await collection.updateOne({ address: address }, { $set: updateDoc });

    const updatedUser = await collection.findOne({ address: address });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error('MONGODB API CRASH (PUT):', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
