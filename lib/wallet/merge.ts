import type { Asset, CombinedAssetsResponse, ApiError } from "./types";
import { normalizeChain } from "./chains";

function safeNumber(v: unknown, fallback = 0): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function enrichForUI(a: Asset): Asset {
  const qty = a.quantity != null ? safeNumber(a.quantity, 0) : safeNumber(a.formattedBalance, 0);
  const value = a.valueUsd != null ? safeNumber(a.valueUsd, 0) : a.priceUsd != null ? qty * safeNumber(a.priceUsd, 0) : 0;
  
  // Utilisation du dictionnaire pour garantir un nom standard
  const chainInfo = normalizeChain(a.chain);

  return {
    ...a,
    quantity: qty,
    valueUsd: value,
    chain: chainInfo.id,
    chainName: chainInfo.name,
    chainId: a.chainId || chainInfo.chainId,
    chainIcon: a.chainIcon ?? null,
  };
}

function dedupe(assets: Asset[]): Asset[] {
  const map = new Map<string, Asset>();

  for (const raw of assets) {
    const a = enrichForUI(raw);

    // Nouvelle clé de déduplication basée sur la chaîne normalisée (au lieu de chainId)
    const key = [
      a.chain, 
      a.wallet.toLowerCase(),
      (a.contractAddress || "native").toLowerCase(),
      a.assetType,
      (a.protocol || "").toLowerCase(),
      (a.tokenId || "").toLowerCase(),
    ].join(":");

    const prev = map.get(key);
    if (!prev) {
      map.set(key, a);
      continue;
    }

    // Priorité absolue à Zerion, sinon on garde la valeur USD la plus haute
    if (prev.source !== "zerion" && a.source === "zerion") {
      map.set(key, a);
      continue;
    }

    if ((a.valueUsd || 0) > (prev.valueUsd || 0) && prev.source !== "zerion") {
      map.set(key, a);
    }
  }

  return [...map.values()];
}

export function mergeAssets(
  rawAssets: Asset[], 
  errors: ApiError[] = []
): CombinedAssetsResponse {
  
  const all = dedupe(rawAssets);
  all.sort((a, b) => (b.valueUsd || 0) - (a.valueUsd || 0));

  return {
    assets: all,
    native: all.filter((a) => a.assetType === "native"),
    tokens: all.filter((a) => a.positionType === "wallet" && a.assetType !== "native"), // <- onglet Tokens
    defi: all.filter((a) => a.positionType === "defi"), // <- onglet DeFi
    partial: errors.length > 0,
    errors,
  };
}