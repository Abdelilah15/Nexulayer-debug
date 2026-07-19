import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

// Fonction utilitaire pour obtenir la date du jour au format YYYY-MM-DD
const getTodayString = () => new Date().toISOString().split('T')[0];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address')?.toLowerCase();

    if (!address) {
      return NextResponse.json({ error: 'Adresse requise' }, { status: 400 });
    }

    let streak = await prisma.streak.findUnique({
      where: { walletAddress: address },
    });

    // Si l'utilisateur n'a pas encore de Streak, on l'initialise
    if (!streak) {
      streak = await prisma.streak.create({
        data: {
          walletAddress: address,
          currentCount: 0,
          history: [],
        },
      });
    }

    // Vérifier si le déploiement a déjà été fait aujourd'hui
    const today = getTodayString();
    const isTodayDone = streak.history.includes(today);

    if (streak.lastActive && !isTodayDone) {
      const todayDate = new Date(today);
      const lastActiveDate = new Date(streak.lastActive.toISOString().split('T')[0]);
      const diffTime = Math.abs(todayDate.getTime() - lastActiveDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays > 1) {
        streak = await prisma.streak.update({
          where: { walletAddress: address },
          data: { currentCount: 0 }, // Reset to 0 since they haven't deployed yet today
        });
      }
    }

    return NextResponse.json({ ...streak, isTodayDone });
  } catch (error) {
    console.error('Erreur GET streak:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { address } = await request.json();
    const walletAddress = address?.toLowerCase();

    if (!walletAddress) {
      return NextResponse.json({ error: 'Adresse requise' }, { status: 400 });
    }

    const streak = await prisma.streak.findUnique({
      where: { walletAddress },
    });

    if (!streak) {
      return NextResponse.json({ error: 'Streak non trouvée' }, { status: 404 });
    }

    const today = getTodayString();
    const todayDate = new Date(today);

    // Si déjà validé aujourd'hui, on ne fait rien
    if (streak.history.includes(today)) {
      return NextResponse.json({ ...streak, isTodayDone: true });
    }

    let newCount = streak.currentCount;
    let newHistory = [...streak.history];

    if (streak.lastActive) {
      const lastActiveDate = new Date(streak.lastActive.toISOString().split('T')[0]);
      const diffTime = Math.abs(todayDate.getTime() - lastActiveDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        // C'était hier, on incrémente !
        newCount += 1;
      } else if (diffDays > 1) {
        // Le joueur a raté un ou plusieurs jours, on réinitialise
        newCount = 1;
      }
    } else {
      // Première fois
      newCount = 1;
    }

    // Ajouter aujourd'hui à l'historique et garder seulement les 7 derniers jours
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
  } catch (error) {
    console.error('Erreur POST streak:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
