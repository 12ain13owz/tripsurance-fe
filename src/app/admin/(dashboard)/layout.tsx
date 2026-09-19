'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useSession } from '@/core/session'
import { AdminShellView } from '@/features/admin'
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

  return <AdminShellView>{children}</AdminShellView>
}
