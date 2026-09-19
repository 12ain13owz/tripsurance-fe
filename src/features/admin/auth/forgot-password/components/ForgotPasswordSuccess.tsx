import { ArrowLeft, MailCheck } from 'lucide-react'
import Link from 'next/link'
import { adminRoutes } from '@/shared/routes'

interface ForgotPasswordSuccessProps {
  email: string
}

export function ForgotPasswordSuccess({ email }: ForgotPasswordSuccessProps) {
  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <div className="flex flex-col items-center gap-3">
        <span className="bg-success/10 text-success flex size-12 items-center justify-center rounded-full">
          <MailCheck className="size-6" />
        </span>

        <div className="flex flex-col gap-1">
          <h1 className="text-base-content text-xl font-semibold">Reset link sent</h1>
          <p className="text-muted text-sm">
            We&apos;ve sent a password reset link to{' '}
            <span className="text-base-content font-medium">{email}</span>. Please check your inbox.
          </p>
        </div>
      </div>

      <Link
        href={adminRoutes.signIn}
        className="text-primary flex items-center gap-2 text-sm font-medium hover:underline"
      >
        <ArrowLeft className="size-4" />
        Back to Sign In
      </Link>
    </div>
  )
}
