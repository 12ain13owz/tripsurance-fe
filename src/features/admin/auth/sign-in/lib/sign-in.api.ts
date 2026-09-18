import { apiClient, ApiError } from '@/core/api'
import type { SessionUser } from '@/core/session'
import type { SignInFormValue } from '../schemas/sign-in-form.schema'

interface SignInData {
  user: SessionUser
  accessToken: string
}

export async function signIn(payload: SignInFormValue): Promise<SignInData> {
  const { data } = await apiClient.post<SignInData>('/auth/sign-in', payload)

  if (!data) {
    throw new ApiError('Sign-in succeeded but no data was returned', 500)
  }

  return data
}
