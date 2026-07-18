import './globals.css';
import { Providers } from './providers';

export const metadata = {
  title: 'Nexulayer | Smart Contract Deployment Platform',
  description: 'Nexulayer is a platform for deploying smart contracts on the blockchain. It provides an easy-to-use interface for deploying various types of contracts, including ERC-20, B20, ERC-721, and ERC-1155 tokens.',
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
