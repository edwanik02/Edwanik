import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  output: 'standalone',
  outputFileTracingRoot: path.resolve(__dirname),
  compress: true, poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [{ protocol: 'https', hostname: 'res.cloudinary.com', pathname: '/**' }, { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' }],
    minimumCacheTTL: 3600,
  },
  async headers() {
    return [
      { source: '/(.*)', headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-XSS-Protection', value: '1; mode=block' }, { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      ]},
      { source: '/api/(.*)', headers: [{ key: 'Cache-Control', value: 'no-store, no-cache' }] },
    ]
  },
}
export default nextConfig
