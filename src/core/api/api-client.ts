import { env } from '@/core/config'
import { getAccessToken } from './access-token'
import { ApiError } from './api-error'

interface ApiResponse<T> {
  message: string
  timestamp: string
  data?: T
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE'
  body?: unknown
}

const DEFAULT_TIMEOUT_MS = 10_000

async function request<T>(path: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
  const accessToken = getAccessToken()

  let res: Response
  try {
    res = await fetch(`${env.apiBaseUrl}${path}`, {
      method: options.method ?? 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
      signal: AbortSignal.timeout(DEFAULT_TIMEOUT_MS),
    })
  } catch (error) {
    if (error instanceof DOMException && error.name === 'TimeoutError') {
      throw new ApiError('Request timed out, please try again', 408)
    }
    throw error
  }

  const json = (await res.json().catch(() => null)) as ApiResponse<T> | null

  if (!res.ok || !json) {
    throw new ApiError(json?.message ?? 'Something went wrong', res.status, json?.data)
  }

  return json
}

export const apiClient = {
  get: async <T>(path: string) => request<T>(path),
  post: async <T>(path: string, body?: unknown) => request<T>(path, { method: 'POST', body }),
  patch: async <T>(path: string, body: unknown) => request<T>(path, { method: 'PATCH', body }),
}
