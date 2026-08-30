import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '32kb',
    },
  },
  poweredByHeader: false,
}

export default nextConfig
