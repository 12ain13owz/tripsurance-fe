'use client'

import { useLocale, useTranslations } from 'next-intl'
import { routing, usePathname, useRouter } from '@/shared/i18n'
import { cn } from '@/shared/utils'

export function LocaleSwitcher() {
  const t = useTranslations('SHELL.NAV')
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  return (
    <div className="flex items-center" role="group" aria-label={t('LANGUAGE')}>
      {routing.locales.map((l) => (
        <button
          key={l}
          type="button"
          className={cn(
            'btn btn-text btn-sm text-current',
            l === locale ? 'font-semibold' : 'opacity-60 hover:opacity-100'
          )}
          aria-pressed={l === locale}
          onClick={() => router.replace(pathname, { locale: l })}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
