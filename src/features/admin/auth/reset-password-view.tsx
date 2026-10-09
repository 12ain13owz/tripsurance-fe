'use client'

import { KeyRound } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { getErrorMessage } from '@/core/api'
import { useSession } from '@/core/session'
import { adminRoutes } from '@/shared/routes'
import { AuthHeader } from './components/AuthHeader'
import { ResetPasswordForm } from './components/ResetPasswordForm'
import { resetPassword } from './lib/auth.api'
import type { ResetPasswordPayload } from './lib/auth.type'
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
      setErrorMessage(getErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <AuthHeader title="Reset password" subtitle="Enter your new password below" icon={KeyRound} />
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
