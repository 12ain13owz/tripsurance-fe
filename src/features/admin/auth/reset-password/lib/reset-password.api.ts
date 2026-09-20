import { apiClient, ApiError } from '@/core/api'
import type { SessionData } from '@/core/session'

export interface ResetPasswordPayload {
  token: string
  newPassword: string
  confirmPassword: string
}

export async function resetPassword(payload: ResetPasswordPayload): Promise<SessionData> {
  const { data } = await apiClient.post<SessionData>('/auth/reset-password', payload)
  if (!data) {
    throw new ApiError('Sign-in succeeded but no data was returned', 500)
  }

  return data
}
