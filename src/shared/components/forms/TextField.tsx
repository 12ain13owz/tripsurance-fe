'use client'

import { useController } from 'react-hook-form'
import { cn } from '@/shared/utils'
import type { LucideIcon } from 'lucide-react'
import type { Control, FieldPath, FieldValues } from 'react-hook-form'

interface TextFieldProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>
  name: FieldPath<TFieldValues>
  label: string
  type?: 'text' | 'email'
  icon?: LucideIcon
  autoComplete?: string
}

export function TextField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  type = 'text',
  icon: Icon,
  autoComplete,
}: TextFieldProps<TFieldValues>) {
  const {
    field,
    fieldState: { error },
  } = useController({ control, name })

  return (
    <div className="flex flex-col gap-1.5">
      <div className="input-floating">
        <input
          {...field}
          id={name}
          type={type}
          placeholder={label}
          autoComplete={autoComplete}
          className={cn('input input-lg', Icon && 'ps-11', error && 'is-invalid')}
        />
        {Icon && (
          <Icon className="text-disabled pointer-events-none absolute inset-s-4 top-1/2 size-5 -translate-y-1/2" />
        )}
        <label htmlFor={name} className={cn('input-floating-label', Icon && 'ps-7.5')}>
          {label}
        </label>
      </div>
      {error && <p className="text-error text-sm">{error.message}</p>}
    </div>
  )
}
