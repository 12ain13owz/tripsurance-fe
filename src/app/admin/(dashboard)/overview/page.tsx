'use client'

import { useSession } from '@/core/session'
import { OverviewView } from '@/features/admin'

export default function OverviewPage() {
  const { user } = useSession()

  return (
    <div className="flex flex-col gap-6">
      <p className="text-muted text-sm">
        Signed in as {user?.email ?? 'unknown'} ({user?.role ?? 'unknown'})
      </p>
      <OverviewView />
    </div>
  )
}
