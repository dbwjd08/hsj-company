/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    images: {
      unoptimized: true,
    },
  },
  webpack: (config, options) => {
    config.module.rules.push({
      test: /\.md$/,
      type: 'asset/source',
    });
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
  pageExtensions: ['page.tsx', 'page.ts', 'page.jsx', 'page.js'],
  devIndicators: {
    buildActivity: false,
  },
};

module.exports = nextConfig;
