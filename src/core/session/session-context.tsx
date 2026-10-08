'use client'

import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { clearAccessToken, setAccessToken } from '@/core/api'
import type { SessionUser } from './session.type'
import type { ReactNode } from 'react'

type SessionStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated'
interface SessionContextValue {
  user: SessionUser | null
  status: SessionStatus
  setSession: (user: SessionUser, accessToken: string) => void
  clearSession: () => void
  startLoading: () => void
}

const SessionContext = createContext<SessionContextValue | null>(null)

export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null)
  const [status, setStatus] = useState<SessionStatus>('idle')

  const setSession = useCallback((user: SessionUser, accessToken: string) => {
    setAccessToken(accessToken)
    setUser(user)
    setStatus('authenticated')
  }, [])

  const clearSession = useCallback(() => {
    clearAccessToken()
    setUser(null)
    setStatus('unauthenticated')
  }, [])

  const startLoading = useCallback(() => {
    setStatus('loading')
  }, [])

  const sessionValue = useMemo<SessionContextValue>(
    () => ({ user, status, setSession, clearSession, startLoading }),
    [user, status, setSession, clearSession, startLoading]
  )

  return <SessionContext.Provider value={sessionValue}>{children}</SessionContext.Provider>
}

export function useSession() {
  const context = useContext(SessionContext)
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider')
  }
  return context
}
