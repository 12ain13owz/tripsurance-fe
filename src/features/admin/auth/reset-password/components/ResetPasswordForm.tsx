'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { PasswordField } from '@/shared/components/forms'
import { adminRoutes } from '@/shared/routes'
import {
  ResetPasswordFormSchema,
  type ResetPasswordFormValue,
} from '../schemas/reset-password-form.schema'

interface ResetPasswordFormProps {
  isSubmitting?: boolean
  onSubmit: (value: ResetPasswordFormValue) => void
}

export function ResetPasswordForm({ isSubmitting = false, onSubmit }: ResetPasswordFormProps) {
  const { control, handleSubmit } = useForm<ResetPasswordFormValue>({
    resolver: zodResolver(ResetPasswordFormSchema),
    defaultValues: { newPassword: '', confirmPassword: '' },
  })

  return (
    <form className="flex flex-col gap-6" onSubmit={(e) => void handleSubmit(onSubmit)(e)}>
      <div className="flex flex-col gap-4">
        <PasswordField
          control={control}
          name="newPassword"
          label="New Password"
          autoComplete="new-password"
        />
        <PasswordField
          control={control}
          name="confirmPassword"
          label="Confirm Password"
          autoComplete="new-password"
        />
      </div>

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
