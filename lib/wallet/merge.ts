import type { Asset, CombinedAssetsResponse, ApiError } from "./types";
import { normalizeChain } from "./chains";

function safeNumber(v: unknown, fallback = 0): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function enrichForUI(a: Asset): Asset {
  const qty = a.quantity != null ? safeNumber(a.quantity, 0) : safeNumber(a.formattedBalance, 0);
  const value = a.valueUsd != null ? safeNumber(a.valueUsd, 0) : a.priceUsd != null ? qty * safeNumber(a.priceUsd, 0) : 0;
  
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

    // NOUVEAU : Logique de déduplication beaucoup plus robuste (Ignore les 0xeeee de CoinStats)
    const isNative = a.assetType === "native" || !a.contractAddress || a.contractAddress.toLowerCase() === "native";
    const contract = isNative ? "native" : a.contractAddress!.toLowerCase();
    
    let key = "";
    
    if (a.positionType === "wallet") {
        // Pour les jetons simples : Seuls le réseau et l'adresse du contrat comptent
        key = `wallet:${a.chain}:${a.wallet.toLowerCase()}:${contract}`;
    } else {
        // Pour la DeFi : On ajoute le protocole pour ne pas écraser différentes positions de staking
        key = `defi:${a.chain}:${a.wallet.toLowerCase()}:${contract}:${a.assetType}:${(a.protocol || "").toLowerCase()}`;
    }

    const prev = map.get(key);
    if (!prev) {
      map.set(key, a);
      continue;
    }

    // Priorité absolue à Zerion (Les données de Zerion sont toujours considérées comme les plus propres)
    if (prev.source !== "zerion" && a.source === "zerion") {
      map.set(key, a);
      continue;
    }

    // Si on a deux éléments CoinStats (ou deux Zerion, peu probable), on garde celui avec la plus haute valeur USD
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
    tokens: all.filter((a) => a.positionType === "wallet" && a.assetType !== "native"),
    defi: all.filter((a) => a.positionType === "defi"),
    partial: errors.length > 0,
    errors,
  };
}