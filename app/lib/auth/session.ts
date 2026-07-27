import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';

const SESSION_COOKIE_NAME = 'nexulayer_session';
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'nexulayer_fallback_secret_key_change_me_in_production'
);

export async function createSession(address: string) {
  // Create a JWT payload securely identifying the user
  const jwt = await new SignJWT({ address: address.toLowerCase() })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, jwt, {
    httpOnly: true, // Prevents XSS attacks
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: '/',
  });
}

export async function getSessionAddress(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    // Cryptographically verify the session token
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload.address as string;
  } catch (error) {
    return null; // Token is invalid or expired
  }
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
