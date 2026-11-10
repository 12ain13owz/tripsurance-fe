'use client'

import { useLocale, useTranslations } from 'next-intl'
import { useOptimistic, useTransition } from 'react'
import { routing, usePathname, useRouter } from '@/shared/i18n'
import { cn } from '@/shared/utils'

const LOCALE_NAMES: Record<(typeof routing.locales)[number], string> = {
  th: 'ไทย',
  en: 'English',
}

interface LocaleSwitcherProps {
  /** Light-on-dark colours for the transparent header over the home hero */
  isOnDark?: boolean
}

// Segmented TH | EN control with a sliding thumb (mocks/header-mock.html, L1)
export function LocaleSwitcher({ isOnDark = false }: LocaleSwitcherProps) {
  const t = useTranslations('SHELL.NAV')
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [, startTransition] = useTransition()
  // Move the thumb right away; the route change re-renders the page with the new locale
  const [activeLocale, setActiveLocale] = useOptimistic(locale)
  const activeIndex = routing.locales.findIndex((l) => l === activeLocale)

  const switchTo = (next: (typeof routing.locales)[number]) => {
    if (next === activeLocale) {
      return
    }
    startTransition(() => {
      setActiveLocale(next)
      router.replace(pathname, { locale: next })
    })
  }

  return (
    <div
      role="group"
      aria-label={t('LANGUAGE')}
      className={cn(
        'relative inline-grid rounded-full border p-[3px]',
        isOnDark ? 'border-white/20 bg-white/10' : 'border-base-300 bg-base-content/5'
      )}
      style={{ gridTemplateColumns: `repeat(${routing.locales.length}, 1fr)` }}
    >
      <span
        aria-hidden="true"
        className={cn(
          'absolute inset-y-[3px] left-[3px] rounded-full transition-transform duration-300 ease-[cubic-bezier(.2,.8,.2,1)] motion-reduce:transition-none',
          isOnDark ? 'bg-base-100' : 'bg-primary shadow-[0_2px_6px_-2px_rgb(37_99_235/0.6)]'
        )}
        style={{
          width: `calc((100% - 6px) / ${routing.locales.length})`,
          transform: `translateX(${activeIndex * 100}%)`,
        }}
      />
      {routing.locales.map((l) => {
        const isActive = l === activeLocale
        return (
          <button
            key={l}
            type="button"
            aria-pressed={isActive}
            aria-label={LOCALE_NAMES[l]}
            className={cn(
              'relative z-10 h-[1.85rem] min-w-[2.6rem] cursor-pointer rounded-full text-[0.8rem] font-semibold tracking-wide transition-[opacity,color] duration-200',
              isActive
                ? isOnDark
                  ? 'text-neutral'
                  : 'text-primary-content'
                : 'opacity-60 hover:opacity-100'
            )}
            onClick={() => switchTo(l)}
          >
            {l.toUpperCase()}
          </button>
        )
      })}
    </div>
  )
}
