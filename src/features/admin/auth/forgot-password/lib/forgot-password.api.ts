import { apiClient } from '@/core/api'

export interface ForgotPasswordPayload {
  email: string
}

export async function requestPasswordReset(payload: ForgotPasswordPayload): Promise<void> {
  await apiClient.post('/auth/forgot-password', payload)
}
