'use client'

import { Eye, EyeOff, Lock } from 'lucide-react'
import { useState } from 'react'
import { useController } from 'react-hook-form'
import { cn } from '@/shared/utils'
import type { Control, FieldPath, FieldValues } from 'react-hook-form'

interface PasswordFieldProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>
  name: FieldPath<TFieldValues>
  label: string
  autoComplete?: string
}

export function PasswordField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  autoComplete,
}: PasswordFieldProps<TFieldValues>) {
  const [showPassword, setShowPassword] = useState(false)
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
          type={showPassword ? 'text' : 'password'}
          placeholder={label}
          autoComplete={autoComplete}
          className={cn('input input-lg px-11', error && 'is-invalid')}
        />
        <Lock className="text-disabled pointer-events-none absolute inset-s-4 top-1/2 size-5 -translate-y-1/2" />
        <label htmlFor={name} className="input-floating-label ps-7.5">
          {label}
        </label>
        <button
          type="button"
          onClick={() => setShowPassword((v) => !v)}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          className="text-disabled hover:text-base-content/70 absolute inset-e-4 top-1/2 -translate-y-1/2 cursor-pointer"
        >
          {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
        </button>
      </div>
      {error && <p className="text-error text-sm">{error.message}</p>}
    </div>
  )
}
