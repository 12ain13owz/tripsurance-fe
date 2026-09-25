'use client'

import { EllipsisVertical, LogOut, Menu } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { ApiError } from '@/core/api'
import { signOut, useSession } from '@/core/session'
import { adminNavItems } from '../lib/nav-items'

interface NavbarProps {
  onMenuClick: () => void
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMesssage] = useState<string | null>(null)
  const pathname = usePathname()
  const { user, clearSession } = useSession()
  const page = adminNavItems.find((item) => item.href === pathname)

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
    <header className="border-base-300 h-admin-topbar flex shrink-0 items-center gap-4 border-b px-6">
      <button
        type="button"
        className="btn btn-text btn-square btn-sm text-base-content/70 hover:text-base-content lg:hidden"
        aria-label="Open menu"
        onClick={onMenuClick}
      >
        <Menu className="size-5" />
      </button>

      <div className="min-w-0 flex-1">
        {page && (
          <>
            <h1 className="text-base-content truncate text-base font-semibold">{page.label}</h1>
            <p className="text-muted truncate text-xs">{page.subtitle}</p>
          </>
        )}
      </div>

      {errorMessage && <p className="text-error text-xs">{errorMessage}</p>}

      <div className="dropdown relative inline-flex [--placement:bottom-end]">
        <button
          id="admin-account-menu"
          type="button"
          className="dropdown-toggle btn btn-text btn-square btn-sm text-base-content/70 hover:text-base-content"
          aria-haspopup="menu"
          aria-expanded="false"
          aria-label="Account menu"
        >
          <EllipsisVertical className="size-5" />
        </button>

        <ul
          className="dropdown-menu dropdown-open:opacity-100 hidden min-w-56"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="admin-account-menu"
        >
          <li className="dropdown-header">
            <p className="text-subtle truncate text-xs">{user?.email}</p>
          </li>
          <li>
            <button type="button" className="dropdown-item text-error" disabled={isLoading} onClick={onSignOut}>
              <LogOut className="size-4" />
              Sign Out
            </button>
          </li>
        </ul>
      </div>
    </header>
  )
}
