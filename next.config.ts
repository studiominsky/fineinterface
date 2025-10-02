// next.config.ts
import type { NextConfig } from 'next';

// 👇 only runs in dev; safe in prod builds
if (process.env.NODE_ENV === 'development') {
  try {
    // This no-ops if the package isn’t installed or in prod
    import('@opennextjs/cloudflare').then(cloudflare => {
      cloudflare.initOpenNextCloudflareForDev?.();
    }).catch(() => { });
  } catch { }
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '**',
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // see note below about `unoptimized`
    // unoptimized: true,
  },
};

export default nextConfig;