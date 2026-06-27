import type { CombinedAssetsResponse } from "./types";

type CacheEntry = {
  data: CombinedAssetsResponse;
  timestamp: number;
};

const apiCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 3 * 60 * 1000; // 3 minutes

export async function getCachedAssets(wallet: string): Promise<CombinedAssetsResponse | null> {
  const entry = apiCache.get(wallet.toLowerCase());
  if (!entry) return null;

  const isExpired = (Date.now() - entry.timestamp) > CACHE_TTL_MS;
  if (isExpired) {
    apiCache.delete(wallet.toLowerCase());
    return null;
  }

  return entry.data;
}

export async function setCachedAssets(wallet: string, data: CombinedAssetsResponse): Promise<void> {
  apiCache.set(wallet.toLowerCase(), {
    data,
    timestamp: Date.now()
  });
}