"use client";

import * as React from 'react';
import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig, RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { WagmiProvider, http } from 'wagmi'; // <-- IMPORT `http` here
import { base, baseSepolia } from 'wagmi/chains';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

// 1. We use environment variables to prevent hardcoding sensitive/restricted IDs.
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'bc9ad5dbb06165a04f7c14743b5b4ccb';

// Configuration des réseaux (Base Mainnet et Base Sepolia pour les tests)
const config = getDefaultConfig({
  appName: 'Nexulayer',
  projectId: projectId,
  chains: [base, baseSepolia],
  ssr: true,
  // 2. Add explicitly defined transports to bypass rate-limited public RPCs.
  transports: {
    [base.id]: http(process.env.NEXT_PUBLIC_BASE_RPC_URL || 'https://mainnet.base.org'),
    [baseSepolia.id]: http(process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL || 'https://sepolia.base.org'),
  },
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider theme={darkTheme()}>
            {children}
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </NextThemesProvider>
  );
}
