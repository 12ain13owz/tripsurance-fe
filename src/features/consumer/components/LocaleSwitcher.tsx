'use client'

import { useLocale } from 'next-intl'
import { routing, usePathname, useRouter } from '@/shared/i18n'

export function LocaleSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  return (
    <div className="dropdown">
      {routing.locales.map((l) => (
        <button
          key={l}
          className={l === locale ? 'font-semibold' : ''}
          onClick={() => router.replace(pathname, { locale: l })}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
