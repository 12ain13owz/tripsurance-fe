import { cn } from '@/shared/utils'
import type { ComponentProps } from 'react'

export function Panel({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'bg-base-100 border-base-300 rounded-box flex flex-col border p-4 shadow-sm sm:p-5',
        className
      )}
      {...props}
    />
  )
}
