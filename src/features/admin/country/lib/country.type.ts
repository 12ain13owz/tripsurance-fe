export interface Country {
  id: string
  isoCode: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export const countryRegions = [
  'Africa',
  'Americas',
  'Antarctica',
  'Asia',
  'Europe',
  'Oceania',
] as const
export type CountryRegion = (typeof countryRegions)[number]

export interface CountryFilters {
  search: string
  region: CountryRegion | 'all'
  status: 'all' | 'active' | 'inactive'
}

export interface CountryRow extends Country {
  name: string
  region: CountryRegion | null
}
