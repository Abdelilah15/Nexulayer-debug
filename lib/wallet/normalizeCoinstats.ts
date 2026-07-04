import type { Asset } from "./types";

type AnyObj = Record<string, any>;

// Dictionnaire d'alias
function getStandardChain(rawChain: string): string {
    let lower = String(rawChain).toLowerCase().trim();
    lower = lower.replace('-network', '')
                 .replace('_network', '')
                 .replace(' chain', '');
                 
    const aliases: Record<string, string> = {
        "binance_smart": "binance-smart-chain",
        "bsc": "binance-smart-chain",
        "binance": "binance-smart-chain",
        "optimistic-ethereum": "optimism",
        "polygon-pos": "polygon",
        "matic": "polygon",
        "arbitrum-one": "arbitrum",
        "avalanche-c-chain": "avalanche",
        "avax": "avalanche",
        "zksync": "zksync-era",
        "xdai": "gnosis",
        "ftm": "fantom",
        "eth": "ethereum"
    };
    return aliases[lower] || lower;
}

// NOUVEAU : Dictionnaire d'icônes de secours pour les réseaux inconnus de Zerion
const FALLBACK_CHAIN_ICONS: Record<string, string> = {
    "plume": "https://pbs.twimg.com/profile_images/1861783857508212736/i0o998uW_400x400.jpg",
    "story": "https://pbs.twimg.com/profile_images/1841120015509938176/qU3H1Gdb_400x400.jpg",
    "taiko": "https://raw.githubusercontent.com/taikoxyz/taiko-mono/main/packages/branding/taiko-logo.png",
    "morph": "https://pbs.twimg.com/profile_images/1848375688647970816/F1n2hIu1_400x400.jpg",
    "lisk": "https://cryptologos.cc/logos/lisk-lsk-logo.png",
    "telos": "https://cryptologos.cc/logos/telos-tlos-logo.png",
    "boba": "https://cryptologos.cc/logos/boba-network-boba-logo.png",
    "canto": "https://s2.coinmarketcap.com/static/img/coins/64x64/21516.png",
    "kava": "https://cryptologos.cc/logos/kava-kava-logo.png",
    "metis": "https://cryptologos.cc/logos/metisdao-metis-logo.png"
};

export function normalizeCoinstatsToken(
    item: AnyObj, 
    wallet: string,
    chainIconsMap: Record<string, string> 
): Asset {
    const rawChain = item?.chain || item?.network || item?.blockchain || "unknown";
    const standardChain = getStandardChain(rawChain);
    const chainName = standardChain.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    
    // NOUVEAU : On cherche dans Zerion, puis dans notre liste de secours
    const chainIcon = chainIconsMap[standardChain] || FALLBACK_CHAIN_ICONS[standardChain] || null;
    
    const quantity = Number(item?.amount || item?.balance || 0);
    const priceUsd = Number(item?.price || 0);
    const valueUsd = quantity * priceUsd;

    const rawContract = item?.contractAddress || null;
    
    // NOUVEAU : Identification stricte des adresses "0xeeee..." de CoinStats
    const isNative = !rawContract || 
                     rawContract.toLowerCase() === "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee" || 
                     rawContract.toLowerCase() === "native" ||
                     rawContract.toLowerCase() === "0x0000000000000000000000000000000000000000";

    // Si c'est natif, on force à null (comme le fait Zerion) pour éviter les doublons
    const contractAddress = isNative ? null : rawContract.toLowerCase();

    const symbol = item?.symbol || item?.coin?.symbol || "UNKNOWN";
    const name = item?.name || item?.coin?.name || symbol;

    return {
        wallet,
        chain: standardChain,
        chainId: 0,
        chainName,
        chainIcon, 
        icon: item?.imgUrl || item?.icon || null, 
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
    
    const chainIcon = chainIconsMap[standardChain] || FALLBACK_CHAIN_ICONS[standardChain] || null;

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

    const rawContract = item?.contractAddress || coinInfo?.contractAddress || null;
    const isNative = !rawContract || 
                     rawContract.toLowerCase() === "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee" || 
                     rawContract.toLowerCase() === "native" ||
                     rawContract.toLowerCase() === "0x0000000000000000000000000000000000000000";

    const contractAddress = isNative ? null : rawContract.toLowerCase();
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
        contractAddress,
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