import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

const getTodayString = () => new Date().toISOString().split('T')[0];

// Retry sur les erreurs de connexion Neon (cold start ETIMEDOUT)
async function withDbRetry<T>(
  fn: () => Promise<T>,
  retries = 2,
  delayMs = 2000
): Promise<T> {
  try {
    return await fn();
  } catch (err: any) {
    const isColdStart =
      err?.sourceError?.code === 'ETIMEDOUT' ||
      err?.message?.includes('fetch failed') ||
      err?.message?.includes('ETIMEDOUT') ||
      err?.code === 'ETIMEDOUT';

    if (retries > 0 && isColdStart) {
      console.warn(`[DB] Cold start détecté, retry dans ${delayMs}ms… (${retries} restant(s))`);
      await new Promise((r) => setTimeout(r, delayMs));
      return withDbRetry(fn, retries - 1, delayMs * 2);
    }
    throw err;
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address')?.toLowerCase();

    if (!address) {
      return NextResponse.json({ error: 'Address required' }, { status: 400 });
    }

    const streak = await withDbRetry(() =>
      prisma.streak.findUnique({ where: { walletAddress: address } })
    );

    const today = getTodayString();

    if (!streak) {
      return NextResponse.json({
        walletAddress: address,
        currentCount: 0,
        history: [],
        isTodayDone: false,
      });
    }

    const isTodayDone = streak.history.includes(today);
    let currentCount = streak.currentCount;

    if (streak.lastActive && !isTodayDone) {
      const todayDate = new Date(today);
      const lastActiveDate = new Date(streak.lastActive.toISOString().split('T')[0]);
      const diffDays = Math.ceil(
        Math.abs(todayDate.getTime() - lastActiveDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (diffDays > 1) currentCount = 0;
    }

    return NextResponse.json({ ...streak, currentCount, isTodayDone });
  } catch (error) {
    console.error('GET streak error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { address } = await request.json();
    const walletAddress = address?.toLowerCase();

    if (!walletAddress) {
      return NextResponse.json({ error: 'Address required' }, { status: 400 });
    }

    let streak = await withDbRetry(() =>
      prisma.streak.findUnique({ where: { walletAddress } })
    );

    if (!streak) {
      streak = await withDbRetry(() =>
        prisma.streak.create({
          data: { walletAddress, currentCount: 0, history: [] },
        })
      );
    }

    const today = getTodayString();

    if (streak.history.includes(today)) {
      return NextResponse.json({ ...streak, isTodayDone: true });
    }

    let newCount = streak.currentCount;
    let newHistory = [...streak.history];

    if (streak.lastActive) {
      const diffDays = Math.ceil(
        Math.abs(
          new Date(today).getTime() -
            new Date(streak.lastActive.toISOString().split('T')[0]).getTime()
        ) /
          (1000 * 60 * 60 * 24)
      );
      newCount = diffDays === 1 ? newCount + 1 : 1;
    } else {
      newCount = 1;
    }

    newHistory.push(today);
    if (newHistory.length > 7) newHistory = newHistory.slice(newHistory.length - 7);

    const updatedStreak = await withDbRetry(() =>
      prisma.streak.update({
        where: { walletAddress },
        data: { currentCount: newCount, lastActive: new Date(), history: newHistory },
      })
    );

    return NextResponse.json({ ...updatedStreak, isTodayDone: true });
  } catch (error: any) {
    console.error('POST streak error:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
