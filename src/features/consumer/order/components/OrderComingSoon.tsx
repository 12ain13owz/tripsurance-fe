import { Info, Plane } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link } from '@/shared/i18n'
import { consumerRoutes } from '@/shared/routes'

interface OrderComingSoonProps {
  /** The plan the visitor came from (a plan card's CTA), already translated */
  planName: string | null
}

export function OrderComingSoon({ planName }: OrderComingSoonProps) {
  const t = useTranslations('ORDER.PLACEHOLDER')
  const tCommon = useTranslations('COMMON')

  return (
    <section className="bg-base-100 border-base-300 rounded-box flex flex-col gap-5 border p-6 shadow-sm">
      <h1 className="text-2xl leading-snug font-semibold">{t('TITLE')}</h1>

      <div role="status" className="alert alert-soft alert-info flex items-start gap-3">
        <Info className="mt-1 size-4 shrink-0" aria-hidden />
        <div className="flex flex-col gap-1">
          <span className="font-semibold">{tCommon('COMING_SOON')}</span>
          <span className="text-subtle leading-relaxed">{t('BODY')}</span>
        </div>
      </div>

      {planName && (
        <p className="border-base-300 rounded-field flex items-center gap-3 border border-dashed px-4 py-3">
          <Plane className="text-primary size-4 shrink-0" aria-hidden />
          <span>
            {t.rich('INTERESTED_PLAN', { plan: planName, b: (chunks) => <b>{chunks}</b> })}
          </span>
        </p>
      )}

      <Link href={consumerRoutes.plans} className="btn btn-outline btn-primary btn-block">
        {t('VIEW_PLANS')}
      </Link>
    </section>
  )
}
