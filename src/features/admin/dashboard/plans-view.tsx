import { formatThb } from '@/shared/utils'
import { BarList } from './components/BarList'
import { planTiers } from './lib/mock-data'

const PLAN_COLORS = [
  'color-mix(in oklab, var(--color-primary) 45%, transparent)',
  'color-mix(in oklab, var(--color-primary) 70%, transparent)',
  'var(--color-primary)',
]

export function PlansView() {
  const items = planTiers.map((plan, index) => ({
    key: plan.name,
    label: plan.name,
    value: plan.policies,
    color: PLAN_COLORS[index] ?? 'var(--color-primary)',
    secondaryLine: `${formatThb(plan.revenue)} revenue · ${formatThb(plan.avgPremium)} avg premium`,
  }))

  return (
    <div className="bg-base-100 border-base-300 rounded-box flex flex-col gap-1 border p-4 shadow-sm sm:p-5">
      <h2 className="text-base font-semibold">Sales by plan tier</h2>
      <p className="text-muted text-sm">Basic, Standard, Premium Worldwide</p>
      <div className="mt-2">
        <BarList items={items} />
      </div>
    </div>
  )
}
