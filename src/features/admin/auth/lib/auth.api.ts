import { apiClient, ApiError } from '@/core/api'
import type { SessionData } from '@/core/session'
import type { ForgotPasswordPayload, ResetPasswordPayload } from './auth.type'

export async function requestPasswordReset(payload: ForgotPasswordPayload): Promise<void> {
  await apiClient.post('/auth/forgot-password', payload)
}

export async function resetPassword(payload: ResetPasswordPayload): Promise<SessionData> {
  const { data } = await apiClient.post<SessionData>('/auth/reset-password', payload)
  if (!data) {
    throw new ApiError('Unable to reset password', 500)
  }

  return data
}
