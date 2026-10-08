'use client'

import { Eye, EyeOff, Lock } from 'lucide-react'
import { useId, useState } from 'react'
import { useController } from 'react-hook-form'
import { cn } from '@/shared/utils'
import { fieldSizeClass } from './field'
import type { FieldSize, FieldVariant } from './field'
import type { LucideIcon } from 'lucide-react'
import type { Control, FieldPath, FieldValues } from 'react-hook-form'

interface PasswordFieldProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>
  name: FieldPath<TFieldValues>
  label: string
  id?: string
  variant?: FieldVariant
  placeholder?: string
  size?: FieldSize
  icon?: LucideIcon
  autoComplete?: string
}

export function PasswordField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  id,
  variant = 'floating',
  placeholder = '',
  size = 'lg',
  icon: Icon = Lock,
  autoComplete,
}: PasswordFieldProps<TFieldValues>) {
  const {
    field,
    fieldState: { error },
  } = useController({ control, name })
  const [showPassword, setShowPassword] = useState(false)
  const autoId = useId()
  const inputId = id ?? autoId
  const sizes = fieldSizeClass[size]
  const ToggleIcon = showPassword ? EyeOff : Eye

  const input = (
    <input
      {...field}
      id={inputId}
      type={showPassword ? 'text' : 'password'}
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
        <Icon aria-hidden className={cn('text-disabled my-auto shrink-0', sizes.icon)} />

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

        <button
          type="button"
          onClick={() => setShowPassword((v) => !v)}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          className="text-disabled hover:text-base-content/70 my-auto shrink-0 cursor-pointer"
        >
          <ToggleIcon className={sizes.icon} />
        </button>
      </div>

      {error && <p className="text-error text-sm">{error.message}</p>}
    </div>
  )
}
