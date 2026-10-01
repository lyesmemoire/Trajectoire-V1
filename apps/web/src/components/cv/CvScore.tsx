/** Éléments d'affichage du score ATS, thème sombre (zinc-950 / indigo). Server Components. */

export function scoreTone(score: number) {
  if (score >= 70) return { label: "Solide", text: "text-calm-accent", badge: "bg-calm-accent-soft text-calm-accent ring-calm-accent-line", stroke: "#34d399" }
  if (score >= 50) return { label: "À renforcer", text: "text-calm-warn", badge: "bg-calm-warn-soft text-calm-warn ring-calm-warn-line", stroke: "#fbbf24" }
  return { label: "Insuffisant", text: "text-calm-warn", badge: "bg-calm-warn-soft text-calm-warn ring-calm-warn-line", stroke: "#fb7185" }
}

export function ScoreBadge({ score }: { score: number }) {
  const tone = scoreTone(score)
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${tone.badge}`}>
      <span className="font-semibold tabular-nums">{score}</span>
      <span aria-hidden>/100</span>
      <span className="sr-only">— {tone.label}</span>
    </span>
  )
}

export function ScoreRingDark({ score, size = 148, strokeWidth = 12 }: { score: number; size?: number; strokeWidth?: number }) {
  const value = Math.min(100, Math.max(0, score))
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const tone = scoreTone(value)

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" role="img" aria-label={`Score ATS : ${value} sur 100`}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(241,247,243,0.08)" strokeWidth={strokeWidth} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={tone.stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - (value / 100) * circumference}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-4xl font-semibold tabular-nums ${tone.text}`}>{value}</span>
        <span className="text-xs text-calm-secondary">sur 100</span>
      </div>
    </div>
  )
}
