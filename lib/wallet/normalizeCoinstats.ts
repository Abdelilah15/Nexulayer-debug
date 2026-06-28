import type { Asset } from "./types";

type AnyObj = Record<string, any>;

// Dictionnaire d'alias pour aligner le vocabulaire de CoinStats sur celui de Zerion
function getStandardChain(rawChain: string): string {
    const lower = String(rawChain).toLowerCase().trim();
    const aliases: Record<string, string> = {
        "binance_smart": "binance-smart-chain",
        "bsc": "binance-smart-chain",
        "optimistic-ethereum": "optimism",
        "polygon-pos": "polygon",
        "arbitrum-one": "arbitrum",
        "avalanche-c-chain": "avalanche",
        "matic": "polygon",
    };
    return aliases[lower] || lower;
}

export function normalizeCoinstatsToken(
    item: AnyObj, 
    wallet: string,
    chainIconsMap: Record<string, string> // <-- On importe le dictionnaire d'icônes
): Asset {
    const rawChain = item?.chain || item?.network || item?.blockchain || "unknown";
    const standardChain = getStandardChain(rawChain);
    
    // Formate joli: "Binance-smart-chain" -> "Binance Smart Chain"
    const chainName = standardChain.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    
    // On peut maintenant utiliser l'icône de Zerion car le nom correspond !
    const chainIcon = chainIconsMap[standardChain] || null;
    
    const quantity = Number(item?.amount || item?.balance || 0);
    const priceUsd = Number(item?.price || 0);
    const valueUsd = quantity * priceUsd;

    const contractAddress = item?.contractAddress || null;
    const isNative = !contractAddress || contractAddress === "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee" || contractAddress === "native";

    const symbol = item?.symbol || item?.coin?.symbol || "UNKNOWN";
    const name = item?.name || item?.coin?.name || symbol; // Fallback sur le symbole

    return {
        wallet,
        chain: standardChain,
        chainId: 0,
        chainName,
        chainIcon, 
        icon: item?.imgUrl || item?.icon || null, // Prise en compte de imgUrl
        positionType: "wallet",
        assetType: isNative ? "native" : "erc20",
        protocol: null,
        contractAddress,
        symbol,
        name,
        decimals: item?.decimals || 18,
        rawBalance: "0",
        formattedBalance: String(quantity),
        quantity,
        priceUsd,
        valueUsd,
        source: "coinstats",
        updatedAt: new Date().toISOString(),
    };
}

export function normalizeCoinstatsDefi(
    item: AnyObj, 
    wallet: string,
    chainIconsMap: Record<string, string>
): Asset {
    const coinInfo = item?.coin || item?.token || {};
    
    const rawChain = item?.chain || item?.network || coinInfo?.chain || "unknown";
    const standardChain = getStandardChain(rawChain);
    const chainName = standardChain.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    const chainIcon = chainIconsMap[standardChain] || null;

    const quantity = Number(item?.amount || item?.balance || coinInfo?.amount || 0);
    const priceUsd = Number(item?.price || coinInfo?.price || 0);
    const valueUsd = Number(item?.value || item?.usdValue || (quantity * priceUsd));

    const rawType = String(item?.type || "vault").toLowerCase();
    let assetType: Asset["assetType"] = "vault";
    if (rawType.includes("stake") || rawType.includes("staking")) assetType = "staking";
    if (rawType.includes("lend") || rawType.includes("supply")) assetType = "lending_supply";
    if (rawType.includes("borrow")) assetType = "lending_borrow";
    if (rawType.includes("pool") || rawType.includes("lp") || rawType.includes("liquidity")) assetType = "lp";
    if (rawType.includes("reward")) assetType = "reward";

    const symbol = coinInfo?.symbol || item?.symbol || "UNKNOWN";
    const name = coinInfo?.name || item?.name || symbol;

    return {
        wallet,
        chain: standardChain,
        chainId: 0,
        chainName,
        chainIcon, 
        icon: item?.imgUrl || item?.icon || coinInfo?.icon || null,
        positionType: "defi",
        assetType,
        protocol: item?.protocol || item?.name || "DeFi Position",
        contractAddress: item?.contractAddress || coinInfo?.contractAddress || null,
        symbol,
        name,
        decimals: coinInfo?.decimals || item?.decimals || 18,
        rawBalance: "0",
        formattedBalance: String(quantity),
        quantity,
        priceUsd,
        valueUsd,
        source: "coinstats",
        updatedAt: new Date().toISOString(),
    };
}