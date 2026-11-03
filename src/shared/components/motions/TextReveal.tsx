'use client'

import { motion } from 'framer-motion'
import { useMemo, useSyncExternalStore } from 'react'
import { EASE_OUT } from './easing'

const noopSubscribe = () => () => {}

const wordVariants = {
  hidden: { opacity: 0, y: 8, filter: 'blur(8px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.7, ease: EASE_OUT } },
}

interface TextRevealProps {
  text: string
  /** Picks the word breaker — Thai has no spaces, so splitting needs the locale's dictionary */
  locale: string
  as?: 'h1' | 'h2' | 'p'
  className?: string
}

// Reveals a heading word by word. Splits with Intl.Segmenter so Thai vowels and tone marks stay
// on their consonant (splitting by character would tear them apart).
export function TextReveal({ text, locale, as = 'h1', className }: TextRevealProps) {
  // Node and the browser ship different ICU word dictionaries, so the server renders the text
  // whole and the client splits it right after hydration — the markup never mismatches
  const isClient = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false
  )
  const words = useMemo(
    () =>
      isClient
        ? Array.from(
            new Intl.Segmenter(locale, { granularity: 'word' }).segment(text),
            (s) => s.segment
          )
        : [text],
    [isClient, locale, text]
  )
  const Tag = motion[as]

  return (
    <Tag
      className={className}
      aria-label={text}
      initial="hidden"
      animate="visible"
      transition={{ staggerChildren: 0.06 }}
    >
      {words.map((word, index) => (
        // whitespace-pre keeps the width of space segments inside inline-block spans
        <motion.span
          key={index}
          aria-hidden="true"
          className="inline-block whitespace-pre"
          variants={wordVariants}
        >
          {word}
        </motion.span>
      ))}
    </Tag>
  )
}
