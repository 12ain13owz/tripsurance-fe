export const addonPricingTypes = ['PER_ORDER', 'PER_TRAVELLER', 'PER_TRAVELLER_PER_DAY'] as const
export type AddonPricingType = (typeof addonPricingTypes)[number]

export const addonPricingTypeLabels: Record<AddonPricingType, string> = {
  PER_ORDER: 'Per order',
  PER_TRAVELLER: 'Per traveller',
  PER_TRAVELLER_PER_DAY: 'Per traveller per day',
}

/** Money fields are integer satang (THB × 100) */
export interface Addon {
  id: string
  code: string
  pricingType: AddonPricingType
  price: number
  coverageAmount: number | null
  isActive: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export interface CreateAddonPayload {
  code: string
  pricingType: AddonPricingType
  price: number
  coverageAmount: number | null
}

export interface UpdateAddonPayload {
  pricingType?: AddonPricingType
  price?: number
  coverageAmount?: number | null
  isActive?: boolean
}

export interface ReorderAddonsPayload {
  items: { id: string; sortOrder: number }[]
}

export interface AddonFilters {
  search: string
  status: 'all' | 'active' | 'inactive'
}
