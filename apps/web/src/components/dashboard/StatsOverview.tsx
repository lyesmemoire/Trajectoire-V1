"use client"

interface StatsOverviewProps {
  totalSimulations: number
  totalDuration: number
  averageScore: number
  bestScore: number
  currentStreak: number
  confidenceScore: number
}

export function StatsOverview({
  totalSimulations, totalDuration, averageScore, bestScore, currentStreak, confidenceScore, }: StatsOverviewProps) {
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)

    if (hours > 0) {
      return `${hours}h${minutes > 0 ? ` ${minutes}min` : ""}`
    }
    return `${minutes}min`
  }

  const getConfidenceLevel = (score: number) => {
    if (score >= 0.9) return { label: "Excellent", color: "text-calm-accent" }
    if (score >= 0.75) return { label: "Très bon", color: "text-calm-accent" }
    if (score >= 0.6) return { label: "Bon", color: "text-calm-warn" }
    if (score >= 0.4) return { label: "Moyen", color: "text-calm-warn" }
    return { label: "À améliorer", color: "text-calm-warn" }
  }

  const confidence = getConfidenceLevel(confidenceScore)

  const StatCard = ({ title, value, subtitle, valueColor = "text-calm-ink" }: { title: string; value: string; subtitle: string; valueColor?: string }) => (
    <div className="bg-calm-surface p-6 rounded-xl border border-calm-line">
      <p className="text-sm font-medium text-calm-secondary mb-1">{title}</p>
      <p className={`text-3xl font-bold ${valueColor}`}>{value}</p>
      <p className="text-xs text-calm-tertiary mt-1">{subtitle}</p>
    </div>
  )

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <StatCard
        title="Simulations"
        value={totalSimulations.toString()}
        subtitle="Total réalisées"
      />
      <StatCard
        title="Temps total"
        value={formatDuration(totalDuration)}
        subtitle="Pratique accumulée"
      />
      <StatCard
        title="Score moyen"
        value={`${averageScore.toFixed(0)}%`}
        subtitle="Performance globale"
      />
      <StatCard
        title="Meilleur score"
        value={`${bestScore.toFixed(0)}%`}
        subtitle="Record personnel"
        valueColor="text-calm-accent"
      />
      <StatCard
        title="Série actuelle"
        value={currentStreak.toString()}
        subtitle="Jours consécutifs"
      />
      <StatCard
        title="Confiance"
        value={`${(confidenceScore * 100).toFixed(0)}%`}
        subtitle={confidence.label}
        valueColor={confidence.color}
      />
    </div>
  )
}
