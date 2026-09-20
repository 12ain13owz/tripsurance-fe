'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ApiError } from '@/core/api'
import { useSession } from '@/core/session'
import { adminRoutes } from '@/shared/routes'
import { ResetPasswordForm } from './components/ResetPasswordForm'
import { ResetPasswordHeader } from './components/ResetPasswordHeader'
import { resetPassword } from './lib/reset-password.api'
import type { ResetPasswordPayload } from './lib/reset-password.api'
import type { ResetPasswordFormValue } from './schemas/reset-password-form.schema'

interface ResetPasswordViewProps {
  token: string
}

export function ResetPasswordView({ token }: ResetPasswordViewProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const { setSession } = useSession()
  const router = useRouter()

  async function onResetPassword(value: ResetPasswordFormValue) {
    setIsSubmitting(true)
    setErrorMessage(null)

    try {
      const payload: ResetPasswordPayload = {
        token,
        newPassword: value.newPassword,
        confirmPassword: value.confirmPassword,
      }
      const { user, accessToken } = await resetPassword(payload)

      setSession(user, accessToken)
      router.replace(adminRoutes.overview)
    } catch (error) {
      setErrorMessage(error instanceof ApiError ? error.message : 'An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <ResetPasswordHeader />
      <div className="divider"></div>
      <ResetPasswordForm isSubmitting={isSubmitting} onSubmit={(v) => void onResetPassword(v)} />

      {errorMessage && (
        <div className="alert alert-error text-sm" role="alert">
          {errorMessage}
        </div>
      )}
    </div>
  )
}
