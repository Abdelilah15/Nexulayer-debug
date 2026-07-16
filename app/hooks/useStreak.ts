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

  // Fonction pour charger la streak
  const fetchStreak = useCallback(async () => {
    if (!address) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`/api/streak?address=${address}`);
      if (!response.ok) throw new Error('Erreur lors du chargement de la streak');
      
      const data = await response.json();
      setStreakData(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  // Charger les données au montage si l'adresse est dispo
  useEffect(() => {
    fetchStreak();
  }, [fetchStreak]);

  // Fonction pour valider la streak après un déploiement réussi
  const updateStreak = async () => {
    if (!address) return false;

    try {
      const response = await fetch('/api/streak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address }),
      });
      
      if (!response.ok) throw new Error('Erreur lors de la mise à jour');
      
      const updatedData = await response.json();
      setStreakData(updatedData);
      return true;
    } catch (err) {
      console.error(err);
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