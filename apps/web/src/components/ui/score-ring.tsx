"use client"

import { cn } from "@/lib/utils"

interface ScoreRingProps {
  score: number
  size?: number
  strokeWidth?: number
  label?: string
  showLabel?: boolean
  className?: string
}

export function ScoreRing({
  score,
  size = 120,
  strokeWidth = 10,
  label = "Score",
  showLabel = true,
  className,
}: ScoreRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const clampedScore = Math.min(100, Math.max(0, score))
  const offset = circumference - (clampedScore / 100) * circumference

  const getColor = (s: number) => {
    if (s >= 70)
      return { stroke: "#10B981", text: "text-emerald-600", badge: "Excellent" }
    if (s >= 50)
      return { stroke: "#F59E0B", text: "text-amber-600", badge: "Moyen" }
    return { stroke: "#EF4444", text: "text-rose-600", badge: "Faible" }
  }

  const colors = getColor(clampedScore)

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="-rotate-90 transform"
          aria-label={`${label} : ${clampedScore}/100`}
        >
          {/* Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#F1F5F9"
            strokeWidth={strokeWidth}
          />
          {/* Score arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={colors.stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("text-2xl font-bold tabular-nums", colors.text)}>
            {clampedScore}
          </span>
          <span className="text-[11px] font-medium text-foreground-muted">/ 100</span>
        </div>
      </div>

      {showLabel && (
        <div className="text-center">
          <p className="text-sm font-medium text-foreground-muted">{label}</p>
          <p className={cn("text-xs font-semibold", colors.text)}>
            {colors.badge}
          </p>
        </div>
      )}
    </div>
  )
}
