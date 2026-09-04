import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Dashboard - Tripsurance',
  description: 'Manage travel insurance policies',
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-base-200 flex min-h-svh items-center justify-center p-4">
      <div className="rounded-box border-base-300 bg-base-100 w-full max-w-md border p-6 shadow-sm md:p-8">
        <main>{children}</main>
      </div>
    </div>
  )
}
