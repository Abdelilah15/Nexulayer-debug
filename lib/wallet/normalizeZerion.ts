import type { Asset, ChainKey } from "./types";

type AnyObj = Record<string, any>;

const CHAIN_MAP: Record<string, { key: ChainKey; chainId: number; chainName: string }> = {
    plume: { key: "plume", chainId: 98866, chainName: "Plume" },
    lisk: { key: "lisk", chainId: 1135, chainName: "Lisk" },
    morph: { key: "morph", chainId: 2818, chainName: "Morph" },
};

function inferChain(raw: AnyObj): { key: ChainKey; chainId: number; chainName: string } | null {
    const candidates = [
        raw?.chain,
        raw?.network,
        raw?.chainName,
        raw?.attributes?.chain,
        raw?.attributes?.network,
        raw?.relationships?.chain?.data?.id,
    ]
        .filter(Boolean)
        .map((v: any) => String(v).toLowerCase());

    for (const c of candidates) {
        if (c.includes("plume")) return CHAIN_MAP.plume;
        if (c.includes("lisk")) return CHAIN_MAP.lisk;
        if (c.includes("morph")) return CHAIN_MAP.morph;
    }
    return null;
}

function pickNumber(...vals: any[]): number | null {
    for (const v of vals) {
        const n = Number(v);
        if (Number.isFinite(n)) return n;
    }
    return null;
}

function pickString(...vals: any[]): string | null {
    for (const v of vals) {
        if (v != null && String(v).trim() !== "") return String(v);
    }
    return null;
}

function inferPositionType(raw: AnyObj): "wallet" | "defi" {
    const t = String(
        raw?.positionType ??
        raw?.type ??
        raw?.attributes?.position_type ??
        raw?.attributes?.type ??
        ""
    ).toLowerCase();

    if (t.includes("defi") || t.includes("vault") || t.includes("staking") || t.includes("lending") || t.includes("lp")) {
        return "defi";
    }
    return "wallet";
}

function inferAssetType(raw: AnyObj, positionType: "wallet" | "defi"): Asset["assetType"] {
    const t = String(
        raw?.assetType ??
        raw?.type ??
        raw?.attributes?.asset_type ??
        raw?.attributes?.type ??
        ""
    ).toLowerCase();

    if (positionType === "wallet") {
        if (t.includes("native")) return "native";
        return "erc20";
    }

    if (t.includes("lending_borrow") || t.includes("borrow")) return "lending_borrow";
    if (t.includes("lending_supply") || t.includes("supply") || t.includes("lend")) return "lending_supply";
    if (t.includes("staking")) return "staking";
    if (t.includes("vault")) return "vault";
    if (t.includes("lp")) return "lp";
    if (t.includes("reward")) return "reward";
    return "vault";
}

/**
 * Normalise un item Zerion -> Asset
 */
export function normalizeZerionItem(item: AnyObj, wallet: string): Asset | null {
    const chain = inferChain(item);
    if (!chain) return null; // on ignore ce qui n'est pas plume/lisk/morph

    const positionType = inferPositionType(item);
    const assetType = inferAssetType(item, positionType);

    const symbol = pickString(item?.symbol, item?.attributes?.symbol, item?.fungible_info?.symbol) ?? "UNKNOWN";
    const name = pickString(item?.name, item?.attributes?.name, item?.fungible_info?.name) ?? "Unknown";
    const decimals = pickNumber(item?.decimals, item?.attributes?.decimals, item?.fungible_info?.decimals) ?? 18;

    const contractAddress =
        pickString(
            item?.contractAddress,
            item?.attributes?.contract_address,
            item?.fungible_info?.implementations?.[0]?.address
        ) ?? null;

    const rawBalance =
        pickString(
            item?.rawBalance,
            item?.attributes?.quantity?.int,
            item?.quantity?.int
        ) ?? "0";

    const formattedBalanceStr =
        pickString(
            item?.formattedBalance,
            item?.attributes?.quantity?.numeric,
            item?.quantity?.numeric
        ) ?? "0";

    const quantity = Number(formattedBalanceStr) || 0;

    const priceUsd = pickNumber(
        item?.priceUsd,
        item?.attributes?.price,
        item?.attributes?.fungible_info?.price
    );

    const valueUsd =
        pickNumber(
            item?.valueUsd,
            item?.attributes?.value,
            item?.attributes?.value_usd
        ) ?? (priceUsd != null ? quantity * priceUsd : 0);

    return {
        wallet,
        chain: chain.key,
        chainId: chain.chainId,
        chainName: chain.chainName,
        chainIcon: null,
        positionType,
        assetType,
        protocol: pickString(item?.protocol, item?.attributes?.protocol, item?.protocolName),
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

/**
 * Normalise une liste Zerion
 */
export function normalizeZerionAssets(items: AnyObj[], wallet: string): Asset[] {
    const out: Asset[] = [];
    for (const it of items || []) {
        const n = normalizeZerionItem(it, wallet);
        if (n) out.push(n);
    }
    return out;
}