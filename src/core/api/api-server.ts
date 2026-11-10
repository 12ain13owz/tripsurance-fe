import { env } from '@/core/config'
import { ApiError, UNEXPECTED_ERROR_MESSAGE } from './api-error'
import type { ApiResponse } from './api-client'

interface ServerGetOptions {
  /** Seconds Next.js may reuse the response before asking the BE again; omit for no caching */
  revalidate?: number
}

const SERVER_TIMEOUT_MS = 10_000

// Public GET for server components. Unlike apiClient: no access token, no toast (there is no
// browser to show one) and it calls env.apiServerUrl. Errors are thrown as ApiError, same
// envelope rules as apiClient, so the caller renders them in place.
export async function serverGet<T>(
  path: string,
  { revalidate }: ServerGetOptions = {}
): Promise<T | undefined> {
  let res: Response
  try {
    res = await fetch(`${env.apiServerUrl}${path}`, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(SERVER_TIMEOUT_MS),
      ...(revalidate === undefined ? { cache: 'no-store' } : { next: { revalidate } }),
    })
  } catch {
    throw new ApiError('Unable to reach the server', 0)
  }

  const json = (await res.json().catch(() => null)) as ApiResponse<T> | null
  if (!res.ok || !json) {
    const message = res.status >= 500 ? UNEXPECTED_ERROR_MESSAGE : json?.message
    throw new ApiError(message ?? UNEXPECTED_ERROR_MESSAGE, res.status, json?.data)
  }

  return json.data
}
