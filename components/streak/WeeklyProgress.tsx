import React from 'react';

interface WeeklyProgressProps {
  history: string[];
}

export default function WeeklyProgress({ history }: WeeklyProgressProps) {
  // Générer les 7 derniers jours (du plus ancien à aujourd'hui)
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d;
  });

  const getDayLetters = (date: Date) => {
    const days = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
    return days[date.getDay()];
  };

  const getDateString = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  // Date d'aujourd'hui pour vérifier si un jour vide est "raté" (passé) ou "en attente" (aujourd'hui)
  const todayStr = getDateString(new Date());

  return (
    <div>
      <h3 className="text-sm sm:text-base font-bold text-foreground mb-4">Weekly Progress</h3>
      <div className="flex justify-between items-center">
        {last7Days.map((date, index) => {
          const dateStr = getDateString(date);
          const isDone = history.includes(dateStr);

          // Un jour est raté s'il n'est pas validé ET qu'il est strictement dans le passé (pas aujourd'hui)
          const isMissed = !isDone && dateStr !== todayStr;

          return (
            <div key={index} className="flex flex-col items-center gap-2">
              <span className="text-[10px] sm:text-xs font-bold text-secondary">{getDayLetters(date)}</span>
              <div
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-500 border-2 ${
                  isDone
                    ? 'bg-[#0055FF] border-[#0055FF] text-white shadow-[0_0_10px_rgba(0,85,255,0.4)]' // Validé : Bleu Nexulayer
                    : isMissed
                      ? 'bg-red-500/10 border-red-500/50 text-red-500' // Raté : Fond rouge clair, bordure rouge
                      : 'bg-streak border-card text-transparent' // Aujourd'hui en attente : Vide
                }`}
              >
                {isDone && <i className="fi fi-rr-check flex text-sm sm:text-base"></i>}
                {isMissed && <i className="fi fi-rr-cross flex text-[10px] sm:text-xs"></i>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
