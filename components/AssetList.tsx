'use client';
import { useState, useRef, useEffect, useMemo } from 'react';
import TokenIcon from './TokenIcon';

const NetworkAvatar = ({ name, iconUrl, className = '' }: { name: string; iconUrl?: string; className?: string }) => {
  const [hasError, setHasError] = useState(false);

  if (hasError || !iconUrl) {
    return <img src="/globe.svg" alt="Default Network" className={`object-cover bg-background p-[2px] ${className}`} />;
  }

  return (
    <img
      src={iconUrl}
      alt={name}
      className={`object-cover bg-background ${className}`}
      onError={() => setHasError(true)}
    />
  );
};

export default function AssetList({ assets }: { assets: any[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNetworkId, setSelectedNetworkId] = useState('All');
  const [selectedAsset, setSelectedAsset] = useState('Tokens');
  const [selectedDefiType, setSelectedDefiType] = useState('All');

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setIsDropdownOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const networks = useMemo(() => {
    const uniqueNetworks = new Map();
    assets.forEach((a) => {
      const netKey = a.chain || 'unknown';
      if (netKey !== 'unknown') {
        const existing = uniqueNetworks.get(netKey);
        uniqueNetworks.set(netKey, {
          id: netKey,
          name: a.chainName || netKey,
          icon: a.chainIcon || (existing ? existing.icon : null),
        });
      }
    });
    return [{ id: 'All', name: 'All Networks', icon: null }, ...Array.from(uniqueNetworks.values())];
  }, [assets]);

  const filteredAssets = useMemo(() => {
    return assets.filter((asset: any) => {
      const name = (asset.name || '').toLowerCase();
      const symbol = (asset.symbol || '').toLowerCase();

      const matchesSearch = name.includes(searchTerm.toLowerCase()) || symbol.includes(searchTerm.toLowerCase());
      const matchesNetwork = selectedNetworkId === 'All' || String(asset.chain) === String(selectedNetworkId);

      const matchesTab =
        selectedAsset === 'Tokens'
          ? asset.positionType === 'wallet'
          : selectedAsset === 'DeFi'
            ? asset.positionType === 'defi'
            : asset.positionType === 'nft';

      const matchesDefiType =
        selectedAsset !== 'DeFi' || selectedDefiType === 'All' || asset.assetType === selectedDefiType;

      return matchesSearch && matchesNetwork && matchesTab && matchesDefiType;
    });
  }, [assets, searchTerm, selectedNetworkId, selectedAsset, selectedDefiType]);

  const activeNetwork = networks.find((n) => n.id === selectedNetworkId) || networks[0];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Flat Tabs */}
        <div className="flex bg-background rounded-xl border border-card p-1 overflow-hidden">
          <button
            onClick={() => setSelectedAsset('Tokens')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${selectedAsset === 'Tokens' ? 'bg-[#2b7fff] text-white' : 'text-secondary hover:text-foreground'}`}
          >
            Tokens
          </button>
          <button
            onClick={() => setSelectedAsset('DeFi')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${selectedAsset === 'DeFi' ? 'bg-[#2b7fff] text-white' : 'text-secondary hover:text-foreground'}`}
          >
            DeFi
          </button>
          <button
            onClick={() => setSelectedAsset('NFTs')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${selectedAsset === 'NFTs' ? 'bg-[#2b7fff] text-white' : 'text-secondary hover:text-foreground'}`}
          >
            NFTs
          </button>
        </div>

        <input
          type="text"
          placeholder="Search..."
          className="flex-1 bg-background border border-card text-foreground rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 placeholder-secondary transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="relative min-w-[180px]" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full bg-background border border-card text-foreground rounded-xl px-4 py-2 text-sm focus:outline-none flex items-center justify-between hover:bg-hover transition-colors h-full"
          >
            <div className="flex items-center gap-2">
              {activeNetwork.id !== 'All' && (
                <NetworkAvatar
                  name={activeNetwork.name}
                  iconUrl={activeNetwork.icon}
                  className="w-4 h-4 rounded-full"
                />
              )}
              <span className="truncate">{activeNetwork.name}</span>
            </div>
            <svg
              className={`w-4 h-4 ml-2 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 z-50 mt-2 w-full bg-card border border-card rounded-xl py-2 px-2 overflow-hidden max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-secondary">
              {networks.map((net) => (
                <button
                  key={net.id}
                  className="w-full text-left px-4 py-2.5 text-sm text-secondary rounded-xl hover:bar-button-hover hover:text-foreground flex items-center gap-2 transition-colors"
                  onClick={() => {
                    setSelectedNetworkId(net.id);
                    setIsDropdownOpen(false);
                  }}
                >
                  {net.id !== 'All' && (
                    <NetworkAvatar name={net.name} iconUrl={net.icon} className="w-4 h-4 rounded-full" />
                  )}
                  <span className="truncate">{net.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* BLOCK 1: TOKENS */}
      {selectedAsset === 'Tokens' && (
        <div className="space-y-2">
          <div className="grid grid-cols-3 gap-3 px-4 py-2">
            <p className="text-secondary text-xs font-bold uppercase tracking-wider">Asset</p>
            <p className="text-secondary text-xs font-bold uppercase tracking-wider text-center">Price</p>
            <p className="text-secondary text-xs font-bold uppercase tracking-wider text-right">Value</p>
          </div>

          <div className="space-y-1">
            {filteredAssets.length > 0 ? (
              filteredAssets.map((asset, index) => {
                const quantity = Number(asset.balance ?? asset.quantity ?? asset.formattedBalance ?? 0);
                const valueUsd = Number(asset.valueUsd ?? asset.value ?? 0);
                const priceUsd = Number(asset.priceUsd ?? asset.price ?? 0);

                return (
                  <div
                    key={`${asset.id}-${index}`}
                    className="grid grid-cols-3 items-center px-4 py-3 border-b border-card rounded-xl hover:bar-button-hover transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative shrink-0">
                        <TokenIcon asset={asset} />
                        <NetworkAvatar
                          name={asset.chainName}
                          iconUrl={asset.chainIcon}
                          className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-foreground font-medium text-sm truncate">{asset.name}</p>
                        <p className="text-secondary text-[10px] uppercase font-bold truncate">{asset.chainName}</p>
                      </div>
                    </div>

                    <div className="text-center">
                      <p className="text-secondary text-sm font-medium">
                        ${priceUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-foreground font-bold text-sm">
                        ${valueUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                      <p className="text-secondary text-xs">
                        {quantity.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{' '}
                        {asset.symbol}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-secondary text-center py-8">No assets found.</p>
            )}
          </div>
        </div>
      )}

      {/* BLOCK 2: DEFI */}
      {selectedAsset === 'DeFi' && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2 overflow-x-auto scrollbar-none">
            {['All', 'staking', 'lp', 'lending_supply', 'lending_borrow', 'vault'].map((type) => (
              <button
                key={type}
                onClick={() => setSelectedDefiType(type)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                  selectedDefiType === type
                    ? 'bg-[#2b7fff] text-white'
                    : 'bg-background text-secondary hover:text-foreground'
                }`}
              >
                {type === 'lp' ? 'Liquidity' : type.replace('_', ' ')}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-3 px-4 py-2">
            <p className="text-secondary text-xs font-bold uppercase tracking-wider">Protocol / Asset</p>
            <p className="text-secondary text-xs font-bold uppercase tracking-wider text-center">Price</p>
            <p className="text-secondary text-xs font-bold uppercase tracking-wider text-right">Value</p>
          </div>

          <div className="space-y-1">
            {filteredAssets.length > 0 ? (
              filteredAssets.map((asset, index) => {
                const quantity = Number(asset.balance ?? asset.quantity ?? asset.formattedBalance ?? 0);
                const valueUsd = Number(asset.valueUsd ?? asset.value ?? 0);
                const priceUsd = Number(asset.priceUsd ?? asset.price ?? 0);

                return (
                  <div
                    key={`${asset.id}-${index}`}
                    className="grid grid-cols-3 items-center px-4 py-3 rounded-xl border-b border-card hover:bar-button-hover transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative shrink-0">
                        <TokenIcon asset={asset} />
                        <NetworkAvatar
                          name={asset.chainName}
                          iconUrl={asset.chainIcon}
                          className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-foreground font-medium text-sm truncate">{asset.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <p className="text-secondary text-[10px] uppercase font-bold truncate">{asset.chainName}</p>
                          <span
                            className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded ${
                              asset.assetType === 'staking'
                                ? 'bg-emerald-500/10 text-emerald-500'
                                : asset.assetType === 'lp'
                                  ? 'bg-amber-500/10 text-amber-500'
                                  : asset.assetType === 'lending_supply' || asset.assetType === 'lending_borrow'
                                    ? 'bg-purple-500/10 text-purple-500'
                                    : 'bg-blue-500/10 text-blue-500'
                            }`}
                          >
                            {asset.protocol || asset.assetType?.replace('_', ' ') || asset.positionType}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-center">
                      <p className="text-secondary text-sm font-medium">
                        ${priceUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-foreground font-bold text-sm">
                        ${valueUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                      <p className="text-secondary text-xs">
                        {quantity.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{' '}
                        {asset.symbol}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-secondary text-center py-8">No DeFi positions found.</p>
            )}
          </div>
        </div>
      )}

      {/* BLOCK 3: NFTs */}
      {selectedAsset === 'NFTs' && <div></div>}
    </div>
  );
}
