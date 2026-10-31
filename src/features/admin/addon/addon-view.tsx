'use client'

import { Plus } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { getErrorMessage } from '@/core/api'
import { Panel } from '@/shared/components/ui'
import { bahtToSatang } from '@/shared/utils'
import { AddonFilter } from './components/AddonFilter'
import { AddonFormModal } from './components/AddonFormModal'
import { AddonTable } from './components/AddonTable'
import {
  createAddon,
  getAddons,
  reorderAddons,
  updateAddon,
  updateAddonStatus,
} from './lib/addon.api'
import type { Addon, AddonFilters } from './lib/addon.type'
import type { AddonFormValue } from './schemas/addon-form.schema'

const defaultFilters: AddonFilters = { search: '', status: 'all' }

function toOptionalSatang(baht: string): number | null {
  return baht === '' ? null : bahtToSatang(Number(baht))
}

export function AddonView() {
  const [addons, setAddons] = useState<Addon[] | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [pendingId, setPendingId] = useState<string | null>(null)
  const [isReordering, setIsReordering] = useState(false)
  // null = closed; { addon: null } = create
  const [form, setForm] = useState<{ addon: Addon | null } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const { control, reset } = useForm<AddonFilters>({ defaultValues: defaultFilters })
  const [search, status] = useWatch({ control, name: ['search', 'status'] })
  const hasFilters = search.trim() !== '' || status !== 'all'

  useEffect(() => {
    getAddons()
      .then(setAddons)
      .catch((error: unknown) => setLoadError(getErrorMessage(error)))
  }, [])

  const filteredAddons = useMemo(() => {
    const query = search.trim().toLowerCase()

    return (addons ?? []).filter(
      (addon) =>
        (query === '' || addon.code.includes(query)) &&
        (status === 'all' || addon.isActive === (status === 'active'))
    )
  }, [addons, search, status])

  async function handleToggle(addon: Addon) {
    // A reorder rollback would overwrite the toggled row, so one change at a time
    if (pendingId || isReordering) {
      return
    }

    setPendingId(addon.id)
    try {
      const updated = await updateAddonStatus(addon.id, !addon.isActive)
      setAddons((prev) => prev?.map((a) => (a.id === updated.id ? updated : a)) ?? prev)
    } catch {
      // apiClient already showed the error toast; the switch stays at its previous value
    } finally {
      setPendingId(null)
    }
  }

  // Optimistic: show the new order at once, put it back if the server rejects it
  async function handleReorder(reordered: Addon[]) {
    const previous = addons
    const items = reordered.map((addon, index) => ({ id: addon.id, sortOrder: index }))

    setAddons(reordered.map((addon, index) => ({ ...addon, sortOrder: index })))
    setIsReordering(true)
    try {
      setAddons(await reorderAddons({ items }))
    } catch {
      // apiClient already showed the error toast
      setAddons(previous)
    } finally {
      setIsReordering(false)
    }
  }

  function openForm(addon: Addon | null) {
    setFormError(null)
    setForm({ addon })
  }

  function closeForm() {
    if (!isSubmitting) {
      setForm(null)
    }
  }

  async function handleSubmit(value: AddonFormValue) {
    const editing = form?.addon ?? null

    setIsSubmitting(true)
    setFormError(null)
    try {
      const saved = editing
        ? await updateAddon(editing.id, {
            pricingType: value.pricingType,
            price: bahtToSatang(Number(value.price)),
            coverageAmount: toOptionalSatang(value.coverageAmount),
            isActive: value.isActive,
          })
        : await createAddon({
            code: value.code,
            pricingType: value.pricingType,
            price: bahtToSatang(Number(value.price)),
            coverageAmount: toOptionalSatang(value.coverageAmount),
          })

      // The server places a new add-on last, so appending keeps the list in order
      setAddons((prev) =>
        editing
          ? (prev?.map((a) => (a.id === saved.id ? saved : a)) ?? prev)
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
      {!loadError && !addons && <p className="text-muted text-sm">Loading…</p>}
      {addons && (
        <>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <AddonFilter
              control={control}
              hasFilters={hasFilters}
              onClear={() => reset(defaultFilters)}
            />
            <button type="button" className="btn btn-primary" onClick={() => openForm(null)}>
              <Plus className="size-4" />
              Add add-on
            </button>
          </div>
          {hasFilters && filteredAddons.length > 0 && (
            <p className="text-muted text-sm">Clear filters to reorder add-ons.</p>
          )}
          <div className="min-h-0 flex-1 overflow-auto">
            <AddonTable
              rows={filteredAddons}
              emptyMessage={addons.length === 0 ? 'No add-ons yet' : 'No add-ons found'}
              reorderDisabled={hasFilters || isReordering || pendingId !== null}
              reorderHint={hasFilters ? 'Clear filters to reorder' : undefined}
              pendingId={pendingId}
              onReorder={(rows) => void handleReorder(rows)}
              onToggle={(addon) => void handleToggle(addon)}
              onEdit={openForm}
            />
          </div>
        </>
      )}
      {form && (
        <AddonFormModal
          addon={form.addon}
          isSubmitting={isSubmitting}
          errorMessage={formError}
          onSubmit={(value) => void handleSubmit(value)}
          onClose={closeForm}
        />
      )}
    </Panel>
  )
}
