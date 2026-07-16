'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';

// Titre affiché dans le Topbar selon la route active.
// Remplace l'ancien calcul basé sur `activeTab` dans app/forge/page.tsx.
const FORGE_PAGE_TITLES: Record<string, string> = {
  simple: 'Basic Contract',
  message: 'Store Message',
  erc20: 'ERC20 Token',
  b20: 'B20 Token',
  erc721: 'ERC721A NFT',
  erc1155: 'ERC1155 NFT',
};

export default function ForgeSectionLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // ex: "/forge/erc20" -> "erc20"
  const segment = pathname.split('/')[2] ?? 'simple';
  const title = FORGE_PAGE_TITLES[segment] ?? 'Forge';

  return <DashboardLayout title={title}>{children}</DashboardLayout>;
}