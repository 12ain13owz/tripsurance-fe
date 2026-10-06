import { DEV_SEED_USERS, type DevSeedUser } from '../lib/dev-seed-users'

interface DevQuickSignInProps {
  isSubmitting?: boolean
  onSelect: (user: DevSeedUser) => void
}

export function DevQuickSignIn({ isSubmitting = false, onSelect }: DevQuickSignInProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="divider text-muted text-xs">Dev quick sign-in</div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {DEV_SEED_USERS.map((user) => (
          <button
            key={user.email}
            type="button"
            className="btn btn-outline btn-sm h-auto flex-col gap-0.5 py-2"
            disabled={isSubmitting}
            onClick={() => onSelect(user)}
          >
            <span>{user.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
