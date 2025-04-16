/** @type {import('next').NextConfig} */
const nextConfig = {
  // Only use static export for production builds on GitHub Pages
  ...(process.env.GITHUB_ACTIONS && {
    output: 'export',
    basePath: '/Aesthetical-Engineers-Spring2025',
    images: {
      unoptimized: true,
    },
  }),
};

export default nextConfig;
