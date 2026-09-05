import createNextIntlPlugin from 'next-intl/plugin'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: process.env.DOCKER_BUILD === 'true' ? 'standalone' : undefined,
  redirects() {
    return [
      {
        source: '/admin',
        destination: '/admin/sign-in',
        permanent: false,
      },
    ]
  },
}

const withNextIntl = createNextIntlPlugin('./src/shared/i18n/request.ts')
export default withNextIntl(nextConfig)
