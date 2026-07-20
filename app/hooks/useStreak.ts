import { useState, useEffect, useCallback } from 'react';

export interface StreakData {
  currentCount: number;
  history: string[];
  isTodayDone: boolean;
}

export function useStreak(address: string | undefined) {
  const [streakData, setStreakData] = useState<StreakData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStreak = useCallback(async () => {
    if (!address) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/streak?address=${address}`);
      if (!response.ok) throw new Error('Error loading streak data');

      const data = await response.json();
      setStreakData(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  useEffect(() => {
    fetchStreak();
  }, [fetchStreak]);

  const updateStreak = async () => {
    if (!address) return false;

    try {
      const response = await fetch('/api/streak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address }),
      });

      // On essaie de lire le message d'erreur du serveur
      // Dans useStreak.ts
if (!response.ok) {
  const errorData = await response.json().catch(() => ({}));
  throw new Error(errorData.error || 'Erreur serveur inconnue');
}

      const updatedData = await response.json();
      setStreakData(updatedData);
      return true;
    } catch (err: any) {
      // Affiche l'erreur réelle dans la console du navigateur
      console.error("Détail de l'erreur API :", err.message);
      return false;
    }
  };

  return {
    streakData,
    isLoading,
    error,
    refreshStreak: fetchStreak,
    updateStreak,
  };
}
