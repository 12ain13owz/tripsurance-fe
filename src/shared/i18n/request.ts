import { hasLocale } from 'next-intl'
import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale

  const messageLoaders = {
    en: async () => import('./messages/en/common.json'),
    th: async () => import('./messages/th/common.json'),
  }
  const common = await messageLoaders[locale]()

  return {
    locale,
    messages: {
      common: common.default,
    },
  }
})
