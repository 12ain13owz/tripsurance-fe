import { NextIntlClientProvider } from 'next-intl'
import { getLocale } from 'next-intl/server'
import { BaseLayout } from '@/core/layout'
import { ConsumerShellView } from '@/features/consumer'
import { routing } from '@/shared/i18n'
import type { Metadata } from 'next'
import '@/app/globals.css'

export const metadata: Metadata = {
  title: { default: 'Tripsurance', template: '%s | Tripsurance' },
  description: 'Travel insurance, made simple',
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function ConsumerLayout({ children }: LayoutProps<'/[locale]'>) {
  const locale = await getLocale()

  return (
    <BaseLayout lang={locale}>
      <NextIntlClientProvider>
        <ConsumerShellView>{children}</ConsumerShellView>
      </NextIntlClientProvider>
    </BaseLayout>
  )
}
