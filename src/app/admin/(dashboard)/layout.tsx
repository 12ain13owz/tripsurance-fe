'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useSession } from '@/core/session'
import { AdminShellView } from '@/features/admin'
import { SplashScreen } from '@/shared/components/ui'
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
    return <SplashScreen title="Redirecting to sign in…" />
  }

  return <AdminShellView>{children}</AdminShellView>
}
