import { notify } from '@/core/notify'
import { SESSION_EXPIRED_MESSAGE } from './api-error'

export const AUTH_REFRESH_PATH = '/auth/refresh'

interface SessionRenewalHandlers {
  /** Gets and stores a new access token; must reject when the session can't be renewed */
  refresh: () => Promise<void>
  /** Drops the local session once renewal has failed */
  onExpired: () => void
}

let handlers: SessionRenewalHandlers | null = null
let inFlight: Promise<boolean> | null = null

export function registerSessionRenewal(next: SessionRenewalHandlers) {
  handlers = next

  return () => {
    if (handlers === next) {
      handlers = null
    }
  }
}

// Every 401 that arrives during a refresh waits for that same refresh: the backend rotates
// the refresh token, so a second parallel call would be rejected and sign the user out
export async function renewSession(): Promise<boolean> {
  if (!handlers) {
    return false
  }

  const { refresh, onExpired } = handlers
  inFlight ??= refresh()
    .then(() => true)
    .catch(() => {
      onExpired()
      notify.error(SESSION_EXPIRED_MESSAGE)
      return false
    })
    .finally(() => {
      inFlight = null
    })

  return inFlight
}
