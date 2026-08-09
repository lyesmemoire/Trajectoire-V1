// apps/web/src/components/ats/ATSScoreCircle.tsx
//
// Composant de score circulaire animé
// MVP-008 — ATS Experience

'use client'

import { motion } from 'framer-motion'

interface ATSScoreCircleProps {
  score: number
  size?: number
  strokeWidth?: number
}

export function ATSScoreCircle({ score, size = 120, strokeWidth = 8 }: ATSScoreCircleProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDashoffset = circumference - (score / 100) * circumference

  const getColor = (score: number) => {
    if (score >= 80) return '#16a34a' // forest-600
    if (score >= 60) return '#b45309' // bronze-600
    if (score >= 40) return '#d97706' // amber-600
    return '#dc2626' // brick-600
  }

  const getBgColor = (score: number) => {
    if (score >= 80) return '#dcfce7' // forest-100
    if (score >= 60) return '#fef3c7' // bronze-100
    if (score >= 40) return '#fef3c7' // amber-100
    return '#fee2e2' // brick-100
  }

  const color = getColor(score)
  const bgColor = getBgColor(score)

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={bgColor}
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          style={{
            strokeDasharray: circumference,
          }}
        />
      </svg>

      {/* Score text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center"
        >
          <span className="text-3xl font-bold" style={{ color }}>
            {score}
          </span>
          <span className="text-xs text-ink-500 block">/100</span>
        </motion.div>
      </div>
    </div>
  )
}
