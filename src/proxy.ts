import createMiddleware from 'next-intl/middleware'
// Not the @/shared/i18n barrel: it re-exports navigation, which pulls in next/root-params,
// and the proxy is bundled outside the App Directory ("Invalid import" build error)
import { routing } from '@/shared/i18n/routing'

export default createMiddleware(routing)

export const config = {
  matcher: '/((?!api|trpc|_next|_vercel|admin|.*\\..*).*)',
}
