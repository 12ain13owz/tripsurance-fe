import { useTranslations } from 'next-intl'
import { Skeleton } from '@/shared/components/ui'
import { planCoverageCategories } from '@/shared/const'

const SKELETON_CARDS = 3

// Same grid and section rhythm as the real cards, so nothing jumps when they arrive.
// No fake prices — plain bars only (DESIGN.md §4 Loading states)
export function PlanGridSkeleton() {
  const t = useTranslations('COMMON')

  return (
    <div
      role="status"
      aria-label={t('LOADING')}
      className="grid gap-6 pt-3 md:grid-cols-2 lg:grid-cols-3"
    >
      {Array.from({ length: SKELETON_CARDS }, (_, card) => (
        <div
          key={card}
          className="bg-base-100 border-base-300 rounded-box flex flex-col border shadow-sm"
        >
          <div className="flex items-start gap-3.5 px-6 py-5">
            <Skeleton className="size-11 shrink-0 rounded-full" />
            <div className="flex grow flex-col gap-2">
              <Skeleton className="h-6 w-2/3" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
          <div className="border-base-300 flex flex-col gap-2.5 border-t px-6 py-5">
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <div className="border-base-300 flex flex-col gap-2.5 border-t px-6 py-5">
            {planCoverageCategories.map((key) => (
              <Skeleton key={key} className="h-4 w-full" />
            ))}
          </div>
          <div className="border-base-300 flex flex-col gap-2.5 border-t px-6 py-5">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      ))}
    </div>
  )
}
