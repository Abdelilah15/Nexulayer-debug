import { normalizeZerionAssets } from "./normalizeZerion";
import { normalizeCoinstatsToken, normalizeCoinstatsDefi } from "./normalizeCoinstats";
import type { Asset, CombinedAssetsResponse, ApiError } from "./types";

export async function fetchAllWalletAssets(walletAddress: string): Promise<CombinedAssetsResponse> {
  let allAssets: Asset[] = [];
  const errors: ApiError[] = [];

  const chainIconsMap: Record<string, string> = {};

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


  // --- 2. COINSTATS API ---
  try {
    const coinstatsKey = process.env.COINSTATS_API_KEY || '';
    const csHeaders = {
      'Accept': 'application/json',
      'X-API-KEY': coinstatsKey
    };

    // On n'utilise QUE l'endpoint "many" qui fonctionne globalement, et on retire la DeFi (Zapper s'en chargera)
    const csBalancesRes = await fetch(`https://openapiv1.coinstats.app/v1/wallet/balance/many?address=${walletAddress}`, { 
        method: 'GET', 
        cache: 'no-store', 
        headers: csHeaders 
    });

    if (csBalancesRes.ok) {
        const csData = await csBalancesRes.json();
        const items = Array.isArray(csData) ? csData : (csData.result || csData.data || []);
        
        items.forEach((group: any) => {
             // 🛡️ SÉCURITÉ : On extrait le réseau depuis le GROUPE
             const groupChain = group.blockchain || group.connectionId || "unknown";
             
             if(group.balances && Array.isArray(group.balances)){
                 const tokens = group.balances.map((it: any) => {
                     // 🛡️ On force le réseau du groupe sur le jeton s'il n'en a pas
                     it.chain = it.chain || groupChain;
                     return normalizeCoinstatsToken(it, walletAddress, chainIconsMap);
                 });
                 allAssets = [...allAssets, ...tokens];
             }
        });
    } else {
        errors.push({ source: "coinstats_balances", reason: `Status: ${csBalancesRes.status}` });
    }
  } catch (err: any) {
    errors.push({ source: "coinstats", reason: err.message || "Erreur de connexion CoinStats" });
  }

  // --- 3. COINSTATS API (Espace réservé) ---



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