import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Turbopack が日本語パスで panic するため無効化
  experimental: {},
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
