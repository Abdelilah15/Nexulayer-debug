import React from 'react';

interface DailyDeployButtonProps {
  choice: 'GM' | 'GN';
  setChoice: (choice: 'GM' | 'GN') => void;
  onDeploy: () => void;
  isLoading: boolean;
  isTodayDone: boolean;
}

export default function DailyDeployButton({ choice, setChoice, onDeploy, isLoading, isTodayDone }: DailyDeployButtonProps) {
  if (isTodayDone) {
    return (
      <div className="mt-8 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-center text-emerald-500 font-bold flex items-center justify-center gap-2">
        <i className="fi fi-rr-check-circle"></i> Daily Streak Completed!
      </div>
    );
  }

  return (
    <div className="mt-8 flex flex-col gap-4">
      {/* Cartes GM / GN */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => setChoice('GM')}
          className={`flex flex-col items-center justify-center gap-1.5 py-4 sm:py-5 rounded-xl border-2 transition-all ${
            choice === 'GM' 
              ? 'bg-[#1c398e]/10 border-[#1c398e] shadow-sm' 
              : 'bg-background border-card hover:border-secondary/40'
          }`}
        >
          <span className="text-2xl sm:text-3xl">☀️</span>
          <span className={`text-sm sm:text-base font-bold ${choice === 'GM' ? 'text-accent' : 'text-secondary'}`}>
            GM
          </span>
        </button>
        <button
          onClick={() => setChoice('GN')}
          className={`flex flex-col items-center justify-center gap-1.5 py-4 sm:py-5 rounded-xl border-2 transition-all ${
            choice === 'GN' 
              ? 'bg-[#1c398e]/10 border-[#1c398e] shadow-sm' 
              : 'bg-background border-card hover:border-secondary/40'
          }`}
        >
          <span className="text-2xl sm:text-3xl">🌙</span>
          <span className={`text-sm sm:text-base font-bold ${choice === 'GN' ? 'text-[#1c398e]' : 'text-secondary'}`}>
            GN
          </span>
        </button>
      </div>

      {/* Bouton Deploy */}
      <button
        onClick={onDeploy}
        disabled={isLoading}
        className={`w-full py-3.5 sm:py-4 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 ${
          isLoading 
            ? 'bg-background text-secondary border border-card cursor-wait' 
            : 'bg-[#2b7fff] hover:bg-[#1a5fc0] cursor-pointer shadow-lg shadow-blue-500/20'
        }`}
      >
        {isLoading ? (
          <>
            <i className="fi fi-rr-spinner animate-spin"></i> Processing...
          </>
        ) : (
          <>
            <i className="fi fi-rr-rocket-lunch"></i> Deploy on Base
          </>
        )}
      </button>
    </div>
  );
}