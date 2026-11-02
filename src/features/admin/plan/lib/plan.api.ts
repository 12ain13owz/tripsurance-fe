import { apiClient, ApiError } from '@/core/api'
import type { Plan, ReorderPlansPayload } from './plan.type'

export async function getPlans(): Promise<Plan[]> {
  const { data } = await apiClient.get<Plan[]>('/admin/plans', { notifyError: false })
  return data ?? []
}

export async function updatePlanStatus(id: string, isActive: boolean): Promise<Plan> {
  const { data } = await apiClient.patch<Plan>(`/admin/plans/${id}`, { isActive })
  if (!data) {
    throw new ApiError('Unable to update plan', 500)
  }
  return data
}

export async function reorderPlans(payload: ReorderPlansPayload): Promise<Plan[]> {
  const { data } = await apiClient.patch<Plan[]>('/admin/plans/reorder', payload)
  if (!data) {
    throw new ApiError('Unable to reorder plans', 500)
  }
  return data
}
