export type PositionType = "wallet" | "defi" | "nft";

export type AssetType =
  | "native"
  | "erc20"
  | "lp"
  | "lending_supply"
  | "lending_borrow"
  | "staking"
  | "vault"
  | "reward"
  | "nft"
  | "unknown";

export type Asset = {
  // identité
  id?: string;
  wallet: string;
  chain: string;
  chainId?: number;
  chainName?: string;
  chainIcon?: string | null;
  icon?: string | null;

  // classification
  positionType: PositionType;
  assetType: AssetType;
  protocol?: string | null;

  // token/NFT
  contractAddress: string | null;
  tokenId?: string | null; // pour nft
  symbol: string;
  name: string;
  decimals: number;

  // montants
  rawBalance: string;        // bigint sérialisé
  formattedBalance: string;  // quantité human-readable
  quantity?: number;         // pratique pour UI existante
  priceUsd?: number | null;
  valueUsd?: number | null;

  // provenance
  source: "zerion" | "zapper" | "coinstats";
  updatedAt: string;
};

export type ApiError = {
  source: string;
  reason: string;
};

export type CombinedAssetsResponse = {
  assets: Asset[];
  native: Asset[];
  tokens: Asset[];
  defi: Asset[];
  partial: boolean;
  errors: ApiError[];
};