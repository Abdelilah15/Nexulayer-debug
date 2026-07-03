import { normalizeZerionAssets } from "./normalizeZerion";
import { normalizeCoinstatsToken, normalizeCoinstatsDefi } from "./normalizeCoinstats";
import type { Asset, CombinedAssetsResponse, ApiError } from "./types";

export async function fetchAllWalletAssets(walletAddress: string): Promise<CombinedAssetsResponse> {
  let allAssets: Asset[] = [];
  const errors: ApiError[] = [];
  const chainIconsMap: Record<string, string> = {};

  const zerionKey = process.env.ZERION_API_KEY || '';
  const zerionHeaders = {
    'Accept': 'application/json',
    'Authorization': `Basic ${Buffer.from(`${zerionKey}:`).toString('base64')}`
  };

  const coinstatsKey = process.env.COINSTATS_API_KEY || '';
  const csHeaders = {
    'Accept': 'application/json',
    'X-API-KEY': coinstatsKey
  };

  // --- 1. Récupération rapide des icônes Zerion (Mis en cache) ---
  try {
    const chainsRes = await fetch("https://api.zerion.io/v1/chains", { headers: zerionHeaders, cache: 'force-cache' });
    if (chainsRes.ok) {
        const chainsData = await chainsRes.json();
        chainsData.data?.forEach((c: any) => {
            if (c.attributes?.icon?.url) chainIconsMap[c.id] = c.attributes.icon.url;
        });
    }
  } catch(e) { 
      console.error("Erreur cache icônes", e); 
  }

  // --- 2. LANCEMENT PARALLÈLE DES DEUX APIS ---
  // On prépare les requêtes sans utiliser "await" immédiatement
  const zerionPromise = fetch(`https://api.zerion.io/v1/wallets/${walletAddress}/positions?filter[positions]=no_filter`, {
      method: 'GET', headers: zerionHeaders, cache: 'no-store'
  }).then(res => res.ok ? res.json() : Promise.reject(`Zerion HTTP: ${res.status}`));

  // On utilise l'URL qui a fonctionné pour vous (sans le forceall)
  const coinstatsPromise = fetch(`https://openapiv1.coinstats.app/v1/wallet/balance?address=${walletAddress}&blockchain=all`, {
      method: 'GET', headers: csHeaders, cache: 'no-store'
  }).then(res => res.ok ? res.json() : Promise.reject(`Coinstats HTTP: ${res.status}`));

  // Promise.allSettled attend que TOUTES les API aient terminé (en succès ou en échec)
  const [zerionResult, csResult] = await Promise.allSettled([zerionPromise, coinstatsPromise]);

  // --- 3. TRAITEMENT DE ZERION ---
  if (zerionResult.status === "fulfilled") {
      try {
          const zerionAssets = normalizeZerionAssets(zerionResult.value.data, walletAddress, chainIconsMap);
          allAssets = [...allAssets, ...zerionAssets];
      } catch (err: any) {
          errors.push({ source: "zerion_parse", reason: err.message });
      }
  } else {
      errors.push({ source: "zerion", reason: String(zerionResult.reason) });
  }

  // --- 4. TRAITEMENT DE COINSTATS ---
  if (csResult.status === "fulfilled") {
      try {
          const items = Array.isArray(csResult.value) ? csResult.value : (csResult.value.result || csResult.value.data || []);
          items.forEach((item: any) => {
              if (item.balances && Array.isArray(item.balances)) {
                  const groupChain = item.blockchain || item.connectionId || "unknown";
                  const tokens = item.balances.map((it: any) => {
                      it.chain = it.chain || groupChain;
                      return normalizeCoinstatsToken(it, walletAddress, chainIconsMap);
                  });
                  allAssets = [...allAssets, ...tokens];
              } else if (item.balance !== undefined || item.amount !== undefined) {
                  allAssets.push(normalizeCoinstatsToken(item, walletAddress, chainIconsMap));
              }
          });
      } catch (err: any) {
          errors.push({ source: "coinstats_parse", reason: err.message });
      }
  } else {
      errors.push({ source: "coinstats", reason: String(csResult.reason) });
  }

  // --- 5. FORMATAGE ET RETOUR ---
  return {
    assets: allAssets,
    native: allAssets.filter(a => a.assetType === 'native'),
    tokens: allAssets.filter(a => a.positionType === 'wallet' && a.assetType !== 'native'),
    defi: allAssets.filter(a => a.positionType === 'defi'),
    partial: errors.length > 0,
    errors
  };
}