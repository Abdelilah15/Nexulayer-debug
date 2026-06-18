import './globals.css';
import { Providers } from './providers';

export const metadata = {
  title: 'Forgenix',
  description: 'La Forge Web3 Ultime sur Base',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        {/* Icônes Classiques (UI, Accueil, etc.) */}
        <link rel="stylesheet" href="https://cdn-uicons.flaticon.com/uicons-regular-rounded/css/uicons-regular-rounded.css" />
        
        {/* NOUVEAU : Icônes de Marques (Réseaux Sociaux) */}
        <link rel="stylesheet" href="https://cdn-uicons.flaticon.com/uicons-brands/css/uicons-brands.css" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}