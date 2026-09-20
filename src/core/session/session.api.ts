import { apiClient, ApiError } from '@/core/api'
import type { SessionUser } from './session.type'

export interface SessionData {
  user: SessionUser
  accessToken: string
}

export interface SignInPayload {
  email: string
  password: string
}

export async function signIn(payload: SignInPayload): Promise<SessionData> {
  const { data } = await apiClient.post<SessionData>('/auth/sign-in', payload)
  if (!data) {
    throw new ApiError('Sign-in succeeded but no data was returned', 500)
  }

  return data
}

export async function signOut(): Promise<void> {
  await apiClient.post('/auth/sign-out')
}

export async function refreshSession(): Promise<SessionData> {
  const { data } = await apiClient.post<SessionData>('/auth/refresh')
  if (!data) {
    throw new ApiError('Unable to refresh session', 500)
  }

  return data
}
