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

    console.log(`\n=================================================`);
    console.log(`🚀 DÉMARRAGE ORCHESTRATEUR POUR : ${walletAddress}`);
    console.log(`=================================================`);

    // --- 1. Récupération rapide des icônes Zerion (Mise en cache) ---
    try {
        const chainsRes = await fetch("https://api.zerion.io/v1/chains", { headers: zerionHeaders, cache: 'force-cache' });
        if (chainsRes.ok) {
            const chainsData = await chainsRes.json();
            chainsData.data?.forEach((c: any) => {
                if (c.attributes?.icon?.url) chainIconsMap[c.id] = c.attributes.icon.url;
            });
        }
    } catch (e) {
        console.error("⚠️ Erreur cache icônes Zerion");
    }

    // --- 2. UTILITAIRE DE FETCH AVEC LOGS AVANCÉS ---
    const fetchWithDetailedLogs = async (apiName: string, url: string, options: RequestInit, timeoutMs: number) => {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeoutMs);
        const startTime = Date.now();

        console.log(`⏳ [${apiName}] Requête envoyée...`);

        try {
            const response = await fetch(url, { ...options, signal: controller.signal });
            clearTimeout(id);
            const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

            console.log(`⏱️ [${apiName}] Réponse reçue en ${elapsed}s | Statut HTTP : ${response.status}`);

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`🚨 [${apiName}] ERREUR SERVEUR DÉTAILLÉE :`, errorText);
                throw new Error(`Erreur HTTP ${response.status}: ${errorText}`);
            }

            return response.json();
        } catch (error: any) {
            clearTimeout(id);
            const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
            const errMsg = error.name === 'AbortError' ? `Timeout déclenché après ${timeoutMs / 1000}s` : error.message;
            console.error(`❌ [${apiName}] ÉCHEC après ${elapsed}s | Raison : ${errMsg}`);
            throw new Error(errMsg);
        }
    };

    // --- 3. LANCEMENT PARALLÈLE ---
    const zerionPromise = fetchWithDetailedLogs(
        "ZERION",
        `https://api.zerion.io/v1/wallets/${walletAddress}/positions?filter[positions]=no_filter`,
        { method: 'GET', headers: zerionHeaders, cache: 'no-store' },
        8000
    );

    const coinstatsBalancePromise = fetchWithDetailedLogs(
        "COINSTATS_BALANCE",
        `https://api.coinstats.app/v1/wallet/balance?address=${walletAddress}&blockchain=all`,
        { method: 'GET', headers: csHeaders, cache: 'no-store' },
        60000
    );

    // NOUVEAU : Requête dédiée pour les positions DeFi CoinStats
    const coinstatsDefiPromise = fetchWithDetailedLogs(
        "COINSTATS_DEFI",
        `https://api.coinstats.app/v1/wallet/defi?address=${walletAddress}&blockchain=all`,
        { method: 'GET', headers: csHeaders, cache: 'no-store' },
        60000
    );

    // On attend que les TROIS appels terminent
    const [zerionResult, csBalanceResult, csDefiResult] = await Promise.allSettled([
        zerionPromise,
        coinstatsBalancePromise,
        coinstatsDefiPromise
    ]);

    // --- 4. TRAITEMENT DE ZERION ---
    if (zerionResult.status === "fulfilled") {
        try {
            const zerionAssets = normalizeZerionAssets(zerionResult.value.data, walletAddress, chainIconsMap);
            allAssets = [...allAssets, ...zerionAssets];
            console.log(`✅ [ZERION] Traitement réussi : ${zerionAssets.length} actifs trouvés.`);
        } catch (err: any) {
            console.error("❌ [ZERION] Erreur de parsing :", err.message);
            errors.push({ source: "zerion_parse", reason: err.message });
        }
    } else {
        errors.push({ source: "zerion", reason: String(zerionResult.reason) });
    }

    // --- 5. TRAITEMENT DE COINSTATS (BALANCES) ---
    if (csBalanceResult.status === "fulfilled") {
        try {
            const items = Array.isArray(csBalanceResult.value) ? csBalanceResult.value : (csBalanceResult.value.result || csBalanceResult.value.data || []);
            let csCount = 0;
            items.forEach((item: any) => {
                if (item.balances && Array.isArray(item.balances)) {
                    const groupChain = item.blockchain || item.connectionId || "unknown";
                    const tokens = item.balances.map((it: any) => {
                        it.chain = it.chain || groupChain;
                        return normalizeCoinstatsToken(it, walletAddress, chainIconsMap);
                    });
                    allAssets = [...allAssets, ...tokens];
                    csCount += tokens.length;
                }
                else if (item.balance !== undefined || item.amount !== undefined) {
                    allAssets.push(normalizeCoinstatsToken(item, walletAddress, chainIconsMap));
                    csCount++;
                }
            });
            console.log(`✅ [COINSTATS BALANCE] Traitement réussi : ${csCount} actifs trouvés.`);
        } catch (err: any) {
            console.error("❌ [COINSTATS BALANCE] Erreur de parsing :", err.message);
            errors.push({ source: "coinstats_parse", reason: err.message });
        }
    } else {
        errors.push({ source: "coinstats", reason: String(csBalanceResult.reason) });
    }

    // --- 6. TRAITEMENT DE COINSTATS (DEFI) ---
    if (csDefiResult.status === "fulfilled") {
        try {
            const items = Array.isArray(csDefiResult.value) ? csDefiResult.value : (csDefiResult.value.result || csDefiResult.value.data || []);
            let defiCount = 0;
            items.forEach((item: any) => {
                // NOUVEAU : Utilisation de votre fonction normalizeCoinstatsDefi
                allAssets.push(normalizeCoinstatsDefi(item, walletAddress, chainIconsMap));
                defiCount++;
            });
            console.log(`✅ [COINSTATS DEFI] Traitement réussi : ${defiCount} positions trouvées.`);
        } catch (err: any) {
            console.error("❌ [COINSTATS DEFI] Erreur de parsing :", err.message);
            errors.push({ source: "coinstats_defi_parse", reason: err.message });
        }
    } else {
        errors.push({ source: "coinstats_defi", reason: String(csDefiResult.reason) });
    }

    console.log(`=================================================`);
    console.log(`🏁 FIN ORCHESTRATEUR : ${allAssets.length} actifs au total`);
    console.log(`=================================================\n`);

    // (Le formatage final de l'étape 6 reste inchangé)

    // --- 6. FORMATAGE ET RETOUR ---
    return {
        assets: allAssets,
        native: allAssets.filter(a => a.assetType === 'native'),
        tokens: allAssets.filter(a => a.positionType === 'wallet' && a.assetType !== 'native'),
        defi: allAssets.filter(a => a.positionType === 'defi'),
        partial: errors.length > 0,
        errors
    };
}