import type { ReactNode } from 'react'

interface SplashScreenProps {
  title: string
  description?: string
  icon?: ReactNode
}

export function SplashScreen({ title, description, icon }: SplashScreenProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="bg-base-100 flex min-h-dvh items-center justify-center p-6"
    >
      <div className="flex flex-col items-center gap-4 text-center transition-opacity delay-300 duration-200 starting:opacity-0">
        {icon ?? <span className="loading loading-spinner loading-lg text-primary" />}
        <div className="flex flex-col gap-1">
          <p className="text-base-content text-lg font-semibold">{title}</p>
          {description && <p className="text-muted text-sm">{description}</p>}
        </div>
      </div>
    </div>
  )
}
