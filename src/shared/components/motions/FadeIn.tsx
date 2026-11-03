'use client'

import { motion } from 'framer-motion'
import { EASE_OUT } from './easing'
import type { ReactNode } from 'react'

interface FadeInProps {
  children: ReactNode
  className?: string
  /** Seconds, for hand-staggering sibling blocks */
  delay?: number
  /** Pixels it rises from */
  y?: number
}

// Fades a block up the first time it scrolls into view; never replays on scroll back
export function FadeIn({ children, className, delay = 0, y = 16 }: FadeInProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.6, ease: EASE_OUT, delay }}
    >
      {children}
    </motion.div>
  )
}
