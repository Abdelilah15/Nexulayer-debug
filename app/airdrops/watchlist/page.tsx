import { supabaseAdmin } from '@/app/lib/supabase';
import { getPublicAirdrops } from '@/app/lib/airdrops';
import { getSessionAddress } from '@/app/lib/auth/session';
import AirdropTable from '@/components/airdrops/client/AirdropTable';
import Link from 'next/link';

export const revalidate = 0;

export default async function WatchlistPage() {
  // 🔒 Securely retrieve the authenticated wallet address from the session cookie
  const address = await getSessionAddress();

  if (!address) {
    return (
      <div className="min-h-full bg-background p-6 md:p-10 flex flex-col items-center justify-center text-center">
        <h1 className="text-2xl font-bold text-foreground mb-4">Your Watchlist</h1>
        <p className="text-secondary mb-6">Please connect your wallet and sign in to view your saved airdrops.</p>
      </div>
    );
  }

  // Use the admin client to fetch records for the securely verified user
  const supabase = supabaseAdmin();

  const { data: saves } = await supabase
    .from('airdrop_saves')
    .select('airdrop_id')
    .eq('user_id', address)
    .order('created_at', { ascending: false });

  // Explicit type { airdrop_id: string } fixes the implicit 'any' error
  const savedIds = saves?.map((s: { airdrop_id: string }) => s.airdrop_id) || [];

  const allAirdrops = await getPublicAirdrops();
  const savedAirdrops = allAirdrops.filter((airdrop) => savedIds.includes(airdrop.id));

  return (
    <div className="min-h-full bg-background text-foreground p-6 md:p-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-8">

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-card pb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-2 flex items-center gap-3">
              <span className="text-[#0052FF]">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
              </span>
              My Watchlist
            </h1>
            <p className="text-secondary text-base">Track and monitor your saved airdrop opportunities.</p>
          </div>
          <Link
            href="/airdrops"
            className="inline-flex items-center justify-center px-4 py-2 bg-area hover:bg-hover text-foreground text-sm font-medium rounded-lg transition-colors border border-card whitespace-nowrap"
          >
            Explore More
          </Link>
        </div>

        {savedAirdrops.length > 0 ? (
          <AirdropTable airdrops={savedAirdrops} />
        ) : (
          <div className="bg-card border border-card rounded-2xl p-12 text-center shadow-custom">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-secondary mx-auto mb-4 opacity-50">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
            </svg>
            <h3 className="text-xl font-bold text-foreground mb-2">Your Watchlist is empty</h3>
            <p className="text-secondary mb-6">You haven't saved any airdrops yet. Start exploring and save projects to track them here.</p>
            <Link
              href="/airdrops"
              className="inline-flex items-center justify-center px-6 py-3 bg-[#0052FF] hover:bg-[#0040CC] text-white text-sm font-bold rounded-xl transition-colors shadow-sm"
            >
              Browse Airdrops
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
