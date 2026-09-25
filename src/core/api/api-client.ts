import { env } from '@/core/config'
import { ApiError } from './api-error'

interface ApiResponse<T> {
  message: string
  timestamp: string
  data?: T
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE'
  body?: unknown
  accessToken?: string
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
  const res = await fetch(`${env.apiBaseUrl}${path}`, {
    method: options.method ?? 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.accessToken ? { Authorization: `Bearer ${options.accessToken}` } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  })

  const json = (await res.json().catch(() => null)) as ApiResponse<T> | null

  if (!res.ok || !json) {
    throw new ApiError(json?.message ?? 'Something went wrong', res.status, json?.data)
  }

  return json
}

export const apiClient = {
  get: async <T>(path: string) => request<T>(path),
  post: async <T>(path: string, body?: unknown) => request<T>(path, { method: 'POST', body }),
  patch: async <T>(path: string, body: unknown, accessToken: string) =>
    request<T>(path, { method: 'PATCH', body, accessToken }),
}
