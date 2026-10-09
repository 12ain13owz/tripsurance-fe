import { apiClient, ApiError } from '@/core/api'
import type { Country } from './country.type'

export async function getCountries(): Promise<Country[]> {
  const { data } = await apiClient.get<Country[]>('/admin/countries', { notifyError: false })
  return data ?? []
}

export async function updateCountryStatus(id: string, isActive: boolean): Promise<Country> {
  const { data } = await apiClient.patch<Country>(`/admin/countries/${id}`, { isActive })
  if (!data) {
    throw new ApiError('Unable to update country', 500)
  }
  return data
}
