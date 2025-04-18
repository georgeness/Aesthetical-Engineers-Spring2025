/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'bhvqdgbwuom91t7g.public.blob.vercel-storage.com',
          pathname: '**',
        },
      ],
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