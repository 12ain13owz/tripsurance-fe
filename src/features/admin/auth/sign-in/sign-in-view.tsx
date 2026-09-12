'use client'

import { useState } from 'react'
import { ApiError } from '@/core/api'
import { env } from '@/core/config'
import { DevQuickSignIn } from './components/DevQuickSignIn'
import { SignInForm } from './components/SignInForm'
import { SignInHeader } from './components/SignInHeader'
import { DEV_SEED_PASSWORD, type DevSeedUser } from './lib/dev-seed-users'
import { signIn } from './lib/sign-in.api'
import type { SignInFormValue } from './schemas/sign-in-form.schema'

export function SignInView() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMesssage] = useState<string | null>(null)

  async function handleSubmit(value: SignInFormValue) {
    setIsSubmitting(true)
    setErrorMesssage(null)

    try {
      const { data } = await signIn(value)
      console.log(data)
    } catch (error) {
      setErrorMesssage(error instanceof ApiError ? error.message : 'An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleDevQuickSignIn(user: DevSeedUser) {
    void handleSubmit({ email: user.email, password: DEV_SEED_PASSWORD })
  }

  return (
    <div className="flex flex-col gap-6">
      <SignInHeader />
      <div className="divider" />
      <SignInForm isSubmitting={isSubmitting} onSubmit={(v) => void handleSubmit(v)} />

      {errorMessage && (
        <div className="alert alert-error text-sm" role="alert">
          {errorMessage}
        </div>
      )}

      {env.isDev && <DevQuickSignIn isSubmitting={isSubmitting} onSelect={handleDevQuickSignIn} />}
    </div>
  )
}
