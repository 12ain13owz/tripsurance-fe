import {
  Ambulance,
  CalendarX,
  ClipboardList,
  Globe,
  HeartPulse,
  Luggage,
  MailCheck,
  MousePointerClick,
  PackagePlus,
  Plane,
  ReceiptText,
  ShieldAlert,
  Timer,
} from 'lucide-react'
import type { PlanCoverageCategory } from '@/shared/const'
import type { LucideIcon } from 'lucide-react'

export interface HomeItem<Key extends string = string> {
  key: Key
  icon: LucideIcon
}

/** Keys under HOME.WHY.ITEMS */
export const whyItems: HomeItem[] = [
  { key: 'DESTINATION', icon: Globe },
  { key: 'CLEAR_PRICE', icon: ReceiptText },
  { key: 'ONLINE', icon: Timer },
  { key: 'ADDONS', icon: PackagePlus },
]

// Six headline categories; labels come from PLANS.COVERAGE, descriptions from HOME.COVERAGE.ITEMS
export const coverageHighlights: HomeItem<PlanCoverageCategory>[] = [
  { key: 'MEDICAL_EXPENSES', icon: HeartPulse },
  { key: 'ACCIDENTAL_DEATH_DISABILITY', icon: ShieldAlert },
  { key: 'EMERGENCY_EVACUATION', icon: Ambulance },
  { key: 'TRIP_CANCELLATION', icon: CalendarX },
  { key: 'FLIGHT_DELAY', icon: Plane },
  { key: 'BAGGAGE_LOSS', icon: Luggage },
]

/** Keys under HOME.STEPS.ITEMS, in order */
/** Keys under HOME.STEPS.ITEMS, in order */
export const steps: HomeItem[] = [
  { key: 'DETAILS', icon: ClipboardList },
  { key: 'CHOOSE', icon: MousePointerClick },
  { key: 'POLICY', icon: MailCheck },
]

/** Keys under HOME.FAQ.ITEMS, in display order */
export const faqKeys = ['PRICE', 'PLANS', 'TRAVELLERS', 'MAX_DAYS', 'ADDONS'] as const
