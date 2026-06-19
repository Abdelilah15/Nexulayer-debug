import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin-allow-popups", // Permet à WalletConnect/MetaMask d'ouvrir des pop-ups sans erreur
          },
        ],
      },
    ];
  },
};

export default nextConfig;
