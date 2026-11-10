import { useTranslations } from 'next-intl'
import { cn } from '@/shared/utils'

export const orderSteps = ['TRIP', 'PLAN', 'TRAVELLERS', 'PAYMENT'] as const
export type OrderStep = (typeof orderSteps)[number]

interface OrderStepsProps {
  /** Omit while the funnel isn't open yet: every step shows as upcoming */
  current?: OrderStep
}

// DESIGN.md §4 Purchase stepper. Only the full row for now; the condensed md pills and the
// <md progress bar land with the real funnel (Order #6)
export function OrderSteps({ current }: OrderStepsProps) {
  const t = useTranslations('ORDER.STEPS')

  return (
    <ol aria-label={t('LABEL')} className="grid grid-cols-4 gap-2">
      {orderSteps.map((step, index) => {
        const isCurrent = step === current
        return (
          <li
            key={step}
            aria-current={isCurrent ? 'step' : undefined}
            className={cn(
              'flex flex-col items-center gap-1.5 text-center text-xs sm:text-sm',
              isCurrent ? 'font-medium' : 'text-muted'
            )}
          >
            <span
              className={cn(
                'grid size-8 place-items-center rounded-full border-2 font-semibold tabular-nums',
                isCurrent
                  ? 'bg-primary border-primary text-primary-content'
                  : 'bg-base-100 border-base-300'
              )}
            >
              {index + 1}
            </span>
            {t(step)}
          </li>
        )
      })}
    </ol>
  )
}
