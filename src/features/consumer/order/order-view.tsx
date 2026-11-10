import { useTranslations } from 'next-intl'
import { OrderComingSoon } from './components/OrderComingSoon'
import { OrderSteps } from './components/OrderSteps'
import { parsePlanCode } from './lib/order-params'

interface OrderViewProps {
  /** Raw `?plan=` from the URL */
  plan?: string | string[]
}

// Placeholder until Order (#6): the funnel's entry point exists so every
// "check your premium" link can point here now. No motion — funnel page (DESIGN.md §4)
export function OrderView({ plan }: OrderViewProps) {
  const tPlans = useTranslations('PLANS')
  const planCode = parsePlanCode(plan)
  // Same fallback as the plan cards: a code without copy shows the code itself
  const planName = planCode
    ? tPlans.has(`ITEMS.${planCode}.NAME`)
      ? tPlans(`ITEMS.${planCode}.NAME`)
      : planCode
    : null

  return (
    <div className="bg-base-200 min-h-svh pt-20 pb-16 md:pt-24 md:pb-24">
      <div className="mx-auto flex max-w-2xl flex-col gap-6 px-4 pt-6 md:px-6">
        <OrderSteps />
        <OrderComingSoon planName={planName} />
      </div>
    </div>
  )
}
