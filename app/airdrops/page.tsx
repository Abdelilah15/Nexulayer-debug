import { getPublicAirdrops } from '@/app/lib/airdrops';
import AirdropsClient from '@/components/airdrops/client/AirdropsClient';
import HeroCards from '@/components/airdrops/hero/HeroCards';

export const revalidate = 60;

export default async function AirdropsListPage() {
  const airdrops = await getPublicAirdrops();

  return (
    <div className="min-h-full bg-background text-foreground p-6 md:p-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-12">

        {/* DYNAMIC HERO CARDS (REWARDING & TRENDING) */}
        <HeroCards airdrops={airdrops} />

        {/* CLIENT COMPONENT (Filters + Table) */}
        <AirdropsClient airdrops={airdrops} />

      </div>
    </div>
  );
}
