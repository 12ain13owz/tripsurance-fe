import { apiClient, ApiError } from '@/core/api'

export interface Country {
  id: string
  isoCode: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export async function getCountries(): Promise<Country[]> {
  const { data } = await apiClient.get<Country[]>('/countries')
  return data ?? []
}

export async function updateCountryStatus(
  id: string,
  isActive: boolean,
  accessToken: string
): Promise<Country> {
  const { data } = await apiClient.patch<Country>(`/countries/${id}`, { isActive }, accessToken)
  if (!data) {
    throw new ApiError('Unable to update country', 500)
  }
  return data
}
