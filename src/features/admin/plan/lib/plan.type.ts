// Order = display order: the BE returns coverages[] sorted by this list
export const planCoverageCategories = [
  'MEDICAL_EXPENSES',
  'ACCIDENTAL_DEATH_DISABILITY',
  'EMERGENCY_EVACUATION',
  'REPATRIATION',
  'TRIP_CANCELLATION',
  'TRIP_CURTAILMENT',
  'FLIGHT_DELAY',
  'BAGGAGE_DELAY',
  'BAGGAGE_LOSS',
  'PERSONAL_LIABILITY',
] as const
export type PlanCoverageCategory = (typeof planCoverageCategories)[number]

/** Money fields are integer satang (THB × 100) */
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
  pricingType: 'PER_ORDER' | 'PER_TRAVELLER' | 'PER_TRAVELLER_PER_DAY'
  price: number
  coverageAmount: number | null
}

export interface Plan {
  id: string
  code: string
  type: 'SINGLE_TRIP'
  isActive: boolean
  sortOrder: number
  /** Ordered by minDays */
  tiers: PlanPriceTier[]
  coverages: PlanCoverage[]
  /** ISO 3166-1 alpha-2 codes, including deactivated countries */
  countries: string[]
  /** Including deactivated add-ons */
  addons: PlanAddon[]
  createdAt: string
  updatedAt: string
}

export interface ReorderPlansPayload {
  items: { id: string; sortOrder: number }[]
}

export interface PlanFilters {
  search: string
  status: 'all' | 'active' | 'inactive'
}
