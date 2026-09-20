import { ROLES } from '@/core/session'
import type { Role } from '@/core/session'

export interface DevSeedUser {
  email: string
  label: string
  role: Role
  isActive: boolean
}

export const DEV_SEED_PASSWORD = '!Qwer1234'

export const DEV_SEED_USERS: DevSeedUser[] = [
  {
    email: 'tripad@mailinator.com',
    label: 'Admin',
    role: ROLES.ADMIN,
    isActive: true,
  },
  {
    email: 'tripin@mailinator.com',
    label: 'Admin (inactive)',
    role: ROLES.ADMIN,
    isActive: false,
  },
  {
    email: 'tripsu@mailinator.com',
    label: 'Super Admin',
    role: ROLES.SUPER_ADMIN,
    isActive: true,
  },
]
