'use client'

import { KeyRound } from 'lucide-react'
import { useState } from 'react'
import { getErrorMessage } from '@/core/api'
import { AuthHeader } from './components/AuthHeader'
import { ForgotPasswordForm } from './components/ForgotPasswordForm'
import { ForgotPasswordSuccess } from './components/ForgotPasswordSuccess'
import { requestPasswordReset } from './lib/auth.api'
import type { ForgotPasswordPayload } from './lib/auth.type'
import type { ForgotPasswordFormValue } from './schemas/forgot-password-form.schema'

export function ForgotPasswordView() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null)

  async function onForgotPassword(value: ForgotPasswordFormValue) {
    setIsSubmitting(true)
    setErrorMessage(null)

    try {
      const payload: ForgotPasswordPayload = { email: value.email }
      await requestPasswordReset(payload)

      setSubmittedEmail(value.email)
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }
  if (submittedEmail) {
    return <ForgotPasswordSuccess email={submittedEmail} />
  }

  return (
    <div className="flex flex-col gap-6">
      <AuthHeader
        title="Forgot password"
        subtitle="Enter your email address below to reset your password"
        icon={KeyRound}
      />
      <div className="divider" />
      <ForgotPasswordForm isSubmitting={isSubmitting} onSubmit={(v) => void onForgotPassword(v)} />

      {errorMessage && (
        <div className="alert alert-error text-sm" role="alert">
          {errorMessage}
        </div>
      )}
    </div>
  )
}
