"use client"

import { motion } from "framer-motion"

export function RadarChart({ data }: { data: number[] }) {
  const size = 240
  const center = size / 2
  const radius = 90
  const points = data.map((value, i) => {
    const angle = (i / data.length) * Math.PI * 2 - Math.PI / 2
    const r = (radius * value) / 100
    return [
      center + r * Math.cos(angle),
      center + r * Math.sin(angle),
    ]
  })

  const path = `M ${points[0].join(" ")} ` +
    points.slice(1).map(p => `L ${p.join(" ")}`).join(" ") +
    " Z"

  return (
    <svg width={size} height={size}>
      <motion.path
        d={path}
        fill="rgba(99,102,241,0.2)"
        stroke="#6366F1"
        strokeWidth="2"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1 }}
      />
    </svg>
  )
}
