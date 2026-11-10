import { ShieldCheck } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link } from '@/shared/i18n'
import { consumerRoutes } from '@/shared/routes'
import { consumerNavItems } from '../lib/nav-items'

export function Footer() {
  const tComman = useTranslations('COMMON')
  const tShell = useTranslations('SHELL')

  return (
    <footer className="bg-neutral text-neutral-content">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 md:px-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="flex flex-col gap-2">
            <Link href={consumerRoutes.home} className="flex items-center gap-2 text-lg font-bold">
              <ShieldCheck className="size-6" />
              {tComman('APP_NAME')}
            </Link>
            <p className="text-neutral-content/70 text-sm">{tShell('FOOTER.TAGLINE')}</p>
          </div>
          <nav aria-label={tShell('NAV.MAIN')} className="flex gap-6">
            {consumerNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-neutral-content/80 hover:text-neutral-content transition-colors"
              >
                {tShell(`NAV.${item.labelKey}`)}
              </Link>
            ))}
          </nav>
        </div>
        <p className="border-neutral-content/15 text-neutral-content/70 border-t pt-6 text-sm">
          {tShell('FOOTER.COPYRIGHT', { year: new Date().getFullYear() })}
        </p>
      </div>
    </footer>
  )
}
