'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';

// Titre affiché dans le Topbar selon la route active.
// Remplace l'ancien calcul basé sur `activeTab` dans app/forge/page.tsx.
const FORGE_PAGE_TITLES: Record<string, string> = {
  simple: 'Déployer un Contrat de Base',
  message: 'Graver un Message',
  erc20: 'Créer un Token ERC-20',
  b20: 'Lancer un Token B20',
  erc721: 'Lancer un NFT ERC-721A',
  erc1155: 'Lancer un NFT ERC-1155',
};

export default function ForgeSectionLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // ex: "/forge/erc20" -> "erc20"
  const segment = pathname.split('/')[2] ?? 'simple';
  const title = FORGE_PAGE_TITLES[segment] ?? 'Forge';

  return <DashboardLayout title={title}>{children}</DashboardLayout>;
}