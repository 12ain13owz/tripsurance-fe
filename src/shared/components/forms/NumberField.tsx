'use client'

import { useId, useState } from 'react'
import { useController } from 'react-hook-form'
import { cn } from '@/shared/utils'
import { fieldSizeClass } from './field'
import type { FieldSize, FieldVariant } from './field'
import type { Control, FieldPath, FieldValues } from 'react-hook-form'

const PLAIN_NUMBER_PATTERN = /^\d+(\.\d+)?$/

// "1999.5" → "1,999.50" with decimals = 2. Never rounds extra decimals away, so the schema
// still sees (and reports) what was typed; anything that isn't a plain number is shown as is
function formatNumber(value: string, decimals: number): string {
  if (!PLAIN_NUMBER_PATTERN.test(value)) {
    return value
  }

  return Number(value).toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: 20,
  })
}

interface NumberFieldProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>
  /** A string field: the form keeps the digits as typed (no separators), the schema parses them */
  name: FieldPath<TFieldValues>
  label: string
  id?: string
  variant?: FieldVariant
  placeholder?: string
  size?: FieldSize
  /** Fraction digits shown when not editing, e.g. 2 for baht */
  decimals?: number
}

// type="text" on purpose: type="number" can't show separators, changes value on mouse wheel
// and reports "" for anything it can't parse
export function NumberField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  id,
  variant = 'floating',
  placeholder = '',
  size = 'lg',
  decimals = 0,
}: NumberFieldProps<TFieldValues>) {
  const {
    field: { ref, name: fieldName, value: fieldValue, onChange, onBlur },
    fieldState: { error },
  } = useController({ control, name })
  const [isEditing, setIsEditing] = useState(false)
  const autoId = useId()
  const inputId = id ?? autoId
  const sizes = fieldSizeClass[size]

  const value = typeof fieldValue === 'string' ? fieldValue : ''

  const input = (
    <input
      ref={ref}
      name={fieldName}
      id={inputId}
      type="text"
      inputMode={decimals > 0 ? 'decimal' : 'numeric'}
      // Separators only while not editing, so the caret never jumps as digits are typed
      value={isEditing ? value : formatNumber(value, decimals)}
      placeholder={placeholder}
      aria-invalid={!!error}
      className="grow"
      onFocus={() => setIsEditing(true)}
      onChange={(event) => onChange(event.target.value.replace(/[,\s]/g, ''))}
      onBlur={() => {
        setIsEditing(false)
        onBlur()
      }}
    />
  )

  return (
    <div className="flex w-full flex-col gap-1.5">
      {variant === 'default' && (
        <label className="label-text" htmlFor={inputId}>
          {label}
        </label>
      )}

      <div className={cn('input', sizes.input, error && 'is-invalid')}>
        {variant === 'floating' ? (
          <div className="input-floating grow">
            {input}
            <label
              htmlFor={inputId}
              className={cn('input-floating-label top-1/2 ms-0', sizes.label)}
            >
              {label}
            </label>
          </div>
        ) : (
          input
        )}
      </div>

      {error && <p className="text-error text-sm">{error.message}</p>}
    </div>
  )
}
