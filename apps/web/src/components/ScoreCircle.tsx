"use client"

import { motion } from "framer-motion"

export function ScoreCircle({ value }: { value: number }) {
  const radius = 90
  const circumference = 2 * Math.PI * radius

  return (
    <svg width="220" height="220">
      <circle
        cx="110"
        cy="110"
        r={radius}
        stroke="rgba(0,0,0,0.03)"
        strokeWidth="8"
        fill="none"
      />
      <motion.circle
        cx="110"
        cy="110"
        r={radius}
        stroke="#B8860B"
        strokeWidth="8"
        fill="none"
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{
          strokeDashoffset: circumference - (circumference * value) / 100,
        }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        style={{ filter: "drop-shadow(0 0 8px rgba(184,134,11,0.5))" }}
      />
    </svg>
  )
}
