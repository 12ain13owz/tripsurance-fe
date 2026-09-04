import { SignInView } from '@/features/admin'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign In - Tripsurance Admin',
  description: 'Sign in to manage travel insurance policies',
}

export default function SignInPage() {
  return <SignInView />
}
