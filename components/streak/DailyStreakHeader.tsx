import React from 'react';
import FireIcon from "@/components/ui/icons/FireIcon";

interface DailyStreakHeaderProps {
    currentStreak: number;
    onClose: () => void;
    onShare: () => void;
}

export default function DailyStreakHeader({ currentStreak, onClose, onShare }: DailyStreakHeaderProps) {
    // Le flame ne s'allume que si le streak est actif (>= 1 jour)
    const isStreakActive = currentStreak > 0;

    return (
        <div className="flex flex-col items-center">
            {/* Navigation Top */}
            <div className="w-full flex justify-between items-center mb-6">
                <button
                    onClick={onShare}
                    className="text-secondary hover:text-foreground transition-colors flex items-center gap-2 text-sm font-medium bg-background px-3 py-1.5 rounded-lg border border-card"
                >
                    <i className="fi fi-rr-share"></i> Share
                </button>
                <button
                    onClick={onClose}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-background border border-card text-secondary hover:text-foreground hover:bg-card transition-all"
                >
                    <i className="fi fi-rr-cross-small text-xl"></i>
                </button>
            </div>

            {/* Hero Score */}
            <div className="w-full flex items-center justify-between py-2">
                <div className="flex flex-col items-start">
                    <span className="text-6xl sm:text-7xl font-black text-foreground tabular-nums tracking-tighter leading-none">
                        {currentStreak}
                    </span>

                    <div className="text-secondary font-medium uppercase tracking-widest text-xs sm:text-sm mt-2 sm:mt-3">
                        Day Streak
                    </div>
                </div>

                <div className="relative flex items-center justify-center mr-5 mb-5">
                    <FireIcon
                        active={currentStreak > 0}
                        className="w-16 h-16 sm:w-30 sm:h-30"
                    />
                </div>
            </div>
        </div>
    );
}