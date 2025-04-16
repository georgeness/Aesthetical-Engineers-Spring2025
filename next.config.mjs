/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: process.env.NODE_ENV === 'production' ? '/Aesthetical-Engineers-Spring2025' : '',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
