import { apiClient } from '@/core/api'
import type { SessionUser } from '@/core/session'
import type { SignInFormValue } from '../schemas/sign-in-form.schema'

interface SignInData {
  user: SessionUser
  accessToken: string
}

export async function signIn(payload: SignInFormValue) {
  return apiClient.post<SignInData>('/auth/sign-in', payload)
}
