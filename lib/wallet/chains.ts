
export type ChainInfo = {
  id: string;
  chainId: number;
  name: string;
};

export function normalizeChain(rawChain: string, rawChainId?: number): ChainInfo {
  const lower = rawChain.toLowerCase().trim();

  // 1. On intercepte UNIQUEMENT les alias discordants connus entre les API
  let id = lower;
  if (lower === "matic") id = "polygon";
  if (lower === "bsc" || lower === "bnb") id = "binance";
  if (lower === "eth") id = "ethereum";

  // 2. Tout le reste (base, arbitrum, optimism, plume, etc.) passe dynamiquement
  return {
    id,
    chainId: rawChainId || 0, // Optionnel, selon si l'API le fournit
    name: id.charAt(0).toUpperCase() + id.slice(1), // Formate "base" en "Base" pour l'UI
  };
}