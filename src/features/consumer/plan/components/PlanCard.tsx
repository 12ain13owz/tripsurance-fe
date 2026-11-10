import { ArrowRight, CalendarDays, Globe, Plane, Star } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { EASE_OUT, SpotlightCard } from '@/shared/components/motions'
import { Link } from '@/shared/i18n'
import { consumerRoutes } from '@/shared/routes'
import { cn, formatBaht } from '@/shared/utils'
import { PlanCoverageList } from './PlanCoverageList'
import {
  getItemDescription,
  getItemName,
  getMaxTripDays,
  getSortedCountries,
  getStartingPrice,
  VISIBLE_COUNTRIES,
  WORLDWIDE_MIN_COUNTRIES,
} from '../lib/plan-display'
import type { PublicPlan } from '../lib/plan.type'
import type { ReactNode } from 'react'

interface PlanCardProps {
  plan: PublicPlan
  /** Position in the grid, for the staggered entrance */
  index: number
  onViewDetails: () => void
}

// Six subgrid rows (DESIGN.md §4 Plan cards): each section starts at the same height on every card
export function PlanCard({ plan, index, onViewDetails }: PlanCardProps) {
  const tPlans = useTranslations('PLANS')
  const tAddons = useTranslations('ADDONS')
  const tOrder = useTranslations('ORDER')
  const locale = useLocale()

  const description = getItemDescription(tPlans, plan.code)
  const isSinglePrice = plan.tiers.length === 1
  const maxDays = getMaxTripDays(plan.tiers)
  const countries = getSortedCountries(plan.countries, locale)
  const moreCountries = countries.length - VISIBLE_COUNTRIES
  const PlanIcon = plan.countries.length > WORLDWIDE_MIN_COUNTRIES ? Globe : Plane

  return (
    <SpotlightCard
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.1 + index * 0.09 }}
      className={cn(
        'bg-base-100 border-base-300 rounded-box row-span-6 grid grid-rows-subgrid gap-y-0 border shadow-sm transition-shadow duration-300 hover:shadow-lg',
        plan.isFeatured && 'ring-primary/40 ring-2'
      )}
    >
      {plan.isFeatured && (
        <span className="badge bg-accent text-accent-content absolute -top-3 left-1/2 z-20 -translate-x-1/2 gap-1 border-0 font-semibold whitespace-nowrap shadow-sm">
          <Star className="size-3.5 fill-current" aria-hidden />
          {tPlans('CARD.RECOMMENDED')}
        </span>
      )}

      {/* Inner radius = card radius − its 1px border, so the band sits flush in the corner */}
      <header
        className={cn(
          'from-primary to-primary/80 text-primary-content flex items-start gap-3.5 rounded-t-[calc(var(--radius-box)-1px)] bg-linear-to-br px-6 py-5',
          plan.isFeatured && 'pt-7'
        )}
      >
        <span className="bg-primary-content/20 grid size-11 shrink-0 place-items-center rounded-full">
          <PlanIcon className="size-5" aria-hidden />
        </span>
        <div className="flex flex-col gap-0.5">
          <h3 className="text-xl font-semibold">{getItemName(tPlans, plan.code)}</h3>
          {description && (
            <p className="text-primary-content/85 text-sm leading-relaxed">{description}</p>
          )}
        </div>
      </header>

      <CardSection>
        <p className="flex flex-wrap items-baseline gap-2">
          {!isSinglePrice && <span className="text-subtle">{tPlans('CARD.FROM')}</span>}
          <span className="text-primary text-2xl font-semibold tabular-nums">
            {formatBaht(getStartingPrice(plan.tiers), locale)}
          </span>
          <span className="text-subtle">{tPlans('CARD.PER_TRAVELLER')}</span>
        </p>
        <p className="text-muted text-sm">{tPlans('CARD.TAX_NOTE')}</p>
        <span className="badge badge-soft badge-primary gap-1.5 self-start">
          <CalendarDays className="size-3.5" aria-hidden />
          {isSinglePrice
            ? tPlans('CARD.SINGLE_PRICE', { days: maxDays })
            : tPlans('CARD.TIER_SUMMARY', { count: plan.tiers.length, days: maxDays })}
        </span>
      </CardSection>

      <CardSection title={tPlans('CARD.COVERAGE_TITLE')}>
        <PlanCoverageList coverages={plan.coverages} locale={locale} />
      </CardSection>

      <CardSection title={tPlans('CARD.COUNTRIES_TITLE')}>
        <p className="flex gap-2 text-sm">
          <Globe className="text-primary mt-1 size-4 shrink-0" aria-hidden />
          <span>
            <span className="font-semibold">
              {tPlans('CARD.COUNTRIES_COUNT', { count: countries.length })}
            </span>
            <span className="text-muted">
              {' · '}
              {countries
                .slice(0, VISIBLE_COUNTRIES)
                .map((country) => country.name)
                .join(', ')}
              {moreCountries > 0 && ` ${tPlans('CARD.COUNTRIES_MORE', { count: moreCountries })}`}
            </span>
          </span>
        </p>
      </CardSection>

      <CardSection title={tPlans('CARD.ADDONS_TITLE')}>
        {plan.addons.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {plan.addons.map((addon) => (
              <span key={addon.code} className="badge badge-soft badge-primary">
                {getItemName(tAddons, addon.code)}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-muted text-sm">{tPlans('CARD.NO_ADDONS')}</p>
        )}
      </CardSection>

      <CardSection className="gap-1 self-end">
        <button
          type="button"
          className="btn btn-text btn-primary btn-sm self-center"
          onClick={onViewDetails}
        >
          {tPlans('CARD.VIEW_DETAILS')}
        </button>
        <Link
          href={{ pathname: consumerRoutes.order, query: { plan: plan.code } }}
          className="btn btn-primary"
        >
          {tOrder('CHECK_PREMIUM')}
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      </CardSection>
    </SpotlightCard>
  )
}

interface CardSectionProps {
  title?: string
  className?: string
  children: ReactNode
}

function CardSection({ title, className, children }: CardSectionProps) {
  return (
    <section className={cn('border-base-300 flex flex-col gap-2.5 border-t px-6 py-5', className)}>
      {title && <h4 className="text-muted text-sm font-medium">{title}</h4>}
      {children}
    </section>
  )
}
