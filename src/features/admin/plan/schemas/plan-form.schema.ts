import { z } from 'zod'
import { planCoverageCategories } from '@/shared/const'

const CODE_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/
const BAHT_PATTERN = /^\d+(\.\d{1,2})?$/
const DAYS_PATTERN = /^\d+$/
const MAX_TRIP_DAYS = 365
const MAX_PRICE_BAHT = 1_000_000
const MAX_COVERAGE_BAHT = 20_000_000

// Kept as text so "20.50" round-trips exactly; the view converts to satang when building the payload
function bahtAmount(max: number) {
  return z
    .string()
    .trim()
    .regex(BAHT_PATTERN, 'Enter an amount in baht, up to 2 decimals')
    .refine((value) => Number(value) > 0, 'Must be more than 0')
    .refine((value) => Number(value) <= max, `Must be at most ฿${max.toLocaleString('en-US')}`)
}

const tierSchema = z.object({
  maxDays: z
    .string()
    .trim()
    .regex(DAYS_PATTERN, 'Enter whole days')
    .refine(
      (value) => Number(value) >= 1 && Number(value) <= MAX_TRIP_DAYS,
      `Must be 1–${MAX_TRIP_DAYS} days`
    ),
  price: bahtAmount(MAX_PRICE_BAHT),
})

export const planFormSchema = z.object({
  code: z
    .string()
    .trim()
    .min(1, 'Code is required')
    .max(50, 'Code must be at most 50 characters')
    .regex(CODE_PATTERN, 'Use lowercase letters, numbers and single hyphens, e.g. asia-basic'),
  isActive: z.boolean(),
  isFeatured: z.boolean(),
  // minDays isn't a field (each tier starts after the previous one), so gaps and overlaps
  // can't happen — only maxDays going down or staying the same can
  tiers: z
    .array(tierSchema)
    .min(1, 'Add at least one price tier')
    .superRefine((tiers, ctx) => {
      tiers.forEach((tier, index) => {
        if (index > 0 && Number(tier.maxDays) <= Number(tiers[index - 1].maxDays)) {
          ctx.addIssue({
            code: 'custom',
            path: [index, 'maxDays'],
            message: `Must be more than ${tiers[index - 1].maxDays} days`,
          })
        }
      })
    }),
  // One field per category; empty = the plan doesn't cover it
  coverages: z
    .record(z.enum(planCoverageCategories), bahtAmount(MAX_COVERAGE_BAHT).or(z.literal('')))
    .refine(
      (amounts) => Object.values(amounts).some((amount) => amount !== ''),
      'Enter at least one coverage amount'
    ),
  countryIds: z.array(z.string()).min(1, 'Select at least one country'),
  addonIds: z.array(z.string()),
})

export type PlanFormValue = z.infer<typeof planFormSchema>
