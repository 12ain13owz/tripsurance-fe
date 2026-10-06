import type { LucideIcon } from 'lucide-react'

interface AuthHeaderProps {
  title: string
  subtitle: string
  icon: LucideIcon
}

export function AuthHeader({ title, subtitle, icon: Icon }: AuthHeaderProps) {
  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <span className="bg-primary/10 text-primary flex size-12 items-center justify-center rounded-full">
        <Icon className="size-6" />
      </span>
      <div className="flex flex-col gap-1">
        <h1 className="text-base-content text-xl font-semibold">{title}</h1>
        <p className="text-muted text-sm">{subtitle}</p>
      </div>
    </div>
  )
}
