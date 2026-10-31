'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useId } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { SelectField, TextField } from '@/shared/components/forms'
import type { SelectOption } from '@/shared/components/forms'
import { Modal } from '@/shared/components/ui'
import { satangToBaht } from '@/shared/utils'
import { addonPricingTypeLabels, addonPricingTypes } from '../lib/addon.type'
import { addonFormSchema } from '../schemas/addon-form.schema'
import type { Addon } from '../lib/addon.type'
import type { AddonFormValue } from '../schemas/addon-form.schema'

const pricingTypeOptions: SelectOption[] = addonPricingTypes.map((type) => ({
  value: type,
  label: addonPricingTypeLabels[type],
}))

function toBahtInput(satang: number): string {
  return satangToBaht(satang).toFixed(2)
}

function getDefaultValues(addon: Addon | null): AddonFormValue {
  if (!addon) {
    return {
      code: '',
      pricingType: 'PER_TRAVELLER',
      price: '',
      coverageAmount: '',
      isActive: false,
    }
  }

  return {
    code: addon.code,
    pricingType: addon.pricingType,
    price: toBahtInput(addon.price),
    coverageAmount: addon.coverageAmount === null ? '' : toBahtInput(addon.coverageAmount),
    isActive: addon.isActive,
  }
}

interface AddonFormModalProps {
  /** null = create */
  addon: Addon | null
  isSubmitting: boolean
  errorMessage: string | null
  onSubmit: (value: AddonFormValue) => void
  onClose: () => void
}

// Rendered only while open, so the form starts from fresh default values every time
export function AddonFormModal({
  addon,
  isSubmitting,
  errorMessage,
  onSubmit,
  onClose,
}: AddonFormModalProps) {
  const formId = useId()
  const { control, handleSubmit } = useForm<AddonFormValue>({
    resolver: zodResolver(addonFormSchema),
    defaultValues: getDefaultValues(addon),
  })

  return (
    <Modal
      open
      title={addon ? 'Edit add-on' : 'Add add-on'}
      onClose={onClose}
      footer={
        <>
          <button type="button" className="btn btn-outline" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" form={formId} className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting && <span className="loading loading-spinner loading-sm" />}
            {addon ? 'Save changes' : 'Create add-on'}
          </button>
        </>
      }
    >
      <form
        id={formId}
        className="flex flex-col gap-4"
        onSubmit={(e) => void handleSubmit(onSubmit)(e)}
      >
        {addon ? (
          <div className="flex items-center gap-2" title="Code cannot be changed after creation">
            <span className="text-muted text-sm">Code</span>
            <span className="badge badge-soft">{addon.code}</span>
          </div>
        ) : (
          <TextField control={control} name="code" label="Code, e.g. baggage-plus" size="md" />
        )}

        <SelectField
          control={control}
          name="pricingType"
          label="Pricing"
          options={pricingTypeOptions}
          size="md"
        />

        <div className="flex flex-col gap-2">
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField control={control} name="price" label="Price (฿)" size="md" />
            <TextField control={control} name="coverageAmount" label="Coverage (฿)" size="md" />
          </div>
          <p className="text-muted text-sm">
            Prices include stamp duty &amp; VAT. Leave coverage empty if the add-on has none.
          </p>
        </div>

        {addon ? (
          <Controller
            control={control}
            name="isActive"
            render={({ field }) => (
              <label className="border-base-300 rounded-box flex items-center justify-between gap-4 border p-3">
                <span className="flex flex-col">
                  <span className="text-base-content font-medium">Active</span>
                  <span className="text-muted text-sm">
                    Shown to customers on plans that offer it
                  </span>
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

        {errorMessage && (
          <div className="alert alert-error text-sm" role="alert">
            {errorMessage}
          </div>
        )}
      </form>
    </Modal>
  )
}
