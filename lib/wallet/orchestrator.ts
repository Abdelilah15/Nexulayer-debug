import { normalizeZerionAssets } from "./normalizeZerion";
import type { Asset, CombinedAssetsResponse, ApiError } from "./types";

export async function fetchAllWalletAssets(walletAddress: string): Promise<CombinedAssetsResponse> {
  let allAssets: Asset[] = [];
  const errors: ApiError[] = [];

  const apiKey = process.env.ZERION_API_KEY || '';
  const encodedKey = Buffer.from(`${apiKey}:`).toString('base64');
  const headers = {
    'Accept': 'application/json',
    'Authorization': `Basic ${encodedKey}`
  };

  // --- 1. ZERION API ---
  try {

    // 1. Récupération du dictionnaire des icônes de réseaux (Mis en cache pour la rapidité)
    const chainsRes = await fetch("https://api.zerion.io/v1/chains", { 
        headers, 
        cache: 'force-cache' 
    });
    const chainIconsMap: Record<string, string> = {};
    if (chainsRes.ok) {
        const chainsData = await chainsRes.json();
        chainsData.data?.forEach((c: any) => {
            if (c.attributes?.icon?.url) {
                chainIconsMap[c.id] = c.attributes.icon.url;
            }
        });
    }

    // 2. Fetch des positions avec le filtre OBLIGATOIRE (?filter[positions]=no_filter) pour inclure la DeFi
    const response = await fetch(`https://api.zerion.io/v1/wallets/${walletAddress}/positions?filter[positions]=no_filter`, {
      method: 'GET',
      cache: 'no-store',
      headers
    });

    if (response.ok) {
      const rawData = await response.json();
      // On passe le dictionnaire d'icônes à notre normalisateur
      const zerionAssets = normalizeZerionAssets(rawData.data, walletAddress, chainIconsMap);
      allAssets = [...allAssets, ...zerionAssets];
    } else {
      errors.push({ source: "zerion", reason: `Status: ${response.status} ${response.statusText}` });
    }
  } catch (err: any) {
    errors.push({ source: "zerion", reason: err.message || "Erreur de connexion" });
  }

  // --- 2. ZAPPER API (Espace réservé) ---
  // try {
  //   const zapperAssets = await fetchZapperAssets(walletAddress);
  //   allAssets = [...allAssets, ...zapperAssets];
  // } catch(err) { ... }

  // --- 3. COINSTATS API (Espace réservé) ---
  // try {
  //   const coinstatsAssets = await fetchCoinstatsAssets(walletAddress);
  //   allAssets = [...allAssets, ...coinstatsAssets];
  // } catch(err) { ... }


  // --- 4. FORMATAGE ET RETOUR ---
  return {
    assets: allAssets, // Plus tard, on passera ce tableau dans merge.ts pour enlever les doublons
    native: allAssets.filter(a => a.assetType === 'native'),
    tokens: allAssets.filter(a => a.positionType === 'wallet' && a.assetType !== 'native'),
    defi: allAssets.filter(a => a.positionType === 'defi'),
    partial: errors.length > 0,
    errors
  };
}