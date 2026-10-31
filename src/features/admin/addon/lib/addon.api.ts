import { apiClient, ApiError } from '@/core/api'
import type {
  Addon,
  CreateAddonPayload,
  ReorderAddonsPayload,
  UpdateAddonPayload,
} from './addon.type'

export async function getAddons(): Promise<Addon[]> {
  const { data } = await apiClient.get<Addon[]>('/admin/addons', { notifyError: false })
  return data ?? []
}

export async function createAddon(payload: CreateAddonPayload): Promise<Addon> {
  const { data } = await apiClient.post<Addon>('/admin/addons', payload, {
    notifyError: false,
    notifySuccess: true,
  })
  if (!data) {
    throw new ApiError('Unable to create add-on', 500)
  }
  return data
}

export async function updateAddon(id: string, payload: UpdateAddonPayload): Promise<Addon> {
  const { data } = await apiClient.patch<Addon>(`/admin/addons/${id}`, payload, {
    notifyError: false,
    notifySuccess: true,
  })
  if (!data) {
    throw new ApiError('Unable to update add-on', 500)
  }
  return data
}

export async function updateAddonStatus(id: string, isActive: boolean): Promise<Addon> {
  const { data } = await apiClient.patch<Addon>(`/admin/addons/${id}`, { isActive })
  if (!data) {
    throw new ApiError('Unable to update add-on', 500)
  }
  return data
}

export async function reorderAddons(payload: ReorderAddonsPayload): Promise<Addon[]> {
  const { data } = await apiClient.patch<Addon[]>('/admin/addons/reorder', payload)
  if (!data) {
    throw new ApiError('Unable to reorder add-ons', 500)
  }
  return data
}
