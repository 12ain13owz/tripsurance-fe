'use client'

import { useId } from 'react'
import { useController } from 'react-hook-form'
import { cn } from '@/shared/utils'
import { fieldSizeClass } from './field'
import type { FieldSize, FieldVariant } from './field'
import type { Control, FieldPath, FieldValues } from 'react-hook-form'

export interface SelectOption {
  value: string
  label: string
}

interface SelectFieldProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>
  name: FieldPath<TFieldValues>
  label: string
  options: readonly SelectOption[]
  id?: string
  variant?: FieldVariant
  size?: FieldSize
}

export function SelectField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  options,
  id,
  variant = 'floating',
  size = 'lg',
}: SelectFieldProps<TFieldValues>) {
  const {
    field,
    fieldState: { error },
  } = useController({ control, name })
  const autoId = useId()
  const selectId = id ?? autoId
  const sizes = fieldSizeClass[size]

  const select = (
    <select
      {...field}
      id={selectId}
      aria-invalid={!!error}
      className={cn('select', sizes.select, error && 'is-invalid')}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )

  return (
    <div className="flex w-full flex-col gap-1.5">
      {variant === 'default' && (
        <label className="label-text" htmlFor={selectId}>
          {label}
        </label>
      )}

      {variant === 'floating' ? (
        <div className="select-floating">
          {select}
          <label htmlFor={selectId} className={cn('select-floating-label', sizes.label)}>
            {label}
          </label>
        </div>
      ) : (
        select
      )}

      {error && <p className="text-error text-sm">{error.message}</p>}
    </div>
  )
}
