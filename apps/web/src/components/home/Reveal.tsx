"use client"

import type { ReactNode } from "react"
import { LazyMotion, domAnimation, m, useReducedMotion } from "framer-motion"

/**
 * Apparition douce au défilement (fondu + léger décalage). Jamais sur le héros. Rendu sans animation si
 * l'utilisateur demande un mouvement réduit.
 */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  const reduce = useReducedMotion()
  if (reduce) return <div className={className}>{children}</div>
  return (
    <LazyMotion features={domAnimation}>
      <m.div
        className={className}
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay }}
      >
        {children}
      </m.div>
    </LazyMotion>
  )
}
