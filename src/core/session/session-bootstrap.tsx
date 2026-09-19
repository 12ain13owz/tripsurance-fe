'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { refreshSession } from './refresh-session.api'
import { useSession } from './session-context'

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
    return null // TODO: ใส่ full-page spinner กัน flash ของหน้า sign-in/overview
  }

  return <>{children}</>
}
