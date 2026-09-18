'use client'

import { createContext, useContext, useState } from 'react'
import type { SessionUser } from './session.type'
import type { ReactNode } from 'react'

interface SessionContextValue {
  user: SessionUser | null
  accessToken: string | null
  setSession: (user: SessionUser, accessToken: string) => void
  clearSession: () => void
}

const SessionContext = createContext<SessionContextValue | null>(null)

export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)

  function setSession(user: SessionUser, accessToken: string) {
    setUser(user)
    setAccessToken(accessToken)
  }

  function clearSession() {
    setUser(null)
    setAccessToken(null)
  }

  return (
    <SessionContext.Provider value={{ user, accessToken, setSession, clearSession }}>
      {children}
    </SessionContext.Provider>
  )
}

export function useSession() {
  const context = useContext(SessionContext)
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider')
  }
  return context
}
