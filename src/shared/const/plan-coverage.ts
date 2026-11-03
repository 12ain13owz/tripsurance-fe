// Mirrors PLAN_COVERAGE_CATEGORIES in tripsurance-be (src/features/plan/plan.const.ts).
// Order = display order: the BE returns coverages[] sorted by this list
export const planCoverageCategories = [
  'MEDICAL_EXPENSES',
  'ACCIDENTAL_DEATH_DISABILITY',
  'EMERGENCY_EVACUATION',
  'REPATRIATION',
  'TRIP_CANCELLATION',
  'TRIP_CURTAILMENT',
  'FLIGHT_DELAY',
  'BAGGAGE_DELAY',
  'BAGGAGE_LOSS',
  'PERSONAL_LIABILITY',
] as const
export type PlanCoverageCategory = (typeof planCoverageCategories)[number]
