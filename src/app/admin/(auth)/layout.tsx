import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Dashboard - Tripsurance',
  description: 'Manage travel insurance policies',
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh items-center justify-center p-6">
      <div className="card bg-base-100 w-full max-w-sm shadow-md">
        <div className="card-body">{children}</div>
      </div>
    </div>
  )
}
