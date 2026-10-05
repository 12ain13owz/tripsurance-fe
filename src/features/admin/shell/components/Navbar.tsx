'use client'

import { EllipsisVertical, LogOut, Menu } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { adminNavItems } from '../lib/nav-items'

interface NavbarProps {
  email: string | undefined
  isSigningOut: boolean
  onMenuClick: () => void
  onSignOut: () => void
}

export function Navbar({ email, isSigningOut, onMenuClick, onSignOut }: NavbarProps) {
  const pathname = usePathname()
  const page = adminNavItems.find((item) => item.href === pathname)

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
            <p className="text-subtle truncate text-xs">{email}</p>
          </li>
          <li>
            <button
              type="button"
              className="dropdown-item text-error"
              disabled={isSigningOut}
              onClick={onSignOut}
            >
              <LogOut className="size-4" />
              Sign Out
            </button>
          </li>
        </ul>
      </div>
    </header>
  )
}
