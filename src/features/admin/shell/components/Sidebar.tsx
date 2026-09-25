'use client'

import { ShieldCheck, X } from 'lucide-react'
import Image from 'next/image'
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
          'bg-linear-to-b from-primary to-primary/55 border-primary-content/15 fixed inset-y-0 left-0 z-50 flex w-60 flex-col overflow-hidden border-r transition-transform duration-300',
          'lg:sticky lg:top-0 lg:h-svh lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <Image
          src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-1.2.1&auto=format&fit=crop&w=2048&q=80"
          alt=""
          aria-hidden="true"
          fill
          sizes="15rem"
          priority
          className="z-0 object-cover opacity-20 mix-blend-overlay"
        />

        <div className="border-primary-content/15 h-admin-topbar relative z-10 flex shrink-0 items-center justify-between border-b px-4">
          <Link href="/admin/overview" className="flex items-center gap-2.5">
            <span className="bg-primary-content/15 text-primary-content flex size-8 items-center justify-center rounded-full">
              <ShieldCheck className="size-4.5" />
            </span>
            <span className="text-primary-content text-sm font-semibold">Tripsurance Admin</span>
          </Link>
          <button
            type="button"
            className="btn btn-text btn-circle btn-sm text-primary-content lg:hidden"
            aria-label="Close menu"
            onClick={onClose}
          >
            <X className="size-4.5" />
          </button>
        </div>

        <ul className="menu menu-vertical relative z-10 flex-1 gap-1 overflow-y-auto p-3">
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
                      ? 'bg-primary-content/15 border-primary-content text-primary-content'
                      : 'text-primary-content/75 hover:bg-primary-content/10 hover:text-primary-content'
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
