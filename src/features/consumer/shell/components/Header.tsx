'use client'

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { Menu, ShieldCheck, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { EASE_OUT } from '@/shared/components/motions'
import { Link, usePathname } from '@/shared/i18n'
import { consumerRoutes } from '@/shared/routes'
import { cn } from '@/shared/utils'
import { LocaleSwitcher } from './LocaleSwitcher'
import { consumerNavItems } from '../lib/nav-items'

const SCROLL_THRESHOLD_PX = 50

export function Header() {
  const tCommon = useTranslations('COMMON')
  const tShell = useTranslations('SHELL')
  const tOrder = useTranslations('ORDER')
  const pathname = usePathname()
  const { scrollY } = useScroll()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // framer-motion owns the scroll listener; React skips the re-render while the value is unchanged
  useMotionValueEvent(scrollY, 'change', (y) => setIsScrolled(y > SCROLL_THRESHOLD_PX))

  // Only the home hero (a dark photo) sits under the header; every other page starts solid
  const isTransparent = pathname === consumerRoutes.home && !isScrolled && !isMenuOpen
  const closeMenu = () => setIsMenuOpen(false)

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-colors duration-300',
        isTransparent
          ? 'text-neutral-content bg-transparent'
          : 'bg-base-100/90 text-base-content shadow-sm backdrop-blur-sm'
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 md:px-6">
        <Link
          href={consumerRoutes.home}
          className={cn(
            'flex items-center gap-2 text-lg font-bold',
            !isTransparent && 'text-primary'
          )}
          onClick={closeMenu}
        >
          <ShieldCheck className="size-6" />
          {tCommon('APP_NAME')}
        </Link>

        <nav aria-label={tShell('NAV.MAIN')} className="hidden items-center gap-6 md:flex">
          {consumerNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={pathname === item.href ? 'page' : undefined}
              className={cn(
                'transition-opacity hover:opacity-100',
                pathname === item.href ? 'font-medium' : 'opacity-75',
                pathname === item.href && !isTransparent && 'text-primary'
              )}
            >
              {tShell(`NAV.${item.labelKey}`)}
            </Link>
          ))}
          <LocaleSwitcher isOnDark={isTransparent} />
          <Link href={consumerRoutes.order} className="btn btn-primary btn-sm">
            {tOrder('CHECK_PREMIUM')}
          </Link>
        </nav>

        <button
          type="button"
          className="btn btn-text btn-square text-current md:hidden"
          aria-label={tShell(isMenuOpen ? 'NAV.CLOSE_MENU' : 'NAV.OPEN_MENU')}
          aria-expanded={isMenuOpen}
          aria-controls="site-mobile-nav"
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          {isMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      <AnimatePresence initial={false}>
        {isMenuOpen && (
          <motion.nav
            id="site-mobile-nav"
            aria-label={tShell('NAV.MAIN')}
            className="overflow-hidden md:hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE_OUT }}
          >
            <div className="flex flex-col gap-2 px-4 pb-4">
              {consumerNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={pathname === item.href ? 'page' : undefined}
                  className={cn(
                    'rounded-field px-3 py-3',
                    pathname === item.href
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'hover:bg-base-200'
                  )}
                  onClick={closeMenu}
                >
                  {tShell(`NAV.${item.labelKey}`)}
                </Link>
              ))}
              <div className="flex items-center justify-between gap-4 px-3 py-2">
                <span className="text-muted text-sm">{tShell('NAV.LANGUAGE')}</span>
                <LocaleSwitcher />
              </div>
              <Link
                href={consumerRoutes.order}
                className="btn btn-primary btn-lg"
                onClick={closeMenu}
              >
                {tOrder('CHECK_PREMIUM')}
              </Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
