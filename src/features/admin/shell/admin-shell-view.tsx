'use client'

import { useState } from 'react'
import { signOut, useSession } from '@/core/session'
import { Navbar } from './components/Navbar'
import { Sidebar } from './components/Sidebar'
import type { ReactNode } from 'react'

export function AdminShellView({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)
  const { user, clearSession } = useSession()

  async function onSignOut() {
    setIsSigningOut(true)
    try {
      await signOut()
    } catch {
      // Still sign out locally even if the server call failed
    } finally {
      clearSession()
    }
  }

  return (
    <div className="flex min-h-svh">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex flex-1 flex-col">
        <Navbar
          email={user?.email}
          isSigningOut={isSigningOut}
          onMenuClick={() => setIsSidebarOpen(true)}
          onSignOut={() => void onSignOut()}
        />
        <main className="bg-base-200 flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
