import { cn } from '@/shared/utils'

interface SkeletonProps {
  /** Size and shape: h-4 w-32, size-11 rounded-full, … */
  className?: string
}

// A placeholder block while content loads. Feature-shaped skeletons (a plan card, a table row)
// live in their feature and are built from this — see DESIGN.md §4 Loading states
export function Skeleton({ className }: SkeletonProps) {
  return <div aria-hidden="true" className={cn('skeleton skeleton-animated', className)} />
}
