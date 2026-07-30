"use client"

interface ScoreRingProps {
  score: number
  size?: number
  strokeWidth?: number
  label?: string
  showLabel?: boolean
}

export function ScoreRing({
  score, size = 120, strokeWidth = 10, label = "Score", showLabel = true }: ScoreRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const clampedScore = Math.min(100, Math.max(0, score))
  const offset = circumference - (clampedScore / 100) * circumference

  const getColor = (s: number) => {
    if (s >= 70)
      return {
        stroke: "#2F6844",
        text: "text-forest-600",
        label: "Excellent",
      }
    if (s >= 50)
      return { stroke: "#B7472A", text: "text-terracotta-600", label: "Moyen" }
    return { stroke: "#9B2C2C", text: "text-brick-600", label: "Faible" }
  }

  const colors = getColor(clampedScore)

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="-rotate-90 transform"
          aria-label={`${label}: ${clampedScore}%`}
        >
          {/* Track de fond */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#E7E2DB"
            strokeWidth={strokeWidth}
          />
          {/* Arc de score avec animation */}
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
        {/* Score centré */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-2xl font-bold ${colors.text}`}>
            {clampedScore}
          </span>
          <span className="text-xs text-ink-400">/ 100</span>
        </div>
      </div>
      {showLabel && (
        <div className="text-center">
          <p className="text-sm font-medium text-ink-600">{label}</p>
          <p className={`text-xs font-semibold ${colors.text}`}>
            {colors.label}
          </p>
        </div>
      )}
    </div>
  )
}
