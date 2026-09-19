'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Mail } from 'lucide-react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { TextField } from '@/shared/components/forms'
import { adminRoutes } from '@/shared/routes'
import {
  ForgotPasswordFormSchema,
  type ForgotPasswordFormValue,
} from '../schemas/forgot-password-form.schema'

interface ForgotPasswordFormProps {
  isSubmitting?: boolean
  onSubmit: (value: ForgotPasswordFormValue) => void
}

export function ForgotPasswordForm({ isSubmitting = false, onSubmit }: ForgotPasswordFormProps) {
  const { control, handleSubmit } = useForm<ForgotPasswordFormValue>({
    resolver: zodResolver(ForgotPasswordFormSchema),
    defaultValues: { email: '' },
  })

  return (
    <form className="flex flex-col gap-6" onSubmit={(e) => void handleSubmit(onSubmit)(e)}>
      <TextField
        control={control}
        name="email"
        label="Email"
        type="email"
        icon={Mail}
        autoComplete="email"
      />

      <div className="flex flex-col gap-4">
        <button type="submit" className="btn btn-primary btn-block" disabled={isSubmitting}>
          {isSubmitting && <span className="loading loading-spinner loading-sm" />}
          Continue
        </button>

        <div className="flex justify-center">
          <Link
            href={adminRoutes.signIn}
            className="text-primary flex items-center gap-2 text-sm font-medium hover:underline"
          >
            <ArrowLeft className="size-4" />
            Back to Sign In
          </Link>
        </div>
      </div>
    </form>
  )
}
