import './globals.css';
import { Providers } from './providers';

export const metadata = {
  title: 'Forgenix',
  description: 'Forgenix est une forge en ligne qui vous permet de créer et déployer facilement vos propres contrats intelligents sur la blockchain Ethereum. Que vous souhaitiez générer des messages on-chain, des tokens ERC-20 ou des collections NFT, Forgenix simplifie le processus pour les développeurs et les passionnés de blockchain.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
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