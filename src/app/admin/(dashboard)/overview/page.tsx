'use client'

import { useSession } from '@/core/session'

export default function OverviewPage() {
  const { user } = useSession()

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Overview</h1>
      <p className="text-base-content/70">
        Signed in as {user?.email ?? 'unknown'} ({user?.role ?? 'unknown'})
      </p>
    </div>
  )
}
