'use client';
import React from 'react';
import { useAccount } from 'wagmi';

export default function NetworkAlert() {
  const { chainId } = useAccount();
  const isSepolia = chainId === 84532;

  if (!isSepolia) return null;

  return (
    <div className="mb-6 sm:mb-8 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
      <i className="fi fi-rr-info text-yellow-600 text-xl"></i>
      <div>
        <h4 className="text-yellow-700 font-bold text-sm sm:text-base">Testnet Mode Active</h4>
        <p className="text-yellow-600/80 text-xs sm:text-sm">
          You are currently on <strong>Base Sepolia</strong>. Credits purchased here are for <strong>testing purposes only</strong> and have no real-world value.
        </p>
      </div>
    </div>
  );
}
