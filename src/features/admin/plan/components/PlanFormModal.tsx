'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useId } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { TextField } from '@/shared/components/forms'
import { Modal } from '@/shared/components/ui'
import { satangToBaht } from '@/shared/utils'
import { PlanAddonPicker } from './PlanAddonPicker'
import { PlanCountryPicker } from './PlanCountryPicker'
import { PlanCoverageFields } from './PlanCoverageFields'
import { PlanTierFields } from './PlanTierFields'
import { planCoverageCategories } from '../lib/plan.type'
import { planFormSchema } from '../schemas/plan-form.schema'
import type { Plan, PlanAddonOption, PlanCountryOption } from '../lib/plan.type'
import type { PlanFormValue } from '../schemas/plan-form.schema'
import type { ReactNode } from 'react'

function toBahtInput(satang: number): string {
  return satangToBaht(satang).toFixed(2)
}

// A plan lists countries by isoCode and add-ons by code; the form works with ids, like the API payload
function getDefaultValues(
  plan: Plan | null,
  countries: PlanCountryOption[],
  addons: PlanAddonOption[]
): PlanFormValue {
  const amounts = new Map(
    plan?.coverages.map((coverage) => [coverage.categoryKey, coverage.amount])
  )
  const coverages = Object.fromEntries(
    planCoverageCategories.map((category) => {
      const amount = amounts.get(category)
      return [category, amount === undefined ? '' : toBahtInput(amount)]
    })
  ) as PlanFormValue['coverages']

  if (!plan) {
    return {
      code: '',
      isActive: false,
      tiers: [{ maxDays: '', price: '' }],
      coverages,
      countryIds: [],
      addonIds: [],
    }
  }

  const countryCodes = new Set(plan.countries)
  const addonCodes = new Set(plan.addons.map((addon) => addon.code))

  return {
    code: plan.code,
    isActive: plan.isActive,
    tiers: plan.tiers.map((tier) => ({
      maxDays: String(tier.maxDays),
      price: toBahtInput(tier.pricePerTraveller),
    })),
    coverages,
    countryIds: countries
      .filter((country) => countryCodes.has(country.isoCode))
      .map((country) => country.id),
    addonIds: addons.filter((addon) => addonCodes.has(addon.code)).map((addon) => addon.id),
  }
}

interface FormSectionProps {
  title: string
  description?: string
  error?: string
  children: ReactNode
}

function FormSection({ title, description, error, children }: FormSectionProps) {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <h4 className="text-base-content font-medium">{title}</h4>
        {description && <p className="text-muted text-sm">{description}</p>}
      </div>
      {children}
      {error && <p className="text-error text-sm">{error}</p>}
    </section>
  )
}

interface PlanFormModalProps {
  /** null = create */
  plan: Plan | null
  countries: PlanCountryOption[]
  addons: PlanAddonOption[]
  isSubmitting: boolean
  errorMessage: string | null
  onSubmit: (value: PlanFormValue) => void
  onClose: () => void
}

// Rendered only while open, so the form starts from fresh default values every time
export function PlanFormModal({
  plan,
  countries,
  addons,
  isSubmitting,
  errorMessage,
  onSubmit,
  onClose,
}: PlanFormModalProps) {
  const formId = useId()
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PlanFormValue>({
    resolver: zodResolver(planFormSchema),
    defaultValues: getDefaultValues(plan, countries, addons),
  })

  return (
    <Modal
      open
      size="xl"
      title={plan ? 'Edit plan' : 'Add plan'}
      onClose={onClose}
      footer={
        <>
          <button type="button" className="btn btn-outline" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" form={formId} className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting && <span className="loading loading-spinner loading-sm" />}
            {plan ? 'Save changes' : 'Create plan'}
          </button>
        </>
      }
    >
      <form
        id={formId}
        className="flex flex-col gap-6"
        onSubmit={(e) => void handleSubmit(onSubmit)(e)}
      >
        {plan ? (
          <div className="flex items-center gap-2" title="Code cannot be changed after creation">
            <span className="text-muted text-sm">Code</span>
            <span className="badge badge-soft">{plan.code}</span>
          </div>
        ) : (
          <TextField control={control} name="code" label="Code, e.g. asia-basic" size="md" />
        )}

        {plan ? (
          <Controller
            control={control}
            name="isActive"
            render={({ field }) => (
              <label className="border-base-300 rounded-box flex items-center justify-between gap-4 border p-3">
                <span className="flex flex-col">
                  <span className="text-base-content font-medium">Active</span>
                  <span className="text-muted text-sm">Shown to customers on the storefront</span>
                </span>
                <input
                  type="checkbox"
                  className="switch switch-primary"
                  checked={field.value}
                  onChange={(event) => field.onChange(event.target.checked)}
                  onBlur={field.onBlur}
                />
              </label>
            )}
          />
        ) : null}

        <FormSection
          title="Price tiers"
          description="Price per traveller by trip length, incl. stamp duty & VAT. The last tier's end day is the plan's max trip length (up to 365 days)."
        >
          <PlanTierFields control={control} />
        </FormSection>

        <FormSection
          title="Coverages"
          description="Sum insured per category. Leave empty for categories the plan doesn't cover."
          error={errors.coverages?.message}
        >
          <PlanCoverageFields control={control} />
        </FormSection>

        <FormSection title="Countries" error={errors.countryIds?.message}>
          <Controller
            control={control}
            name="countryIds"
            render={({ field }) => (
              <PlanCountryPicker
                countries={countries}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </FormSection>

        <FormSection
          title="Add-ons"
          description="Optional extras customers can buy with this plan."
        >
          <Controller
            control={control}
            name="addonIds"
            render={({ field }) => (
              <PlanAddonPicker addons={addons} value={field.value} onChange={field.onChange} />
            )}
          />
        </FormSection>

        {errorMessage && (
          <div className="alert alert-error text-sm" role="alert">
            {errorMessage}
          </div>
        )}
      </form>
    </Modal>
  )
}
