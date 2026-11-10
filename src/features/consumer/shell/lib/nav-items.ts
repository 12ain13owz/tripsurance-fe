import { consumerRoutes } from '@/shared/routes'

export interface ConsumerNavItem {
  href: string
  labelKey: 'HOME' | 'PLANS'
}

export const consumerNavItems: ConsumerNavItem[] = [
  { href: consumerRoutes.home, labelKey: 'HOME' },
  { href: consumerRoutes.plans, labelKey: 'PLANS' },
]
