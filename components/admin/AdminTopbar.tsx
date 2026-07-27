'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';

export default function AdminTopbar() {
  return (
    <header className="w-full bg-neutral-950 border-b border-neutral-800 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      <Link href="/admin/airdrops" className="flex items-center gap-3">
        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-black font-black text-xl">
          N
        </div>
        <span className="text-xl font-bold text-white tracking-tight">
          Admin<span className="text-neutral-500">Panel</span>
        </span>
      </Link>

      {/* Le bouton RainbowKit gère automatiquement l'affichage du wallet connecté */}
      <ConnectButton />
    </header>
  );
}
