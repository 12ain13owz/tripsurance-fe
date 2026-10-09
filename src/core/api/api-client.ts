import { env } from '@/core/config'
import { notify } from '@/core/notify'
import { getAccessToken } from './access-token'
import {
  ApiError,
  getErrorMessage,
  SessionExpiredError,
  UNEXPECTED_ERROR_MESSAGE,
} from './api-error'
import { AUTH_REFRESH_PATH, renewSession } from './session-renewal'

interface ApiResponse<T> {
  message: string
  timestamp: string
  data?: T
}

interface RequestConfig {
  notifyError?: boolean
  notifySuccess?: boolean
}

interface RequestOptions extends RequestConfig {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE'
  body?: unknown
}

const DEFAULT_TIMEOUT_MS = 10_000

async function send<T>(path: string, options: RequestOptions): Promise<ApiResponse<T>> {
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
    throw new ApiError('Unable to reach the server, please try again', 0)
  }

  const json = (await res.json().catch(() => null)) as ApiResponse<T> | null

  if (!res.ok || !json) {
    const message = res.status >= 500 ? UNEXPECTED_ERROR_MESSAGE : json?.message
    throw new ApiError(message ?? UNEXPECTED_ERROR_MESSAGE, res.status, json?.data)
  }

  return json
}

async function sendWithRenewal<T>(path: string, options: RequestOptions): Promise<ApiResponse<T>> {
  // Only a request that carried a token can have failed because it expired;
  // a 401 from sign-in is just wrong credentials
  const sentWithToken = getAccessToken() !== null

  try {
    return await send<T>(path, options)
  } catch (error) {
    const isExpiredToken =
      sentWithToken &&
      path !== AUTH_REFRESH_PATH &&
      error instanceof ApiError &&
      error.status === 401
    if (!isExpiredToken) {
      throw error
    }

    if (!(await renewSession())) {
      throw new SessionExpiredError()
    }

    // Retry once with the new token; a second 401 is a real error
    return send<T>(path, options)
  }
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
  const { notifyError = true, notifySuccess = false } = options

  try {
    const json = await sendWithRenewal<T>(path, options)
    if (notifySuccess) {
      notify.success(json.message)
    }

    return json
  } catch (error) {
    // Session expiry has its own single toast from renewSession()
    if (notifyError && !(error instanceof SessionExpiredError)) {
      notify.error(getErrorMessage(error))
    }
    throw error
  }
}
export const apiClient = {
  get: async <T>(path: string, config?: RequestConfig) => request<T>(path, config),
  post: async <T>(path: string, body?: unknown, config?: RequestConfig) =>
    request<T>(path, { ...config, method: 'POST', body }),
  patch: async <T>(path: string, body: unknown, config?: RequestConfig) =>
    request<T>(path, { ...config, method: 'PATCH', body }),
}
