import type { CountryRegion } from '@/shared/utils'

export interface Country {
  id: string
  isoCode: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CountryFilters {
  search: string
  region: CountryRegion | 'all'
  status: 'all' | 'active' | 'inactive'
}

export interface CountryRow extends Country {
  name: string
  region: CountryRegion | null
}
