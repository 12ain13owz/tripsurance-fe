'use client'

import { Navbar } from './components/Navbar'
import { Sidebar } from './components/Sidebar'
import type { ReactNode } from 'react'

export function AdminShellView({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-svh">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Navbar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
