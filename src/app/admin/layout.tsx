import { BaseLayout } from '@/core/layout'
import { SessionProvider } from '@/core/session'
import { SessionBootstrap } from '@/core/session/session-bootstrap'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import '@/app/globals.css'

export const metadata: Metadata = {
  title: 'Tripsurance Admin',
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <BaseLayout lang="en">
      <SessionProvider>
        <SessionBootstrap>{children}</SessionBootstrap>
      </SessionProvider>
    </BaseLayout>
  )
}
