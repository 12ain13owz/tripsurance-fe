import { MotionProvider } from '@/shared/components/motions'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import type { ReactNode } from 'react'

export function ConsumerShellView({ children }: { children: ReactNode }) {
  return (
    <MotionProvider>
      <Header />
      <main className="flex flex-1 flex-col">{children}</main>
      <Footer />
    </MotionProvider>
  )
}
