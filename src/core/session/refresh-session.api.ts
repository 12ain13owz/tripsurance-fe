import { apiClient } from '@/core/api/api-client'
import { ApiError } from '@/core/api/api-error'
import type { SessionUser } from './session.type'

interface RefreshSessionData {
  user: SessionUser
  accessToken: string
}

export async function refreshSession() {
  const response = await apiClient.post<RefreshSessionData>('/auth/refresh')
  if (!response.data) {
    throw new ApiError('Unable to refresh session', 500)
  }

  return response.data
}
