'use client'

import { ShieldCheck } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getErrorMessage } from '@/core/api'
import { env } from '@/core/config'
import type { SignInPayload } from '@/core/session'
import { signIn, useSession } from '@/core/session'
import { SplashScreen } from '@/shared/components/ui'
import { adminRoutes } from '@/shared/routes'
import { AuthHeader } from './components/AuthHeader'
import { DevQuickSignIn } from './components/DevQuickSignIn'
import { SignInForm } from './components/SignInForm'
import { DEV_SEED_PASSWORD } from './lib/dev-seed-users'
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

  async function onSignIn(value: SignInFormValue) {
    setIsSubmitting(true)
    setErrorMesssage(null)

    try {
      const payload: SignInPayload = { email: value.email, password: value.password }
      const { user, accessToken } = await signIn(payload)

      setSession(user, accessToken)
      router.push(adminRoutes.overview)
    } catch (error) {
      setErrorMesssage(getErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  if (status !== 'unauthenticated') {
    return <SplashScreen title="Redirecting to dashboard…" />
  }

  return (
    <div className="flex flex-col gap-6">
      <AuthHeader
        title="Sign in to Tripsurance Admin"
        subtitle="Manage policies, claims, and customers."
        icon={ShieldCheck}
      />
      <div className="divider" />
      <SignInForm isSubmitting={isSubmitting} onSubmit={(v) => void onSignIn(v)} />

      {errorMessage && (
        <div className="alert alert-error text-sm" role="alert">
          {errorMessage}
        </div>
      )}

      {env.isDev && (
        <DevQuickSignIn
          isSubmitting={isSubmitting}
          onSelect={(user) => void onSignIn({ email: user.email, password: DEV_SEED_PASSWORD })}
        />
      )}
    </div>
  )
}
