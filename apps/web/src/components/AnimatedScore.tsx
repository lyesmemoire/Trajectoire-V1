"use client"

import { motion, useMotionValue, useTransform, animate } from "framer-motion"
import { useEffect } from "react"

export function AnimatedScore({ value }: { value: number }) {
  const count = useMotionValue(0)
  const rounded = useTransform(count, (v) => Math.round(v))

  useEffect(() => {
    const controls = animate(count, value, {
      duration: 0.8,
      ease: "easeOut",
    })
    return controls.stop
  }, [value, count])

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="text-7xl font-display font-semibold text-white"
    >
      <motion.span>{rounded}</motion.span>
      <span className="text-text-secondary text-2xl ml-2">/100</span>
    </motion.div>
  )
}
