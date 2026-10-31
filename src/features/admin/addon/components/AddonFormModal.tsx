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
          <div className="flex flex-col gap-1">
            <span className="text-muted text-sm">Code</span>
            <span className="text-base-content font-medium">{addon.code}</span>
            <span className="text-muted text-sm">Code cannot be changed after creation</span>
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
        <TextField
          control={control}
          name="price"
          label="Price (THB, incl. stamp duty & VAT)"
          size="md"
        />
        <TextField
          control={control}
          name="coverageAmount"
          label="Coverage amount (THB, optional)"
          size="md"
        />

        {addon ? (
          <Controller
            control={control}
            name="isActive"
            render={({ field }) => (
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  className="switch switch-primary"
                  checked={field.value}
                  onChange={(event) => field.onChange(event.target.checked)}
                  onBlur={field.onBlur}
                />
                <span className="label-text">Active</span>
              </label>
            )}
          />
        ) : (
          <p className="text-muted text-sm">
            New add-ons start inactive — activate one from the list when it&apos;s ready.
          </p>
        )}

        {errorMessage && (
          <div className="alert alert-error text-sm" role="alert">
            {errorMessage}
          </div>
        )}
      </form>
    </Modal>
  )
}
