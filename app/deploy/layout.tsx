'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';


const DEPLOY_PAGE_TITLES: Record<string, string> = {
  simple: 'Basic Contract',
  message: 'Store Message',
  erc20: 'ERC20 Token',
  b20: 'B20 Token',
  erc721: 'ERC721A NFT',
  erc1155: 'ERC1155 NFT',
};

export default function NexuSectionLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const segment = pathname.split('/')[2] ?? 'simple';
  const title = DEPLOY_PAGE_TITLES[segment] ?? 'Deploy';

  return <DashboardLayout title={title}>{children}</DashboardLayout>;
}
