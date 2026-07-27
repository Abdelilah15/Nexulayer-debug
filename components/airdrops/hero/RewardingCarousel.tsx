'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Airdrop } from '@/app/lib/airdrops';

type Props = {
  items: Airdrop[];
};

export default function RewardingCarousel({ items }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Minimum swipe distance (in px) to trigger a slide
  const minSwipeDistance = 50;

  // Auto-rotate every 10 seconds
  useEffect(() => {
    if (items.length <= 1) return;
    const timer = setInterval(() => {
      handleNext();
    }, 10000);
    return () => clearInterval(timer);
  }, [currentIndex, items.length]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  // --- Touch Handlers for Smartphone Swiping ---
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
  };

  if (items.length === 0) return null;

  return (
    <div className="flex flex-col h-full w-full max-w-full">
      {/* SECTION HEADER & ARROWS */}
      <div className="flex justify-between items-end mb-4 px-1">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
            <span className="text-[#0052FF]">●</span> Rewarding Now
          </h2>
        </div>
        {items.length > 1 && (
          <div className="flex items-center gap-1.5 shrink-0">
            <button onClick={handlePrev} className="p-2 rounded-full bg-area border border-card text-secondary hover:text-foreground hover:bg-hover transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
            </button>
            <button onClick={handleNext} className="p-2 rounded-full bg-area border border-card text-secondary hover:text-foreground hover:bg-hover transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
            </button>
          </div>
        )}
      </div>

      {/* 🌟 SLIDING TRACK WRAPPER WITH TOUCH EVENTS 🌟 */}
      <div
        className="relative flex-1 overflow-hidden rounded-3xl shadow-custom"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div
          className="flex h-full transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {items.map((airdrop, idx) => (
            <div
              key={`rewarding-${airdrop.id}-${idx}`}
              className="w-full shrink-0 flex flex-col bg-card border border-[#0052FF]/30 hover:border-[#0052FF]/50 rounded-3xl p-6 sm:p-8 relative transition-colors min-h-[280px]"
            >
              {/* Decorative background blur */}
              <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-[#0052FF]/10 blur-[60px] sm:blur-[80px] -mr-10 -mt-10 pointer-events-none" />

              <div className="absolute top-4 right-4 sm:top-6 sm:right-6 px-3 py-1 bg-[#0052FF]/10 text-[#0052FF] dark:text-[#6699FF] text-[10px] sm:text-xs font-black tracking-widest rounded-full uppercase border border-[#0052FF]/20">
                Claim Live
              </div>

              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6 pr-20">
                  {airdrop.logo ? (
                    <img src={airdrop.logo} alt="logo" className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl shadow-sm border border-card object-cover shrink-0" />
                  ) : (
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-area flex items-center justify-center font-bold text-xl sm:text-2xl border border-card text-foreground shrink-0">{airdrop.title.charAt(0)}</div>
                  )}
                  <div className="min-w-0">
                    <h3 className="text-xl sm:text-2xl font-bold text-foreground truncate">{airdrop.title}</h3>
                    <p className="text-[#0052FF] dark:text-[#6699FF] font-medium text-sm sm:text-base truncate">Confirmed Airdrop</p>
                  </div>
                </div>

                <p className="text-secondary text-sm sm:text-base mb-6 sm:mb-8 line-clamp-2 sm:line-clamp-3 flex-1">
                  {airdrop.situation || airdrop.description || 'The claim for this airdrop is officially open to eligible users.'}
                </p>

                <Link href={`/airdrops/${airdrop.slug}`} className="w-full py-3 bg-[#0052FF] text-white text-center font-bold rounded-xl hover:bg-[#0040CC] transition-colors mt-auto shadow-sm">
                  Check Eligibility
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DOTS PAGINATION */}
      {items.length > 1 && (
        <div className="flex justify-center gap-2 mt-4 sm:mt-5 h-2">
          {items.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentIndex === idx ? 'bg-[#0052FF] w-6' : 'bg-area w-2 hover:bg-secondary border border-card'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
