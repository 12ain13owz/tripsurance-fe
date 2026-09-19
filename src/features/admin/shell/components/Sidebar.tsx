'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { adminRoutes } from '@/shared/routes'
import { cn } from '@/shared/utils'

const NAV_ITEMS = [{ label: 'Overview', href: adminRoutes.overview }]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside
      id="admin-sidebar"
      className="overlay drawer drawer-start hidden [--auto-close:lg] [--is-layout-affect:true] [--opened:lg] max-lg:z-50 lg:static lg:flex lg:w-56 lg:shrink-0 lg:translate-x-0"
    >
      <div className="drawer-header">
        <span className="text-lg font-semibold">Tripsurance Admin</span>
        <button
          type="button"
          className="btn btn-text btn-circle btn-sm lg:hidden"
          aria-label="Close menu"
          data-overlay="#admin-sidebar"
        >
          {/* close icon */}
        </button>
      </div>
      <div className="drawer-body bg-base-200 p-4">
        <ul className="menu menu-vertical gap-1">
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className={cn(pathname === item.href && 'menu-active')}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  )
}
