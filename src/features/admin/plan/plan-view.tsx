'use client'

import { useEffect, useMemo, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { getErrorMessage } from '@/core/api'
import { Panel } from '@/shared/components/ui'
import { PlanFilter } from './components/PlanFilter'
import { PlanTable } from './components/PlanTable'
import { getPlans, reorderPlans, updatePlanStatus } from './lib/plan.api'
import type { Plan, PlanFilters } from './lib/plan.type'

const defaultFilters: PlanFilters = { search: '', status: 'all' }

export function PlanView() {
  const [plans, setPlans] = useState<Plan[] | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [pendingId, setPendingId] = useState<string | null>(null)
  const [isReordering, setIsReordering] = useState(false)

  const { control, reset } = useForm<PlanFilters>({ defaultValues: defaultFilters })
  const [search, status] = useWatch({ control, name: ['search', 'status'] })
  const hasFilters = search.trim() !== '' || status !== 'all'

  useEffect(() => {
    getPlans()
      .then(setPlans)
      .catch((error: unknown) => setLoadError(getErrorMessage(error)))
  }, [])

  const filteredPlans = useMemo(() => {
    const query = search.trim().toLowerCase()

    return (plans ?? []).filter(
      (plan) =>
        (query === '' || plan.code.includes(query)) &&
        (status === 'all' || plan.isActive === (status === 'active'))
    )
  }, [plans, search, status])

  async function handleToggle(plan: Plan) {
    // A reorder rollback would overwrite the toggled row, so one change at a time
    if (pendingId || isReordering) {
      return
    }

    setPendingId(plan.id)
    try {
      const updated = await updatePlanStatus(plan.id, !plan.isActive)
      setPlans((prev) => prev?.map((p) => (p.id === updated.id ? updated : p)) ?? prev)
    } catch {
      // apiClient already showed the error toast; the switch stays at its previous value
    } finally {
      setPendingId(null)
    }
  }

  // Optimistic: show the new order at once, put it back if the server rejects it
  async function handleReorder(reordered: Plan[]) {
    const previous = plans
    const items = reordered.map((plan, index) => ({ id: plan.id, sortOrder: index }))

    setPlans(reordered.map((plan, index) => ({ ...plan, sortOrder: index })))
    setIsReordering(true)
    try {
      setPlans(await reorderPlans({ items }))
    } catch {
      // apiClient already showed the error toast
      setPlans(previous)
    } finally {
      setIsReordering(false)
    }
  }

  return (
    <Panel className="gap-4 sm:max-h-[calc(100svh-var(--spacing-admin-topbar)-3rem)]">
      {loadError && (
        <div className="alert alert-error text-sm" role="alert">
          {loadError}
        </div>
      )}
      {!loadError && !plans && <p className="text-muted text-sm">Loading…</p>}
      {plans && (
        <>
          <PlanFilter
            control={control}
            hasFilters={hasFilters}
            onClear={() => reset(defaultFilters)}
          />
          {hasFilters && filteredPlans.length > 0 && (
            <p className="text-muted text-sm">Clear filters to reorder plans.</p>
          )}
          <PlanTable
            rows={filteredPlans}
            emptyMessage={plans.length === 0 ? 'No plans yet' : 'No plans found'}
            reorderDisabled={hasFilters || isReordering || pendingId !== null}
            reorderHint={hasFilters ? 'Clear filters to reorder' : undefined}
            pendingId={pendingId}
            onReorder={(rows) => void handleReorder(rows)}
            onToggle={(plan) => void handleToggle(plan)}
          />
        </>
      )}
    </Panel>
  )
}
