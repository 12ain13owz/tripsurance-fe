'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { PlanCard } from './PlanCard'
import { PlanDetailsModal } from './PlanDetailsModal'
import type { PublicPlan } from '../lib/plan.type'

interface PlanGridProps {
  plans: PublicPlan[]
}

// Client island: only the "which plan's details are open" state lives here
export function PlanGrid({ plans }: PlanGridProps) {
  const t = useTranslations('PLANS.PAGE')
  const [detailsPlan, setDetailsPlan] = useState<PublicPlan | null>(null)

  if (plans.length === 0) {
    return (
      <div className="border-base-300 rounded-box bg-base-100 border border-dashed px-4 py-12 text-center">
        <p className="font-semibold">{t('NO_PLANS')}</p>
      </div>
    )
  }

  return (
    <>
      {/* pt-3 leaves room for the "Recommended" badge that sits above a card's top edge */}
      <div className="grid gap-6 pt-3 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan, index) => (
          <PlanCard
            key={plan.code}
            plan={plan}
            index={index}
            onViewDetails={() => setDetailsPlan(plan)}
          />
        ))}
      </div>
      {detailsPlan && <PlanDetailsModal plan={detailsPlan} onClose={() => setDetailsPlan(null)} />}
    </>
  )
}
