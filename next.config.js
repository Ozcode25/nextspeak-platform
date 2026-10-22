/** @type {import('next').NextConfig} */
const nextConfig = {
  // Fully static site — deployable on any static host (Vercel serves ./out).
  output: 'export',
  reactStrictMode: true,
  images: {
    // Static export cannot use the Next.js image optimizer.
    unoptimized: true,
  },
};

module.exports = nextConfig;
