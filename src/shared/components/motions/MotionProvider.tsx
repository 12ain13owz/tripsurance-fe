'use client'

import { MotionConfig } from 'framer-motion'
import type { ReactNode } from 'react'

// reducedMotion="user": when the OS asks for less motion, framer-motion skips transform/layout
// animations (opacity fades still run), so every primitive below respects it without its own check
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>
}
