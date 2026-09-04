import { ShieldCheck } from 'lucide-react'

export function SignInHeader() {
  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <span className="bg-primary/10 text-primary flex size-12 items-center justify-center rounded-full">
        <ShieldCheck className="size-6" />
      </span>
      <div className="flex flex-col gap-1">
        <h1 className="text-base-content text-xl font-semibold">Sign in to Tripsurance Admin</h1>
        <p className="text-base-content/60 text-sm">Manage policies, claims, and customers.</p>
      </div>
    </div>
  )
}
