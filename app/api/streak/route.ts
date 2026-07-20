import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

const getTodayString = () => new Date().toISOString().split('T')[0];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address')?.toLowerCase();

    if (!address) {
      return NextResponse.json({ error: 'Address required' }, { status: 400 });
    }

    const streak = await prisma.streak.findUnique({
      where: { walletAddress: address },
    });

    const today = getTodayString();

    // 🌟 CORRECTION 1 : Si le streak n'existe pas, on renvoie un état vide SANS l'écrire dans la base.
    if (!streak) {
      return NextResponse.json({
        walletAddress: address,
        currentCount: 0,
        history: [],
        isTodayDone: false
      });
    }

    const isTodayDone = streak.history.includes(today);
    let currentCount = streak.currentCount;

    // Si le streak est brisé, on le signale virtuellement sans écrire dans la base
    // (La base sera mise à jour lors du prochain vrai POST)
    if (streak.lastActive && !isTodayDone) {
      const todayDate = new Date(today);
      const lastActiveDate = new Date(streak.lastActive.toISOString().split('T')[0]);
      const diffTime = Math.abs(todayDate.getTime() - lastActiveDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays > 1) {
        currentCount = 0;
      }
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

    let streak = await prisma.streak.findUnique({
      where: { walletAddress },
    });

    if (!streak) {
      streak = await prisma.streak.create({
        data: {
          walletAddress: walletAddress,
          currentCount: 0,
          history: [],
        },
      });
    }

    const today = getTodayString();

    if (streak.history.includes(today)) {
      return NextResponse.json({ ...streak, isTodayDone: true });
    }

    let newCount = streak.currentCount;
    let newHistory = [...streak.history];

    if (streak.lastActive) {
      const todayDate = new Date(today);
      const lastActiveDate = new Date(streak.lastActive.toISOString().split('T')[0]);
      const diffTime = Math.abs(todayDate.getTime() - lastActiveDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        newCount += 1;
      } else if (diffDays > 1) {
        newCount = 1;
      }
    } else {
      newCount = 1;
    }

    newHistory.push(today);
    if (newHistory.length > 7) {
      newHistory = newHistory.slice(newHistory.length - 7);
    }

    const updatedStreak = await prisma.streak.update({
      where: { walletAddress },
      data: {
        currentCount: newCount,
        lastActive: new Date(),
        history: newHistory,
      },
    });

    return NextResponse.json({ ...updatedStreak, isTodayDone: true });
  } catch (error: any) {
    console.error('POST streak error details:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
