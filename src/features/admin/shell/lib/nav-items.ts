import { Funnel, Globe, LayoutDashboard, Route, ShieldCheck } from 'lucide-react'
import { adminRoutes } from '@/shared/routes'
import type { LucideIcon } from 'lucide-react'

export interface AdminNavItem {
  href: string
  label: string
  subtitle: string
  icon: LucideIcon
}

export const adminNavItems: AdminNavItem[] = [
  {
    href: adminRoutes.overview,
    label: 'Overview',
    subtitle: 'Premium revenue summary and monthly trend',
    icon: LayoutDashboard,
  },
  {
    href: adminRoutes.plans,
    label: 'Plans',
    subtitle: 'Sales broken down by coverage tier',
    icon: ShieldCheck,
  },
  {
    href: adminRoutes.countries,
    label: 'Countries',
    subtitle: 'Policies sold by destination country',
    icon: Globe,
  },
  {
    href: adminRoutes.funnel,
    label: 'Purchase funnel',
    subtitle: 'From quote request to completed purchase',
    icon: Funnel,
  },
  {
    href: adminRoutes.routes,
    label: 'Top routes',
    subtitle: 'Claim rate against average premium per policy',
    icon: Route,
  },
]
