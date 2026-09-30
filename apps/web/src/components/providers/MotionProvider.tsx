"use client"

import type { ReactNode } from "react"
import { MotionConfig } from "framer-motion"

/**
 * Respecte `prefers-reduced-motion` pour toutes les animations framer-motion du site
 * (les transformations sont désactivées, les fondus conservés).
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>
}
