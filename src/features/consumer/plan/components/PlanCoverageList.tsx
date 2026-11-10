import { CheckCircle2, MinusCircle } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { planCoverageCategories } from '@/shared/const'
import { formatBaht } from '@/shared/utils'
import type { PlanCoverage } from '../lib/plan.type'

interface PlanCoverageListProps {
  coverages: PlanCoverage[]
  locale: string
}

// Every category on every card, in the same order, so rows line up across cards;
// one the plan lacks stays visible as "not covered" instead of disappearing
export function PlanCoverageList({ coverages, locale }: PlanCoverageListProps) {
  const t = useTranslations('PLANS')
  const amounts = new Map(coverages.map((coverage) => [coverage.categoryKey, coverage.amount]))

  return (
    <ul className="flex flex-col gap-1.5 text-sm">
      {planCoverageCategories.map((key) => {
        const amount = amounts.get(key)

        if (amount === undefined) {
          return (
            <li key={key} className="text-disabled flex items-center gap-2">
              <MinusCircle className="size-4 shrink-0" aria-hidden />
              <span className="grow">{t(`COVERAGE.${key}`)}</span>
              <span className="whitespace-nowrap">{t('CARD.NOT_COVERED')}</span>
            </li>
          )
        }

        return (
          <li key={key} className="flex items-center gap-2">
            <CheckCircle2 className="text-success size-4 shrink-0" aria-hidden />
            <span className="grow">{t(`COVERAGE.${key}`)}</span>
            <span className="font-medium whitespace-nowrap tabular-nums">
              {formatBaht(amount, locale)}
            </span>
          </li>
        )
      })}
    </ul>
  )
}
