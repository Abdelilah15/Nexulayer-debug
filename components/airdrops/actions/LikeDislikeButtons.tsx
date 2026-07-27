'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAccount } from 'wagmi';
import { toggleLikeAction, getUserAirdropState } from '@/app/lib/actions/airdrop-actions';

type Props = {
  airdropId: string;
  initialLikes: number;
};

export default function LikeDislikeButtons({ airdropId, initialLikes }: Props) {
  const pathname = usePathname();
  const { address, isConnected } = useAccount(); // Used strictly for client-side UI control

  const [likeState, setLikeState] = useState<'liked' | 'disliked' | null>(null);
  const [likes, setLikes] = useState(initialLikes);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // When connected, fetch state using the secure server-side session (no address passed)
    if (isConnected && address) {
      getUserAirdropState(airdropId).then(state => setLikeState(state.likeState as any));
    } else {
      // Reset state if wallet is disconnected
      setLikeState(null);
    }
  }, [airdropId, address, isConnected]);

  const handleAction = async (targetAction: 'liked' | 'disliked') => {
    if (!isConnected || !address) {
      alert('Please connect your wallet to interact with airdrops.');
      return;
    }

    if (isLoading) return;
    setIsLoading(true);

    const isRemoving = likeState === targetAction;
    const newActionType = isRemoving ? 'remove' : (targetAction === 'liked' ? 'like' : 'dislike');

    // Optimistic UI Math
    const previousState = likeState;
    const previousLikes = likes;

    setLikeState(isRemoving ? null : targetAction);
    if (targetAction === 'liked') {
      setLikes(prev => isRemoving ? prev - 1 : (likeState === 'disliked' ? prev + 1 : prev + 1));
    } else if (targetAction === 'disliked' && likeState === 'liked') {
      setLikes(prev => prev - 1);
    }

    try {
      // Server action uses secure server session (no address passed)
      const result = await toggleLikeAction(airdropId, newActionType, pathname);

      if (result?.error) {
        setLikeState(previousState);
        setLikes(previousLikes);
        alert(result.error);
      }
    } catch (error) {
      setLikeState(previousState);
      setLikes(previousLikes);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleAction('liked')}
        disabled={isLoading}
        className={`flex items-center gap-2 px-3 py-2 rounded-full border text-sm font-medium transition-all ${
          likeState === 'liked'
            ? 'bg-[#0052FF]/10 border-[#0052FF]/30 text-[#0052FF]'
            : 'bg-body border-card text-secondary hover:bg-hover hover:text-foreground'
        }`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={likeState === 'liked' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 shrink-0">
          <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
        </svg>
        <span>{likes}</span>
      </button>

      <button
        onClick={() => handleAction('disliked')}
        disabled={isLoading}
        className={`flex items-center justify-center p-2 rounded-full border transition-all ${
          likeState === 'disliked'
            ? 'bg-red-500/10 border-red-500/30 text-red-500'
            : 'bg-body border-card text-secondary hover:bg-hover hover:text-foreground'
        }`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={likeState === 'disliked' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 shrink-0">
          <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-2"></path>
        </svg>
      </button>
    </div>
  );
}
