import type { Asset } from "./types";

type AnyObj = Record<string, any>;

export function normalizeZerionItem(
    item: AnyObj,
    wallet: string,
    chainIconsMap: Record<string, string>): Asset | null {
    // On cible correctement le niveau "attributes" du JSON de Zerion
    const attrs = item?.attributes || {};
    const tokenInfo = attrs.fungible_info || {};

    // 1. Réseau
    const chainKey = item?.relationships?.chain?.data?.id || attrs.chain || "unknown";
    const chainName = chainKey.split('-').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    const chainIcon = chainIconsMap[chainKey] || null;

    // 2. Types de position (Détection Wallet vs DeFi)
    const isWallet = attrs.position_type === 'wallet';
    const positionType = isWallet ? "wallet" : "defi";
    const assetType = isWallet ? "erc20" : "vault"; 

    // 3. Propriétés du jeton (Correction des chemins)
    const symbol = tokenInfo.symbol || attrs.symbol || "UNKNOWN";
    const name = tokenInfo.name || attrs.name || "Unknown Token";
    const decimals = tokenInfo.decimals || attrs.decimals || 18;
    
    // ✅ Correction : Ajout de l'icône du jeton
    const icon = tokenInfo.icon?.url || attrs.icon?.url || null;

    const contractAddress = tokenInfo.implementations?.[0]?.address || attrs.contract_address || null;

    const rawBalance = attrs.quantity?.int || item?.quantity?.int || "0";
    const formattedBalanceStr = attrs.quantity?.numeric || item?.quantity?.numeric || "0";
    const quantity = Number(formattedBalanceStr) || 0;

    const priceUsd = attrs.price || tokenInfo.price || 0;
    const valueUsd = attrs.value || (quantity * priceUsd);

    // Récupération du protocole DeFi (ex: Aave, Uniswap...)
    const protocol = !isWallet ? (item?.relationships?.protocol?.data?.id || "DeFi Position") : null;

    return {
        wallet,
        chain: chainKey.toLowerCase(),
        chainId: 0,
        chainName,
        chainIcon,
        icon, // L'icône est maintenant bien transmise au frontend
        positionType,
        assetType,
        protocol,
        contractAddress,
        symbol,
        name,
        decimals,
        rawBalance,
        formattedBalance: formattedBalanceStr,
        quantity,
        priceUsd,
        valueUsd,
        source: "zerion",
        updatedAt: new Date().toISOString(),
    };
}

export function normalizeZerionAssets(
    items: AnyObj[], wallet: string, chainIconsMap: Record<string, string>): Asset[] {
    const out: Asset[] = [];
    for (const it of items || []) {
        const n = normalizeZerionItem(it, wallet, chainIconsMap)
        if (n) out.push(n);
    }
    return out;
}