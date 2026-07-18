'use client';
import React from 'react';

interface Socials {
  website: string;
  twitter: string;
  discord: string;
  telegram: string;
  farcaster: string;
  github: string;
  tags: string;
}

interface AdvancedSettingsProps {
  activeTab: string;
  description: string;
  setDescription: (desc: string) => void;
  socials: Socials;
  setSocials: (socials: Socials) => void;
  royaltyFee: string;
  setRoyaltyFee: (fee: string) => void;
}

export default function AdvancedSettings({
  activeTab,
  description,
  setDescription,
  socials,
  setSocials,
  royaltyFee,
  setRoyaltyFee
}: AdvancedSettingsProps) {
  return (
  <div className="animate-in slide-in-from-top-4 duration-300 pt-1 sm:pt-2">
    <h4 className="text-accent text-sm sm:text-base font-medium mb-3 sm:mb-4 flex items-center gap-2">
      Advanced Settings
    </h4>
    
    <div className="space-y-4 sm:space-y-5">
      <div>
        <label className="block text-xs sm:text-sm font-medium text-secondary mb-1.5 sm:mb-2">
          Detailed Description
        </label>
        <textarea
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={`Describe your ${activeTab === 'nft' || activeTab === 'erc1155' ? 'NFT collection' : 'Token project'}...`}
          className="w-full border border-card rounded-lg sm:rounded-xl p-3 sm:p-4 text-sm sm:text-base text-foreground focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
        />
      </div>
      
      {/* Socials */}
      <div className="pt-1 sm:pt-2">
        <label className="block text-xs sm:text-sm font-medium text-secondary mb-2 sm:mb-3">
          Socials & Links
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3">
          <input 
            type="text" 
            placeholder="Website (e.g. https://...)" 
            value={socials.website} 
            onChange={(e) => setSocials({ ...socials, website: e.target.value })} 
            className="w-full border border-card rounded-lg sm:rounded-xl p-3 sm:p-4 text-sm sm:text-base text-foreground focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all" 
          />
          <input 
            type="text" 
            placeholder="X / Twitter (e.g. @project)" 
            value={socials.twitter} 
            onChange={(e) => setSocials({ ...socials, twitter: e.target.value })} 
            className="w-full border border-card rounded-lg sm:rounded-xl p-3 sm:p-4 text-sm sm:text-base text-foreground focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all" 
          />
          <input 
            type="text" 
            placeholder="Discord (Invite Link)" 
            value={socials.discord} 
            onChange={(e) => setSocials({ ...socials, discord: e.target.value })} 
            className="w-full border border-card rounded-lg sm:rounded-xl p-3 sm:p-4 text-sm sm:text-base text-foreground focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all" 
          />
          <input 
            type="text" 
            placeholder="Telegram" 
            value={socials.telegram} 
            onChange={(e) => setSocials({ ...socials, telegram: e.target.value })} 
            className="w-full border border-card rounded-lg sm:rounded-xl p-3 sm:p-4 text-sm sm:text-base text-foreground focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all" 
          />
          <input 
            type="text" 
            placeholder="Farcaster" 
            value={socials.farcaster} 
            onChange={(e) => setSocials({ ...socials, farcaster: e.target.value })} 
            className="w-full border border-card rounded-lg sm:rounded-xl p-3 sm:p-4 text-sm sm:text-base text-foreground focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all" 
          />
          <input 
            type="text" 
            placeholder="Github / Docs" 
            value={socials.github} 
            onChange={(e) => setSocials({ ...socials, github: e.target.value })} 
            className="w-full border border-card rounded-lg sm:rounded-xl p-3 sm:p-4 text-sm sm:text-base text-foreground focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all" 
          />
        </div>
      </div>

      {/* Royalties - Conditionnelles pour les NFTs */}
      {(activeTab === 'nft' || activeTab === 'erc1155') && (
        <div className="pt-2 sm:pt-4">
          <label className="block text-xs sm:text-sm font-medium text-secondary mb-1.5 sm:mb-2">
            Royalties (OpenSea resales)
          </label>
          <div className="flex items-center gap-2.5 sm:gap-3">
            <input 
              type="number" 
              min="0" 
              max="100" 
              placeholder="Ex: 5" 
              value={Number(royaltyFee) / 100} 
              onChange={(e) => setRoyaltyFee((Number(e.target.value) * 100).toString())} 
              className="w-20 sm:w-24 border border-card rounded-lg sm:rounded-xl p-3 sm:p-4 text-sm sm:text-base text-foreground focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all" 
            />
            <span className="text-secondary text-xs sm:text-sm">% (sent to your address)</span>
          </div>
        </div>
      )}
    </div>
  </div>
);
}