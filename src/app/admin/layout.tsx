import { SessionProvider } from '@/core/session'
import { SessionBootstrap } from '@/core/session/session-bootstrap'
import type { ReactNode } from 'react'

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <SessionBootstrap>{children}</SessionBootstrap>
    </SessionProvider>
  )
}
