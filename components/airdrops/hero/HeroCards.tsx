'use client';

import { Airdrop } from '@/app/lib/airdrops';
import RewardingCarousel from './RewardingCarousel';
import TrendingCarousel from './TrendingCarousel';

type Props = {
  airdrops: Airdrop[];
};

export default function HeroCards({ airdrops }: Props) {
  // Only show airdrops where the toggle was manually enabled
  const rewardingList = airdrops.filter(a => a.is_rewarding === true);

  // Trending contains the rest
  const trendingList = airdrops.filter(a => a.is_rewarding !== true);

  // Fallback to all airdrops if a specific list is empty to avoid breaking the UI
  const safeRewarding = rewardingList.length > 0 ? rewardingList : airdrops;
  const safeTrending = trendingList.length > 0 ? trendingList : airdrops;

  return (
    <div className="mb-10 md:mb-12">
      {/* MAIN HEADER */}
      <div className="mb-6 md:mb-8 text-center md:text-left">
        <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-3">
          Alpha Airdrops
        </h1>
        <p className="text-secondary text-base md:text-lg max-w-2xl mx-auto md:mx-0">
          Discover and participate in the most promising airdrops in the ecosystem.
        </p>
      </div>

      {/* GRID CONTAINING BOTH CAROUSELS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        <RewardingCarousel items={safeRewarding} />
        <TrendingCarousel items={safeTrending} />
      </div>
    </div>
  );
}
