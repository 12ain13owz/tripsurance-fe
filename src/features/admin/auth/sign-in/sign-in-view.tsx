'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ApiError } from '@/core/api'
import { env } from '@/core/config'
import { useSession } from '@/core/session'
import { adminRoutes } from '@/shared/routes'
import { DevQuickSignIn } from './components/DevQuickSignIn'
import { SignInForm } from './components/SignInForm'
import { SignInHeader } from './components/SignInHeader'
import { DEV_SEED_PASSWORD } from './lib/dev-seed-users'
import { signIn } from './lib/sign-in.api'
import type { SignInFormValue } from './schemas/sign-in-form.schema'

export function SignInView() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMesssage] = useState<string | null>(null)
  const { status, setSession } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'authenticated') {
      void router.replace(adminRoutes.overview)
    }
  }, [status, router])

  async function handleSubmit(value: SignInFormValue) {
    setIsSubmitting(true)
    setErrorMesssage(null)

    try {
      const { user, accessToken } = await signIn(value)
      setSession(user, accessToken)
      router.push(adminRoutes.overview)
    } catch (error) {
      setErrorMesssage(error instanceof ApiError ? error.message : 'An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (status !== 'unauthenticated') {
    return null
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

      {env.isDev && (
        <DevQuickSignIn
          isSubmitting={isSubmitting}
          onSelect={(user) => void handleSubmit({ email: user.email, password: DEV_SEED_PASSWORD })}
        />
      )}
    </div>
  )
}
