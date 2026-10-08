'use client'

import { useId } from 'react'
import { useController } from 'react-hook-form'
import { cn } from '@/shared/utils'
import { fieldSizeClass } from './field'
import type { FieldSize, FieldVariant } from './field'
import type { LucideIcon } from 'lucide-react'
import type { Control, FieldPath, FieldValues } from 'react-hook-form'

interface TextFieldProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>
  name: FieldPath<TFieldValues>
  label: string
  id?: string
  variant?: FieldVariant
  placeholder?: string
  type?: 'text' | 'email' | 'search'
  size?: FieldSize
  icon?: LucideIcon
  autoComplete?: string
}

export function TextField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  id,
  variant = 'floating',
  placeholder = '',
  type = 'text',
  size = 'lg',
  icon: Icon,
  autoComplete,
}: TextFieldProps<TFieldValues>) {
  const {
    field,
    fieldState: { error },
  } = useController({ control, name })
  const autoId = useId()
  const inputId = id ?? autoId
  const sizes = fieldSizeClass[size]

  const input = (
    <input
      {...field}
      id={inputId}
      type={type}
      placeholder={placeholder}
      autoComplete={autoComplete}
      aria-invalid={!!error}
      className="grow"
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
        {Icon && <Icon aria-hidden className={cn('text-disabled my-auto shrink-0', sizes.icon)} />}

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
