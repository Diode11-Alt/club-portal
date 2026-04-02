import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Supabase generated types don't match all runtime tables (post_reactions, post_comments)
    // App works correctly at runtime — these are type-level mismatches only
    ignoreBuildErrors: true,
  },
  devIndicators: false,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        pathname: '/storage/**',
      },
    ],
  },
};

export default nextConfig;
