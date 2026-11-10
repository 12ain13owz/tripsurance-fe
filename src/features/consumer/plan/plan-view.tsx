import { connection } from 'next/server'
import { Suspense } from 'react'
import { PlanGrid } from './components/PlanGrid'
import { PlanGridSkeleton } from './components/PlanGridSkeleton'
import { PlanHero } from './components/PlanHero'
import { PlansLoadError } from './components/PlansLoadError'
import { getPlans } from './lib/plan.api'
import type { PublicPlan } from './lib/plan.type'

export function PlanView() {
  return (
    <div className="bg-base-200 pb-16 md:pb-24">
      <PlanHero />
      {/* Cards overlap the bottom of the heading band */}
      <div className="relative z-10 mx-auto -mt-12 max-w-6xl px-4 md:px-6">
        <Suspense fallback={<PlanGridSkeleton />}>
          <PlanListSection />
        </Suspense>
      </div>
    </div>
  )
}

// The only part that waits on the BE, so the heading streams first and this fills in after
async function PlanListSection() {
  // Render per request, never at build time: the BE isn't reachable during a Docker build
  await connection()

  let plans: PublicPlan[]
  try {
    plans = await getPlans()
  } catch {
    // Shown in place of the list; there's nothing else on the page to fall back to
    return <PlansLoadError />
  }

  return <PlanGrid plans={plans} />
}
