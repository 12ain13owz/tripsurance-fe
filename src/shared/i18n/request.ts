import { notFound } from 'next/navigation'
import * as rootParams from 'next/root-params'
import { hasLocale } from 'next-intl'
import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'

export default getRequestConfig(async () => {
  const requested = await rootParams.locale()

  if (!hasLocale(routing.locales, requested)) {
    notFound()
  }

  const locale = requested
  const messageLoaders = {
    en: async () =>
      Promise.all([
        import('./messages/en/common.json'),
        import('./messages/en/shell.json'),
        import('./messages/en/home.json'),
        import('./messages/en/plans.json'),
        import('./messages/en/addons.json'),
        import('./messages/en/order.json'),
      ]),
    th: async () =>
      Promise.all([
        import('./messages/th/common.json'),
        import('./messages/th/shell.json'),
        import('./messages/th/home.json'),
        import('./messages/th/plans.json'),
        import('./messages/th/addons.json'),
        import('./messages/th/order.json'),
      ]),
  }
  const [common, shell, home, plans, addons, order] = await messageLoaders[locale]()

  // e.g. useTranslations('PLANS')
  return {
    locale,
    messages: {
      ...common.default,
      ...shell.default,
      ...home.default,
      ...plans.default,
      ...addons.default,
      ...order.default,
    },
  }
})
