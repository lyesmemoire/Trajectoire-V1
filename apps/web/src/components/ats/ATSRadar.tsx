// apps/web/src/components/ats/ATSRadar.tsx
//
// Graphique radar pour les dimensions du CV
// MVP-008 — ATS Experience

'use client'

import { motion } from 'framer-motion'
import { RadarDimensions } from '@/types/ats'

interface ATSRadarProps {
  dimensions: RadarDimensions
  size?: number
}

export function ATSRadar({ dimensions, size = 300 }: ATSRadarProps) {
  const center = size / 2
  const radius = size / 2 - 40

  const labels = ['Structure', 'Mots-clés', 'Impact', 'Clarté', 'Pertinence']
  const values = [
    dimensions.structure,
    dimensions.keywords,
    dimensions.impact,
    dimensions.clarity,
    dimensions.relevance,
  ]

  // Calculate polygon points
  const getPolygonPoints = (values: number[], scale: number = 1) => {
    const angleStep = (Math.PI * 2) / values.length
    return values.map((value, i) => {
      const angle = i * angleStep - Math.PI / 2
      const r = (value / 100) * radius * scale
      const x = center + r * Math.cos(angle)
      const y = center + r * Math.sin(angle)
      return { x, y }
    })
  }

  const dataPoints = getPolygonPoints(values)
  const maxPoints = getPolygonPoints([100, 100, 100, 100, 100])

  // Generate grid circles
  const gridCircles = [0.2, 0.4, 0.6, 0.8, 1].map((scale) => {
    const points = getPolygonPoints([100, 100, 100, 100, 100], scale)
    const polygonPoints = points.map(p => `${p.x},${p.y}`).join(' ')
    return { scale, polygonPoints }
  })

  // Generate axis lines
  const axisLines = values.map((_, i) => {
    const angle = i * ((Math.PI * 2) / values.length) - Math.PI / 2
    const x = center + radius * Math.cos(angle)
    const y = center + radius * Math.sin(angle)
    return { x1: center, y1: center, x2: x, y2: y }
  })

  // Generate label positions
  const labelPositions = values.map((_, i) => {
    const angle = i * ((Math.PI * 2) / values.length) - Math.PI / 2
    const labelRadius = radius + 25
    const x = center + labelRadius * Math.cos(angle)
    const y = center + labelRadius * Math.sin(angle)
    return { x, y, label: labels[i] }
  })

  const polygonPoints = dataPoints.map(p => `${p.x},${p.y}`).join(' ')

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Grid circles */}
        {gridCircles.map(({ scale, polygonPoints }, i) => (
          <polygon
            key={i}
            points={polygonPoints}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="1"
          />
        ))}

        {/* Axis lines */}
        {axisLines.map((line, i) => (
          <line
            key={i}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="#e5e7eb"
            strokeWidth="1"
          />
        ))}

        {/* Data polygon */}
        <motion.polygon
          points={polygonPoints}
          fill="rgba(180, 83, 9, 0.2)"
          stroke="#b45309"
          strokeWidth="2"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          style={{ transformOrigin: `${center}px ${center}px` }}
        />

        {/* Data points */}
        {dataPoints.map((point, i) => (
          <motion.circle
            key={i}
            cx={point.x}
            cy={point.y}
            r="4"
            fill="#b45309"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
          />
        ))}

        {/* Labels */}
        {labelPositions.map((pos, i) => (
          <text
            key={i}
            x={pos.x}
            y={pos.y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-xs font-medium fill-ink-700"
            fontSize="11"
          >
            {pos.label}
          </text>
        ))}
      </svg>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap justify-center gap-4">
        {labels.map((label, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-bronze-600" />
            <span className="text-xs text-ink-600">{label}: {values[i]}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}
