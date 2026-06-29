
'use client';

import * as React from 'react';
import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig, RainbowKitProvider, darkTheme, lightTheme } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

// Configuration des réseaux (Base Mainnet et Base Sepolia pour les tests)
const config = getDefaultConfig({
  appName: 'Guild Task Deployer',
  projectId: 'bc9ad5dbb06165a04f7c14743b5b4ccb', // Requis par WalletConnect (laissez tel quel pour le test local)
  chains: [base, baseSepolia],
  ssr: true,
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