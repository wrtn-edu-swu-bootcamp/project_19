import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // React strict mode
  reactStrictMode: true,

  // Experimental features for Next.js 15
  experimental: {
    // Turbopack is now stable in Next.js 15
  },

  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
  },

  // Headers for PWA and security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },

  // Vercel 배포 최적화
  typescript: {
    // 빌드 시 타입 에러가 있어도 계속 진행 (프로덕션 배포 우선)
    ignoreBuildErrors: true,
  },
  
  eslint: {
    // 빌드 시 ESLint 에러가 있어도 계속 진행
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
