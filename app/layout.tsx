import './globals.css';
import { Providers } from './providers';

export const metadata = {
  title: 'Forgenix',
  description: 'Forgenix is an online forge that allows you to easily create and deploy your own smart contracts on the Ethereum blockchain. Whether you want to generate on-chain messages, ERC-20 tokens or NFT collections, Forgenix simplifies the process for developers and blockchain enthusiasts.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Importation forcée et garantie de la bibliothèque d'icônes Flaticon */}
        <link rel="stylesheet" href="https://cdn-uicons.flaticon.com/uicons-regular-rounded/css/uicons-regular-rounded.css" />
        
        {/* LA LIGNE MANQUANTE POUR LES ICÔNES DE MARQUES (X, Facebook, etc.) */}
        <link rel="stylesheet" href="https://cdn-uicons.flaticon.com/uicons-brands/css/uicons-brands.css" />
      </head>
      <body>
        {/* On enveloppe tout le site avec nos outils Web3 */}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}