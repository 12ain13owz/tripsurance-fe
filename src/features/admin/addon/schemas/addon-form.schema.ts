import { z } from 'zod'
import { addonPricingTypes } from '../lib/addon.type'

const CODE_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/
const BAHT_PATTERN = /^\d+(\.\d{1,2})?$/
const MAX_BAHT = 1_000_000

// Kept as text so "20.50" round-trips exactly; the view converts to satang when building the payload
const bahtAmount = z
  .string()
  .trim()
  .regex(BAHT_PATTERN, 'Enter an amount in baht, up to 2 decimals')
  .refine((value) => Number(value) > 0, 'Must be more than 0')
  .refine((value) => Number(value) <= MAX_BAHT, 'Must be at most ฿1,000,000')

export const addonFormSchema = z.object({
  code: z
    .string()
    .trim()
    .min(1, 'Code is required')
    .max(50, 'Code must be at most 50 characters')
    .regex(CODE_PATTERN, 'Use lowercase letters, numbers and single hyphens, e.g. baggage-plus'),
  pricingType: z.enum(addonPricingTypes),
  price: bahtAmount,
  coverageAmount: bahtAmount.or(z.literal('')),
  isActive: z.boolean(),
})

export type AddonFormValue = z.infer<typeof addonFormSchema>
