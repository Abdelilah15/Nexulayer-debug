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
        <link rel="stylesheet" href="https://cdn-uicons.flaticon.com/uicons-regular-rounded/css/uicons-regular-rounded.css" />
        <link rel="stylesheet" href="https://cdn-uicons.flaticon.com/uicons-brands/css/uicons-brands.css" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
