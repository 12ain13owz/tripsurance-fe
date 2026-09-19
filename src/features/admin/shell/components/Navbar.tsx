'use client'

import { useState } from 'react'
import { ApiError } from '@/core/api'
import { signOut, useSession } from '@/core/session'

export function Navbar() {
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMesssage] = useState<string | null>(null)
  const { clearSession } = useSession()

  function onSignOut() {
    setIsLoading(true)
    clearSession()

    try {
      void signOut()
    } catch (error) {
      setErrorMesssage(error instanceof ApiError ? error.message : 'An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <header className="border-base-300 flex items-center gap-4 border-b px-6 py-4">
      <button
        type="button"
        className="btn btn-text btn-square btn-sm lg:hidden"
        aria-label="Open menu"
        data-overlay="#admin-sidebar"
      >
        {/* hamburger icon */}
      </button>
      <div className="flex-1" />

      <button type="button" className="btn btn-error" onClick={onSignOut}>
        Sign Out
      </button>
    </header>
  )
}
