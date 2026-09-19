'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useSession } from '@/core/session'
import { adminRoutes } from '@/shared/routes'
import type { ReactNode } from 'react'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      void router.replace(adminRoutes.signIn)
    }
  }, [status, router])

  if (status !== 'authenticated') {
    return null
  }

  return (
    <div className="flex min-h-svh">
      <aside className="bg-base-200 w-56 shrink-0 p-4">
        <span className="text-lg font-semibold">Tripsurance Admin</span>
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="border-base-300 border-b px-6 py-4" />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
