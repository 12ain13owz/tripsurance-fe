import { KeyRound } from 'lucide-react'

export function ForgotPasswordHeader() {
  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <span className="bg-primary/10 text-primary flex size-12 items-center justify-center rounded-full">
        <KeyRound className="size-6" />
      </span>
      <div className="flex flex-col gap-1">
        <h1 className="text-base-content text-xl font-semibold">Forgot password</h1>
        <p className="text-muted text-sm">Enter your email address below to reset your password.</p>
      </div>
    </div>
  )
}
