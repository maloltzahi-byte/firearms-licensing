import path from 'node:path'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '32kb',
    },
  },
  outputFileTracingRoot: path.join(process.cwd(), '..'),
  poweredByHeader: false,
}

export default nextConfig
