'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAccount } from 'wagmi';
import { toggleSaveAction, getUserAirdropState } from '@/app/lib/actions/airdrop-actions';

type Props = {
  airdropId: string;
  initialSaves: number;
};

export default function SaveButton({ airdropId, initialSaves }: Props) {
  const pathname = usePathname();
  const { address, isConnected } = useAccount(); // Used strictly for client-side UI control

  const [isSaved, setIsSaved] = useState(false);
  const [saves, setSaves] = useState(initialSaves);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // When connected, fetch state using the secure server-side session (no address passed)
    if (isConnected && address) {
      getUserAirdropState(airdropId).then(state => setIsSaved(state.isSaved));
    } else {
      // Reset state if wallet is disconnected
      setIsSaved(false);
    }
  }, [airdropId, address, isConnected]);

  const handleToggle = async () => {
    if (!isConnected || !address) {
      alert('Please connect your wallet to save this airdrop.');
      return;
    }

    if (isLoading) return;
    setIsLoading(true);

    // Optimistic UI Update
    setIsSaved(!isSaved);
    setSaves((prev) => (isSaved ? prev - 1 : prev + 1));

    try {
      // Server action uses secure server session (no address passed)
      const result = await toggleSaveAction(airdropId, pathname);

      if (result?.error) {
        setIsSaved(isSaved);
        setSaves(initialSaves);
        alert(result.error);
      }
    } catch (error) {
      setIsSaved(isSaved);
      setSaves(initialSaves);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all ${
        isSaved
          ? 'bg-[#0052FF]/10 border-[#0052FF]/30 text-[#0052FF]'
          : 'bg-body border-card text-secondary hover:bg-hover hover:text-foreground'
      }`}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 shrink-0">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
      </svg>
      <span className="hidden sm:inline">{isSaved ? 'Saved' : 'Watchlist'}</span>
      <span>{saves}</span>
    </button>
  );
}
