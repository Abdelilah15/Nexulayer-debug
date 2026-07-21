import { useState, useEffect, useCallback, useRef } from 'react';

export interface StreakData {
  currentCount: number;
  history: string[];
  isTodayDone: boolean;
}

const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 3000; // Neon cold start ≈ 3-5s

export function useStreak(address: string | undefined) {
  const [streakData, setStreakData] = useState<StreakData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchStreak = useCallback(
    async (attempt = 0) => {
      if (!address) return;

      setIsLoading(true);
      if (attempt === 0) setError(null);

      try {
        const response = await fetch(`/api/streak?address=${address}`);

        if (!response.ok) {
          // Retry sur les erreurs 500 (cold start Neon)
          if (response.status === 500 && attempt < MAX_RETRIES) {
            console.warn(
              `[useStreak] Erreur 500 – cold start probable. Retry #${attempt + 1} dans ${RETRY_DELAY_MS}ms…`
            );
            retryTimerRef.current = setTimeout(
              () => fetchStreak(attempt + 1),
              RETRY_DELAY_MS
            );
            return;
          }
          throw new Error('Erreur lors du chargement du streak');
        }

        const data = await response.json();
        setStreakData(data);
      } catch (err: any) {
        if (attempt < MAX_RETRIES) {
          console.warn(
            `[useStreak] Fetch échoué – retry #${attempt + 1} dans ${RETRY_DELAY_MS}ms…`
          );
          retryTimerRef.current = setTimeout(
            () => fetchStreak(attempt + 1),
            RETRY_DELAY_MS
          );
          return;
        }
        setError(err.message);
      } finally {
        // isLoading ne se désactive qu'au dernier essai ou en cas de succès
        if (attempt >= MAX_RETRIES) setIsLoading(false);
        else if (!error) setIsLoading(false); // succès
      }
    },
    [address]
  );

  // Nettoyage des timers au démontage
  useEffect(() => {
    return () => {
      if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
    };
  }, []);

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

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Erreur serveur inconnue');
      }

      const updatedData = await response.json();
      setStreakData(updatedData);
      return true;
    } catch (err: any) {
      console.error("[useStreak] Détail de l'erreur API :", err.message);
      return false;
    }
  };

  return {
    streakData,
    isLoading,
    error,
    refreshStreak: () => fetchStreak(0),
    updateStreak,
  };
}
