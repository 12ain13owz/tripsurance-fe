'use client'

import { useEffect, useRef } from 'react'
import { SplashScreen } from '@/shared/components/ui'
import { useSession } from './session-context'
import { refreshSession } from './session.api'
import type { ReactNode } from 'react'

export function SessionBootstrap({ children }: { children: ReactNode }) {
  const { status, setSession, clearSession, startLoading } = useSession()
  const hasStarted = useRef(false)

  useEffect(() => {
    if (hasStarted.current) {
      return
    }
    hasStarted.current = true

    startLoading()
    refreshSession()
      .then(({ user, accessToken }) => setSession(user, accessToken))
      .catch(() => clearSession())
  }, [status, setSession, clearSession, startLoading])

  if (status === 'idle' || status === 'loading') {
    return (
      <>
        <SplashScreen
          title="Verifying your session…"
          description="Please wait a moment"
        ></SplashScreen>
      </>
    )
  }

  return <>{children}</>
}
