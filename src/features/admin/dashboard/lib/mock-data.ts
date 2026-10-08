// Sample data only — no Order/Policy aggregation API exists yet (roadmap: Plan -> Order -> Payment -> Policy).
// Swap these constants for a real query once that endpoint lands; keep the shapes stable so the
// dashboard components below don't need to change.

export type Period = 'month' | 'quarter' | 'ytd'

export const periodOptions: { value: Period; label: string }[] = [
  { value: 'month', label: 'This month' },
  { value: 'quarter', label: 'This quarter' },
  { value: 'ytd', label: 'Year to date' },
]

export interface KpiSnapshot {
  label: string
  revenue: number
  revenueDelta: number
  policies: number
  policiesDelta: number
  avgPremium: number
  avgPremiumDelta: number
  claimRate: number
  claimRateDelta: number
  conversionRate: number
  conversionRateDelta: number
}

export const kpiByPeriod: Record<Period, KpiSnapshot> = {
  month: {
    label: 'Sep 2026',
    revenue: 2847500,
    revenueDelta: 8.4,
    policies: 3412,
    policiesDelta: 6.1,
    avgPremium: 834,
    avgPremiumDelta: 2.1,
    claimRate: 12.4,
    claimRateDelta: -0.8,
    conversionRate: 34.6,
    conversionRateDelta: 1.2,
  },
  quarter: {
    label: 'Q3 2026',
    revenue: 8967000,
    revenueDelta: 11.2,
    policies: 10245,
    policiesDelta: 9.8,
    avgPremium: 875,
    avgPremiumDelta: 1.3,
    claimRate: 11.8,
    claimRateDelta: -1.1,
    conversionRate: 33.9,
    conversionRateDelta: 0.6,
  },
  ytd: {
    label: 'Since Jan 2026',
    revenue: 26380000,
    revenueDelta: 15.6,
    policies: 30120,
    policiesDelta: 13.2,
    avgPremium: 876,
    avgPremiumDelta: 2.1,
    claimRate: 12.9,
    claimRateDelta: 0.3,
    conversionRate: 32.8,
    conversionRateDelta: -0.4,
  },
}

export interface MonthlyRevenuePoint {
  month: string
  value: number
}

// THB, thousands.
export const monthlyRevenue: MonthlyRevenuePoint[] = [
  { month: 'Oct', value: 2180 },
  { month: 'Nov', value: 2340 },
  { month: 'Dec', value: 3120 },
  { month: 'Jan', value: 3450 },
  { month: 'Feb', value: 2890 },
  { month: 'Mar', value: 2650 },
  { month: 'Apr', value: 3780 },
  { month: 'May', value: 2420 },
  { month: 'Jun', value: 2510 },
  { month: 'Jul', value: 2980 },
  { month: 'Aug', value: 3140 },
  { month: 'Sep', value: 2847 },
]

export interface PlanTierSummary {
  name: string
  policies: number
  revenue: number
  avgPremium: number
}

export const planTiers: PlanTierSummary[] = [
  { name: 'Basic', policies: 1890, revenue: 1020600, avgPremium: 540 },
  { name: 'Standard', policies: 1205, revenue: 1204995, avgPremium: 1000 },
  { name: 'Premium Worldwide', policies: 317, revenue: 621905, avgPremium: 1962 },
]

export interface CountrySummary {
  isoCode: string
  policies: number
}

// isoCode only — country names are derived via Intl.DisplayNames (getCountryName), never stored as strings.
export const topCountries: CountrySummary[] = [
  { isoCode: 'JP', policies: 640 },
  { isoCode: 'KR', policies: 380 },
  { isoCode: 'FR', policies: 260 },
  { isoCode: 'CN', policies: 320 },
  { isoCode: 'US', policies: 210 },
  { isoCode: 'VN', policies: 290 },
]

export interface FunnelStage {
  stage: string
  value: number
}

export const funnelStages: FunnelStage[] = [
  { stage: 'Quote requested', value: 9850 },
  { stage: 'Plans compared', value: 6320 },
  { stage: 'Payment started', value: 4180 },
  { stage: 'Purchase completed', value: 3412 },
]

export interface RouteSummary {
  isoCode: string
  policies: number
  avgPremium: number
  claimRate: number
}

export const topRoutes: RouteSummary[] = [
  { isoCode: 'JP', policies: 640, avgPremium: 1150, claimRate: 8.2 },
  { isoCode: 'KR', policies: 380, avgPremium: 980, claimRate: 6.5 },
  { isoCode: 'FR', policies: 480, avgPremium: 2340, claimRate: 14.1 },
  { isoCode: 'CN', policies: 320, avgPremium: 720, claimRate: 5.8 },
  { isoCode: 'US', policies: 210, avgPremium: 2890, claimRate: 11.3 },
  { isoCode: 'VN', policies: 290, avgPremium: 480, claimRate: 4.2 },
  { isoCode: 'AU', policies: 150, avgPremium: 1780, claimRate: 9.6 },
]
