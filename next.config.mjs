/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: ['bhvqdgbwuom91t7g.public.blob.vercel-storage.com'],
    },
    experimental: {
      // Enable larger API payload limits
      serverComponentsExternalPackages: ['@vercel/blob'],
      serverActions: {
        bodySizeLimit: '32mb',
      },
    },
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