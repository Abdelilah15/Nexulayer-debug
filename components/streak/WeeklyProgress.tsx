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

  return (
    <div>
      <h3 className="text-sm sm:text-base font-bold text-foreground mb-4">
        Weekly Progress
      </h3>
      <div className="flex justify-between items-center">
        {last7Days.map((date, index) => {
          const dateStr = getDateString(date);
          const isDone = history.includes(dateStr);

          return (
            <div key={index} className="flex flex-col items-center gap-2">
              <span className="text-[10px] sm:text-xs font-bold text-secondary">
                {getDayLetters(date)}
              </span>
              <div 
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-500 border-2 ${
                  isDone 
                    ? 'bg-[#2b7fff] border-[#2b7fff] text-white shadow-[0_0_10px_rgba(43,127,255,0.4)]' 
                    : 'bg-streak border-card text-transparent'
                }`}
              >
                {isDone && <i className="fi fi-rr-check text-sm sm:text-base"></i>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}