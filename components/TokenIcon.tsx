'use client';

import { useState, useEffect } from 'react';
import { Asset } from '@/lib/wallet/types';

const COINGECKO_PLATFORMS: Record<string, string> = {
  lisk: 'lisk',
  eth: 'ethereum',
};

export default function TokenIcon({ asset }: { asset: Asset }) {
  const [iconUrl, setIconUrl] = useState<string | null>(asset.icon || null);
  const [isLoading, setIsLoading] = useState(
    !asset.icon && asset.contractAddress && asset.contractAddress !== 'native',
  );

  useEffect(() => {
    if (asset.icon) {
      setIconUrl(asset.icon);
      setIsLoading(false);
      return;
    }

    if (asset.contractAddress === 'native' || !asset.contractAddress) {
      setIsLoading(false);
      return;
    }

    const fetchCoinGeckoIcon = async () => {
      try {
        const platform = COINGECKO_PLATFORMS[asset.chain.toLowerCase()];
        if (!platform) {
          setIsLoading(false);
          return;
        }

        const res = await fetch(`https://api.coingecko.com/api/v3/coins/${platform}/contract/${asset.contractAddress}`);
        if (!res.ok) throw new Error('Not found');

        const data = await res.json();
        if (data.image?.small) {
          setIconUrl(data.image.small);
        }
      } catch (error) {
        console.warn(`Icon not found for ${asset.symbol}`);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(() => fetchCoinGeckoIcon(), 300);
    return () => clearTimeout(timer);
  }, [asset]);

  if (isLoading) {
    return <div className="w-8 h-8 rounded-full bg-gray-700 animate-pulse" />;
  }

  return (
    <img
      src={iconUrl || '/globe.svg'}
      alt={asset.symbol}
      className="w-8 h-8 rounded-full object-cover"
      onError={(e) => {
        (e.target as HTMLImageElement).src = '/globe.svg';
      }}
    />
  );
}
