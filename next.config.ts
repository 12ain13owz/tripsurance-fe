import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // "standalone" trims the runtime image for Docker, but it removes the
  // `.next/*.nft.json` trace files Vercel's own build pipeline expects —
  // only opt into it for Docker builds (set via Dockerfile ENV), never on Vercel.
  output: process.env.DOCKER_BUILD === 'true' ? 'standalone' : undefined,
}

export default nextConfig
