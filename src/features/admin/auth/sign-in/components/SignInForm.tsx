'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Mail } from 'lucide-react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { PasswordField, TextField } from '@/shared/components/forms'
import { signInFormSchema, type SignInFormValue } from '../schemas/sign-in-form.schema'

interface SignInFormProps {
  isSubmitting?: boolean
  onSubmit: (value: SignInFormValue) => void
}

export function SignInForm({ isSubmitting = false, onSubmit }: SignInFormProps) {
  const { control, handleSubmit } = useForm<SignInFormValue>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: { email: '', password: '' },
  })

  return (
    <form className="flex flex-col gap-6" onSubmit={(e) => void handleSubmit(onSubmit)(e)}>
      <div className="flex flex-col gap-4">
        <TextField
          control={control}
          name="email"
          label="Email address"
          type="email"
          icon={Mail}
          autoComplete="email"
        />
        <PasswordField
          control={control}
          name="password"
          label="Password"
          autoComplete="current-password"
        />
      </div>

      <div className="flex justify-end">
        <Link
          href="/admin/forgot-password"
          className="text-primary text-sm font-medium hover:underline"
        >
          Forgot password?
        </Link>
      </div>

      <button type="submit" className="btn btn-primary btn-lg w-full" disabled={isSubmitting}>
        {isSubmitting && <span className="loading loading-spinner loading-sm" />}
        Sign in
      </button>
    </form>
  )
}
