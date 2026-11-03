import type { PlanCoverageCategory } from '@/shared/const'

export const planCoverageCategoryLabels: Record<PlanCoverageCategory, string> = {
  MEDICAL_EXPENSES: 'Medical expenses',
  ACCIDENTAL_DEATH_DISABILITY: 'Accidental death & disability',
  EMERGENCY_EVACUATION: 'Emergency evacuation',
  REPATRIATION: 'Repatriation',
  TRIP_CANCELLATION: 'Trip cancellation',
  TRIP_CURTAILMENT: 'Trip curtailment',
  FLIGHT_DELAY: 'Flight delay',
  BAGGAGE_DELAY: 'Baggage delay',
  BAGGAGE_LOSS: 'Baggage loss',
  PERSONAL_LIABILITY: 'Personal liability',
}

export type PlanAddonPricingType = 'PER_ORDER' | 'PER_TRAVELLER' | 'PER_TRAVELLER_PER_DAY'

export const planAddonPricingLabels: Record<PlanAddonPricingType, string> = {
  PER_ORDER: 'Per order',
  PER_TRAVELLER: 'Per traveller',
  PER_TRAVELLER_PER_DAY: 'Per traveller per day',
}

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
  pricingType: PlanAddonPricingType
  price: number
  coverageAmount: number | null
}

export interface Plan {
  id: string
  code: string
  type: 'SINGLE_TRIP'
  isActive: boolean
  isFeatured: boolean
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

export interface PlanCountryOption {
  id: string
  isoCode: string
  isActive: boolean
}

export interface PlanAddonOption {
  id: string
  code: string
  pricingType: PlanAddonPricingType
  price: number
  isActive: boolean
}

export interface CreatePlanPayload {
  code: string
  tiers: PlanPriceTier[]
  coverages: PlanCoverage[]
  countryIds: string[]
  addonIds: string[]
}

export interface UpdatePlanPayload {
  isActive?: boolean
  isFeatured?: boolean
  tiers?: PlanPriceTier[]
  coverages?: PlanCoverage[]
  countryIds?: string[]
  addonIds?: string[]
}

export interface ReorderPlansPayload {
  items: { id: string; sortOrder: number }[]
}

export interface PlanFilters {
  search: string
  status: 'all' | 'active' | 'inactive'
}
