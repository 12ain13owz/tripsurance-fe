import type { PlanCoverageCategory } from '@/shared/const'

export type AddonPricingType = 'PER_ORDER' | 'PER_TRAVELLER' | 'PER_TRAVELLER_PER_DAY'

/** Money fields are integer satang (THB × 100), gross: stamp duty and VAT included */
export interface PlanPriceTier {
  minDays: number
  maxDays: number
  pricePerTraveller: number
}

export interface PlanCoverage {
  categoryKey: PlanCoverageCategory
  amount: number
}

export interface PlanAddon {
  code: string
  pricingType: AddonPricingType
  price: number
  coverageAmount: number | null
}

/** GET /plans: active plans only, with their active countries and add-ons */
export interface PublicPlan {
  id: string
  code: string
  type: 'SINGLE_TRIP'
  isFeatured: boolean
  /** Ordered by minDays */
  tiers: PlanPriceTier[]
  /** Ordered by planCoverageCategories */
  coverages: PlanCoverage[]
  /** ISO 3166-1 alpha-2 codes */
  countries: string[]
  /** In the add-ons' own sortOrder */
  addons: PlanAddon[]
}
