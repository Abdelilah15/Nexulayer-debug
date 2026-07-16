import React from 'react';

interface MotivationQuoteProps {
  currentStreak: number;
}

export default function MotivationQuote({ currentStreak }: MotivationQuoteProps) {
  let quote = "";

  // On vérifie du plus grand au plus petit palier
  if (currentStreak >= 100) {
    quote = "Only the strongest builders reach here.";
  } else if (currentStreak >= 30) {
    quote = "Base is becoming your home.";
  } else if (currentStreak >= 15) {
    quote = "You're forging a real habit.";
  } else if (currentStreak >= 7) {
    quote = "Builders never skip.";
  } else if (currentStreak >= 3) {
    quote = "Consistency beats intensity.";
  } else {
    // Pour 0, 1 et 2 jours
    quote = "Every legend starts with one GM.";
  }

  return (
    <p className="text-sm sm:text-base text-secondary italic font-medium text-center">
      "{quote}"
    </p>
  );
}