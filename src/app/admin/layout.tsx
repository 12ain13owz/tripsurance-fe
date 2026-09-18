import { SessionProvider } from '@/core/session'
import type { ReactNode } from 'react'

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>
}
