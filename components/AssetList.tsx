'use client';
import { useState, useRef, useEffect, useMemo } from "react";
import TokenIcon from "./TokenIcon";

const NetworkAvatar = ({ name, iconUrl, className = "" }: { name: string, iconUrl?: string, className?: string }) => {
    const [hasError, setHasError] = useState(false);

    // ❌ Plus de pastille ! S'il n'y a pas d'image, on utilise le globe
    if (hasError || !iconUrl) {
        return (
            <img src="/globe.svg" alt="Default Network" className={`object-cover bg-card p-[2px] ${className}`} />
        );
    }

    return (
        <img
            src={iconUrl}
            alt={name}
            className={`object-cover bg-card ${className}`}
            onError={() => setHasError(true)}
        />
    );
};

export default function AssetList({ assets }: { assets: any[] }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedNetworkId, setSelectedNetworkId] = useState('Tous');
    const [selectedAsset, setSelectedAsset] = useState('Tokens');
    const [selectedDefiType, setSelectedDefiType] = useState('Tous');

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setIsDropdownOpen(false);
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Extraction des réseaux possédés (on utilise maintenant chainId et chainName)
    const networks = useMemo(() => {
        const uniqueNetworks = new Map();
        assets.forEach(a => {
            const netKey = a.chain || "unknown";
            if (netKey !== "unknown") {
                const existing = uniqueNetworks.get(netKey);
                uniqueNetworks.set(netKey, {
                    id: netKey,
                    name: a.chainName || netKey,
                    // ✅ Ne remplace jamais une icône valide par 'null'
                    icon: a.chainIcon || (existing ? existing.icon : null)
                });
            }
        });
        return [{ id: 'Tous', name: 'Tous les réseaux', icon: null }, ...Array.from(uniqueNetworks.values())];
    }, [assets]);

    const filteredAssets = useMemo(() => {
        return assets.filter((asset: any) => {
            const name = (asset.name || "").toLowerCase();
            const symbol = (asset.symbol || "").toLowerCase();

            const matchesSearch =
                name.includes(searchTerm.toLowerCase()) ||
                symbol.includes(searchTerm.toLowerCase());

            // ✅ Filtrage basé sur `chain` au lieu de `chainId`
            const matchesNetwork =
                selectedNetworkId === "Tous" || String(asset.chain) === String(selectedNetworkId);

            const matchesTab =
                selectedAsset === "Tokens"
                    ? asset.positionType === "wallet"
                    : selectedAsset === "DeFi"
                        ? asset.positionType === "defi"
                        : asset.positionType === "nft";

            const matchesDefiType = 
                selectedAsset !== "DeFi" || 
                selectedDefiType === "Tous" || 
                asset.assetType === selectedDefiType;

            return matchesSearch && matchesNetwork && matchesTab && matchesDefiType;
        });
    }, [assets, searchTerm, selectedNetworkId, selectedAsset]);

    const activeNetwork = networks.find(n => n.id === selectedNetworkId) || networks[0];


    return (
        <div className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex gap-0 rounded-xl overflow-hidden border border-card">
                    <button onClick={() => setSelectedAsset('Tokens')} className={`px-3 py-2 text-sm focus:outline-none transition-all ${selectedAsset === 'Tokens' ? "bg-accent/20 text-accent border-r border-card" : "bg-card text-secondary hover:bg-hover"}`}>Tokens</button>
                    <button onClick={() => setSelectedAsset('DeFi')} className={`px-3 py-2 text-sm focus:outline-none transition-all border-r border-card ${selectedAsset === 'DeFi' ? "bg-accent/20 text-accent" : "bg-card text-secondary hover:bg-hover"}`}>DeFi</button>
                    <button onClick={() => setSelectedAsset('NFTs')} className={`px-3 py-2 text-sm focus:outline-none transition-all ${selectedAsset === 'NFTs' ? "bg-accent/20 text-accent" : "bg-card text-secondary hover:bg-hover"}`}>NFTs</button>
                </div>

                <input
                    type="text"
                    placeholder="Rechercher..."
                    className="flex-1 bg-card border border-card text-foreground rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-accent/50 placeholder-secondary"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                <div className="relative min-w-[180px]" ref={dropdownRef}>
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="w-full bg-card border border-card text-foreground rounded-xl px-3 py-2 text-sm focus:outline-none flex items-center justify-between hover:bg-hover transition-all h-full"
                    >
                        <div className="flex items-center gap-2">
                            {activeNetwork.id !== 'Tous' && (
                                <NetworkAvatar name={activeNetwork.name} iconUrl={activeNetwork.icon} className="w-4 h-4 rounded-full" />
                            )}
                            <span className="truncate">{activeNetwork.name}</span>
                        </div>
                        <svg className={`w-4 h-4 ml-2 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </button>

                    {isDropdownOpen && (
                        <div className="absolute right-0 z-50 mt-2 w-full bg-card border border-card rounded-xl shadow-custom overflow-hidden max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-secondary">
                            {networks.map(net => (
                                <button
                                    key={net.id}
                                    className="w-full text-left px-4 py-2 text-sm text-secondary hover:bg-hover hover:text-foreground flex items-center gap-2 transition-all"
                                    onClick={() => { setSelectedNetworkId(net.id); setIsDropdownOpen(false); }}
                                >
                                    {net.id !== 'Tous' && (
                                        <NetworkAvatar name={net.name} iconUrl={net.icon} className="w-4 h-4 rounded-full" />
                                    )}
                                    <span className="truncate">{net.name}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* BLOC 1 : TOKENS (Séparé et préparé pour l'avenir) */}
            {selectedAsset === 'Tokens' && (
                <div className="space-y-2">
                    <div className="grid grid-cols-3 gap-3 p-3 bg-card/50 rounded-xl border border-card">
                        <p className="text-secondary text-xs font-bold">Actif</p>
                        <p className="text-secondary text-xs font-bold text-center">Cours</p>
                        <p className="text-secondary text-xs font-bold text-right">Valeur</p>
                    </div>

                    <div className="space-y-1">
                        {filteredAssets.length > 0 ? (
                            filteredAssets.map((asset, index) => {
                                // 🛡️ FALLBACKS POUR LES TOKENS
                                const quantity = Number(asset.balance ?? asset.quantity ?? asset.formattedBalance ?? 0);
                                const valueUsd = Number(asset.valueUsd ?? asset.value ?? 0);
                                const priceUsd = Number(asset.priceUsd ?? asset.price ?? 0);

                                return (
                                    <div key={`${asset.id}-${index}`} className="grid grid-cols-3 items-center p-3 bg-card/30 rounded-xl border border-transparent hover:bg-card/80 hover:border-card transition-all shadow-custom">
                                        {/* Colonne 1 : Pas d'overflow-hidden pour laisser respirer le badge entier */}
                                        <div className="flex items-center gap-3">
                                            <div className="relative shrink-0">
                                                <TokenIcon asset={asset} />
                                                <NetworkAvatar name={asset.chainName} iconUrl={asset.chainIcon} className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-card z-10 shadow-sm" />
                                            </div>

                                            <div className="min-w-0">
                                                <p className="text-foreground font-medium text-sm truncate">{asset.name}</p>
                                                <p className="text-secondary text-[10px] uppercase font-bold truncate">{asset.chainName}</p>
                                            </div>
                                        </div>

                                        {/* Colonne 2 : Cours (Utilisation de priceUsd) */}
                                        <div className="text-center">
                                            <p className="text-secondary text-sm font-medium">
                                                ${priceUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </p>
                                        </div>

                                        {/* Colonne 3 : Valeur & Balance (Utilisation de valueUsd et quantity) */}
                                        <div className="text-right">
                                            <p className="text-foreground font-bold text-sm">
                                                ${valueUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </p>
                                            <p className="text-secondary text-xs">
                                                {quantity.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {asset.symbol}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <p className="text-secondary text-center py-4">Aucun actif trouvé.</p>
                        )}
                    </div>
                </div>
            )}

            {/* BLOC 2 : DEFI (Séparé et préparé pour l'avenir) */}
            {selectedAsset === 'DeFi' && (
                <div className="space-y-2">
                    {/* Filtres de types DeFi */}
                    <div className="flex flex-wrap gap-2 pb-2 overflow-x-auto scrollbar-none">
                        {['Tous', 'staking', 'lp', 'lending_supply', 'lending_borrow', 'vault'].map((type) => (
                            <button
                                key={type}
                                onClick={() => setSelectedDefiType(type)}
                                className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border transition-all ${
                                    selectedDefiType === type 
                                    ? "bg-accent/20 border-accent text-accent" 
                                    : "bg-card border-card text-secondary hover:border-accent/30"
                                }`}
                            >
                                {type === 'lp' ? 'Liquidity' : type.replace('_', ' ')}
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-3 gap-3 p-3 bg-card/50 rounded-xl border border-card">
                        <p className="text-secondary text-xs font-bold">Protocole / Actif</p>
                        <p className="text-secondary text-xs font-bold text-center">Cours</p>
                        <p className="text-secondary text-xs font-bold text-right">Valeur</p>
                    </div>

                    <div className="space-y-1">
                        {filteredAssets.length > 0 ? (
                            filteredAssets.map((asset, index) => {
                                // 🛡️ FALLBACKS POUR LA DEFI
                                const quantity = Number(asset.balance ?? asset.quantity ?? asset.formattedBalance ?? 0);
                                const valueUsd = Number(asset.valueUsd ?? asset.value ?? 0);
                                const priceUsd = Number(asset.priceUsd ?? asset.price ?? 0);

                                return (
                                    <div key={`${asset.id}-${index}`} className="grid grid-cols-3 items-center p-3 bg-card/30 rounded-xl border border-transparent hover:bg-card/80 hover:border-card transition-all shadow-custom">
                                        {/* Colonne 1 : Pas d'overflow-hidden pour laisser respirer le badge entier */}
                                        <div className="flex items-center gap-3">
                                            <div className="relative shrink-0">
                                                <TokenIcon asset={asset} />
                                                <NetworkAvatar name={asset.chainName} iconUrl={asset.chainIcon} className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-card z-10 shadow-sm" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-foreground font-medium text-sm truncate">{asset.name}</p>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <p className="text-secondary text-[10px] uppercase font-bold truncate">{asset.chainName}</p>
                                                    <span className={`text-[8px] uppercase font-bold px-1.5 py-0.5 rounded border whitespace-nowrap ${
                                                        asset.assetType === 'staking' ? "bg-emerald-900/40 text-emerald-300 border-emerald-800/50" :
                                                        asset.assetType === 'lp' ? "bg-amber-900/40 text-amber-300 border-amber-800/50" :
                                                        asset.assetType === 'lending_supply' || asset.assetType === 'lending_borrow' ? "bg-purple-900/40 text-purple-300 border-purple-800/50" :
                                                        "bg-blue-900/40 text-blue-300 border-blue-800/50"
                                                    }`}>
                                                        {asset.protocol || asset.assetType?.replace('_', ' ') || asset.positionType}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Colonne 2 : Cours (Utilisation de priceUsd) */}
                                        <div className="text-center">
                                            <p className="text-secondary text-sm font-medium">
                                                ${priceUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </p>
                                        </div>

                                        {/* Colonne 3 : Valeur & Balance (Utilisation de valueUsd et quantity) */}
                                        <div className="text-right">
                                            <p className="text-foreground font-bold text-sm">
                                                ${valueUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </p>
                                            <p className="text-secondary text-xs">
                                                {quantity.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {asset.symbol}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <p className="text-secondary text-center py-4">Aucune position DeFi trouvée.</p>
                        )}
                    </div>
                </div>
            )}

            {/* BLOC 3 : NFTs (Séparé et préparé pour l'avenir) */}
            {selectedAsset === 'NFTs' && <div></div>}
        </div>
    );
}