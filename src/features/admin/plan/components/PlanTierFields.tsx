'use client'

import { Plus, Trash2 } from 'lucide-react'
import { useFieldArray, useWatch } from 'react-hook-form'
import { TextField } from '@/shared/components/forms'
import { getTierMinDays } from '../lib/plan-tier'
import type { PlanFormValue } from '../schemas/plan-form.schema'
import type { Control } from 'react-hook-form'

interface PlanTierFieldsProps {
  control: Control<PlanFormValue>
}

export function PlanTierFields({ control }: PlanTierFieldsProps) {
  const { fields, append, remove } = useFieldArray({ control, name: 'tiers' })
  const tiers = useWatch({ control, name: 'tiers' })

  return (
    <div className="flex flex-col gap-3">
      {fields.map((field, index) => (
        <div
          key={field.id}
          className="flex flex-col gap-3 sm:grid sm:grid-cols-[6rem_1fr_1fr_auto] sm:items-start"
        >
          <span className="text-muted text-sm sm:leading-10">
            From day {getTierMinDays(tiers, index) ?? '…'}
          </span>
          <TextField control={control} name={`tiers.${index}.maxDays`} label="To day" size="md" />
          <TextField
            control={control}
            name={`tiers.${index}.price`}
            label="Price / traveller (฿)"
            size="md"
          />
          <button
            type="button"
            className="btn btn-soft btn-primary btn-square sm:mt-1"
            aria-label={`Remove tier ${index + 1}`}
            disabled={fields.length === 1}
            onClick={() => remove(index)}
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      ))}
      <button
        type="button"
        className="btn btn-outline btn-sm self-start"
        onClick={() => append({ maxDays: '', price: '' })}
      >
        <Plus className="size-4" />
        Add tier
      </button>
    </div>
  )
}
