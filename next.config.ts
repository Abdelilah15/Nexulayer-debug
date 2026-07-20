import type { NextConfig } from "next";
import 'dotenv/config';

const nextConfig: NextConfig = {

  async redirects() {
    return [
      {
        source: '/Profile',
        destination: '/',
        permanent: false,
      },
    ];
  },

  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? {
      exclude: ["error", "warn"],
    } : false,
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin-allow-popups",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
