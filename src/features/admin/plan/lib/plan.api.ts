import { apiClient, ApiError } from '@/core/api'
import type {
  CreatePlanPayload,
  Plan,
  PlanAddonOption,
  PlanCountryOption,
  ReorderPlansPayload,
  UpdatePlanPayload,
} from './plan.type'

export async function getPlans(): Promise<Plan[]> {
  const { data } = await apiClient.get<Plan[]>('/admin/plans', { notifyError: false })
  return data ?? []
}

export async function getPlanCountryOptions(): Promise<PlanCountryOption[]> {
  const { data } = await apiClient.get<PlanCountryOption[]>('/admin/countries', {
    notifyError: false,
  })
  return data ?? []
}

export async function getPlanAddonOptions(): Promise<PlanAddonOption[]> {
  const { data } = await apiClient.get<PlanAddonOption[]>('/admin/addons', { notifyError: false })
  return data ?? []
}

export async function createPlan(payload: CreatePlanPayload): Promise<Plan> {
  const { data } = await apiClient.post<Plan>('/admin/plans', payload, {
    notifyError: false,
    notifySuccess: true,
  })
  if (!data) {
    throw new ApiError('Unable to create plan', 500)
  }
  return data
}

export async function updatePlan(id: string, payload: UpdatePlanPayload): Promise<Plan> {
  const { data } = await apiClient.patch<Plan>(`/admin/plans/${id}`, payload, {
    notifyError: false,
    notifySuccess: true,
  })
  if (!data) {
    throw new ApiError('Unable to update plan', 500)
  }
  return data
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
