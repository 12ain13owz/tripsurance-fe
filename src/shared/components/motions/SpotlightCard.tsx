'use client'

import { motion } from 'framer-motion'
import { cn } from '@/shared/utils'
import type { HTMLMotionProps } from 'framer-motion'
import type { PointerEvent, ReactNode } from 'react'

// Tinted from the theme token, so it follows globals.css — no raw color
const SPOTLIGHT =
  'radial-gradient(420px circle at var(--spot-x, 50%) var(--spot-y, 0%), color-mix(in oklab, var(--color-primary) 7%, transparent), transparent 60%)'

type SpotlightCardProps = Omit<HTMLMotionProps<'article'>, 'children'> & {
  children?: ReactNode
}

// A card surface whose soft glow follows the pointer. It's a motion.article, so callers can pass
// layout / initial / exit (e.g. the plan grid animating a filter change).
export function SpotlightCard({
  className,
  children,
  onPointerMove,
  ...props
}: SpotlightCardProps) {
  // Writes CSS variables straight on the element: no React state, so moving the pointer
  // never re-renders the card
  function handlePointerMove(event: PointerEvent<HTMLElement>) {
    const rect = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty('--spot-x', `${event.clientX - rect.left}px`)
    event.currentTarget.style.setProperty('--spot-y', `${event.clientY - rect.top}px`)
    onPointerMove?.(event)
  }

  return (
    <motion.article
      {...props}
      className={cn('group/spotlight relative', className)}
      onPointerMove={handlePointerMove}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover/spotlight:opacity-100"
        style={{ background: SPOTLIGHT }}
      />
      {children}
    </motion.article>
  )
}
