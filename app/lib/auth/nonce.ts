import crypto from 'crypto';
import clientPromise from '../mongodb';

export async function generateNonce(address: string): Promise<string> {
  const nonce = crypto.randomBytes(32).toString('hex');
  const client = await clientPromise;
  const db = client.db('Nexulayer');

  // Store nonce with a timestamp (ideal for a TTL index in MongoDB)
  await db.collection('nonces').updateOne(
    { address: { $regex: new RegExp(`^${address}$`, 'i') } },
    { $set: { address: address.toLowerCase(), nonce, createdAt: new Date() } },
    { upsert: true }
  );

  return nonce;
}

export async function getAndInvalidateNonce(address: string): Promise<string | null> {
  const client = await clientPromise;
  const db = client.db('Nexulayer');

  // findOneAndDelete ensures the nonce is single-use, preventing replay attacks
  const record = await db.collection('nonces').findOneAndDelete({
    address: { $regex: new RegExp(`^${address}$`, 'i') }
  });

  return record?.nonce || null;
}
