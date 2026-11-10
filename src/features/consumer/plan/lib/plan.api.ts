import { serverGet } from '@/core/api'
import type { PublicPlan } from './plan.type'

// Every SSR request reaches the BE from the FE server's one IP, so the BE's per-IP rate limit
// would be shared by all visitors: reuse the list for a minute instead of fetching per page view
const PLANS_REVALIDATE_SECONDS = 60

/** Server only (PlansView). Throws ApiError; the view renders the error in place */
export async function getPlans(): Promise<PublicPlan[]> {
  const data = await serverGet<PublicPlan[]>('/plans', { revalidate: PLANS_REVALIDATE_SECONDS })
  return data ?? []
}
