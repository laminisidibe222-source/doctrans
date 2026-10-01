import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // ✅ New format for body size limit in Next.js 15+
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
};

export default nextConfig;