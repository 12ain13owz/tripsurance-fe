'use client'

import { ShieldCheck, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/shared/utils'
import { adminNavItems } from '../lib/nav-items'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={onClose}
          className="bg-base-content/40 fixed inset-0 z-40 lg:hidden"
        />
      )}

      <aside
        className={cn(
          'bg-base-200 border-base-300 fixed inset-y-0 left-0 z-50 flex w-60 flex-col border-r transition-transform duration-300',
          'lg:static lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="border-base-300 h-admin-topbar flex shrink-0 items-center justify-between border-b px-4">
          <Link href="/admin/overview" className="flex items-center gap-2.5">
            <span className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-full">
              <ShieldCheck className="size-4.5" />
            </span>
            <span className="text-base-content text-sm font-semibold">Tripsurance Admin</span>
          </Link>
          <button
            type="button"
            className="btn btn-text btn-circle btn-sm lg:hidden"
            aria-label="Close menu"
            onClick={onClose}
          >
            <X className="size-4.5" />
          </button>
        </div>

        <ul className="menu menu-vertical flex-1 gap-1 overflow-y-auto p-3">
          {adminNavItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  onClick={onClose}
                  className={cn(
                    'rounded-field flex items-center gap-2.5 border-l-2 border-transparent px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary/10 border-primary text-primary'
                      : 'text-base-content/70 hover:bg-base-100 hover:text-base-content'
                  )}
                >
                  <item.icon className="size-4.5 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </aside>
    </>
  )
}
