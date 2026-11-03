'use client'

import { Plus } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { getErrorMessage } from '@/core/api'
import { Panel } from '@/shared/components/ui'
import { bahtToSatang } from '@/shared/utils'
import { PlanFilter } from './components/PlanFilter'
import { PlanFormModal } from './components/PlanFormModal'
import { PlanTable } from './components/PlanTable'
import { getTierMinDays } from './lib/plan-tier'
import {
  createPlan,
  getPlanAddonOptions,
  getPlanCountryOptions,
  getPlans,
  reorderPlans,
  updatePlan,
  updatePlanStatus,
} from './lib/plan.api'
import { planCoverageCategories } from './lib/plan.type'
import type {
  Plan,
  PlanAddonOption,
  PlanCountryOption,
  PlanCoverage,
  PlanFilters,
  PlanPriceTier,
} from './lib/plan.type'
import type { PlanFormValue } from './schemas/plan-form.schema'

const defaultFilters: PlanFilters = { search: '', status: 'all' }

function toTiers(tiers: PlanFormValue['tiers']): PlanPriceTier[] {
  return tiers.map((tier, index) => ({
    // The schema already checked every maxDays, so minDays is never null here
    minDays: getTierMinDays(tiers, index) ?? 1,
    maxDays: Number(tier.maxDays),
    pricePerTraveller: bahtToSatang(Number(tier.price)),
  }))
}

// Empty fields mean "not covered" and are left out
function toCoverages(coverages: PlanFormValue['coverages']): PlanCoverage[] {
  return planCoverageCategories
    .filter((category) => coverages[category] !== '')
    .map((category) => ({
      categoryKey: category,
      amount: bahtToSatang(Number(coverages[category])),
    }))
}

interface PlanFormOptions {
  countries: PlanCountryOption[]
  addons: PlanAddonOption[]
}

export function PlanView() {
  const [plans, setPlans] = useState<Plan[] | null>(null)
  const [options, setOptions] = useState<PlanFormOptions | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [pendingId, setPendingId] = useState<string | null>(null)
  const [isReordering, setIsReordering] = useState(false)
  // null = closed; { plan: null } = create
  const [form, setForm] = useState<{ plan: Plan | null } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const { control, reset } = useForm<PlanFilters>({ defaultValues: defaultFilters })
  const [search, status] = useWatch({ control, name: ['search', 'status'] })
  const hasFilters = search.trim() !== '' || status !== 'all'

  useEffect(() => {
    // The form maps a plan's isoCodes/add-on codes to ids, so it needs every country and add-on
    Promise.all([getPlans(), getPlanCountryOptions(), getPlanAddonOptions()])
      .then(([loadedPlans, countries, addons]) => {
        setPlans(loadedPlans)
        setOptions({ countries, addons })
      })
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

  function openForm(plan: Plan | null) {
    setFormError(null)
    setForm({ plan })
  }

  function closeForm() {
    if (!isSubmitting) {
      setForm(null)
    }
  }

  async function handleSubmit(value: PlanFormValue) {
    const editing = form?.plan ?? null

    setIsSubmitting(true)
    setFormError(null)
    try {
      // Every list is sent on update: each one replaces the plan's list entirely
      const saved = editing
        ? await updatePlan(editing.id, {
            isActive: value.isActive,
            isFeatured: value.isFeatured,
            tiers: toTiers(value.tiers),
            coverages: toCoverages(value.coverages),
            countryIds: value.countryIds,
            addonIds: value.addonIds,
          })
        : await createPlan({
            code: value.code,
            tiers: toTiers(value.tiers),
            coverages: toCoverages(value.coverages),
            countryIds: value.countryIds,
            addonIds: value.addonIds,
          })

      // The server places a new plan last, so appending keeps the list in order
      setPlans((prev) =>
        editing
          ? (prev?.map((p) => (p.id === saved.id ? saved : p)) ?? prev)
          : prev && [...prev, saved]
      )
      setForm(null)
    } catch (error) {
      setFormError(getErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Panel className="gap-4 sm:max-h-[calc(100svh-var(--spacing-admin-topbar)-3rem)]">
      {loadError && (
        <div className="alert alert-error text-sm" role="alert">
          {loadError}
        </div>
      )}
      {!loadError && !(plans && options) && <p className="text-muted text-sm">Loading…</p>}
      {plans && options && (
        <>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <PlanFilter
              control={control}
              hasFilters={hasFilters}
              onClear={() => reset(defaultFilters)}
            />
            <button type="button" className="btn btn-primary" onClick={() => openForm(null)}>
              <Plus className="size-4" />
              Add plan
            </button>
          </div>
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
            onEdit={openForm}
          />
        </>
      )}
      {form && options && (
        <PlanFormModal
          plan={form.plan}
          countries={options.countries}
          addons={options.addons}
          isSubmitting={isSubmitting}
          errorMessage={formError}
          onSubmit={(value) => void handleSubmit(value)}
          onClose={closeForm}
        />
      )}
    </Panel>
  )
}
