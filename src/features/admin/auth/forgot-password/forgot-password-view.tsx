'use client'

import { useState } from 'react'
import { ApiError } from '@/core/api'
import { ForgotPasswordForm } from './components/ForgotPasswordForm'
import { ForgotPasswordHeader } from './components/ForgotPasswordHeader'
import { ForgotPasswordSuccess } from './components/ForgotPasswordSuccess'
import { requestPasswordReset } from './lib/forgot-password.api'
import type { ForgotPasswordPayload } from './lib/forgot-password.api'
import type { ForgotPasswordFormValue } from './schemas/forgot-password-form.schema'

export function ForgotPasswordView() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMesssage] = useState<string | null>(null)
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null)

  async function onForgotPassword(value: ForgotPasswordFormValue) {
    setIsSubmitting(true)
    setErrorMesssage(null)

    try {
      const payload: ForgotPasswordPayload = { email: value.email }
      await requestPasswordReset(payload)

      setSubmittedEmail(value.email)
    } catch (error) {
      setErrorMesssage(error instanceof ApiError ? error.message : 'An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }
  if (submittedEmail) {
    return <ForgotPasswordSuccess email={submittedEmail} />
  }

  return (
    <div className="flex flex-col gap-6">
      <ForgotPasswordHeader />
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
