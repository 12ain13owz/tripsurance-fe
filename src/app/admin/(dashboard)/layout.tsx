import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Dashboard - Tripsurance',
  description: 'Manage travel insurance policies',
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
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
