"use client"

interface Recommendation {
  id: string
  title: string
  description: string
  priority: "high" | "medium" | "low"
  category: string
}

interface RecommendationsSectionProps {
  recommendations: Recommendation[]
}

export function RecommendationsSection({ recommendations }: RecommendationsSectionProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-rose-500/10 text-rose-300 border-rose-400/20"
      case "medium":
        return "bg-amber-500/10 text-amber-300 border-amber-400/20"
      case "low":
        return "bg-indigo-500/10 text-indigo-300 border-indigo-400/20"
      default:
        return "bg-white/[0.04] text-white/70 border-white/[0.08]"
    }
  }

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "high":
        return "Prioritaire"
      case "medium":
        return "Moyenne"
      case "low":
        return "Basse"
      default:
        return priority
    }
  }

  if (recommendations.length === 0) {
    return (
      <div className="bg-zinc-900 p-6 rounded-lg border border-white/[0.08]">
        <h3 className="text-lg font-semibold text-white/80 mb-4">Recommandations</h3>
        <p className="text-white/50">Aucune recommandation pour le moment. Continuez à pratiquer!</p>
      </div>
    )
  }

  const sortedRecommendations = [...recommendations].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 }
    return priorityOrder[a.priority] - priorityOrder[b.priority]
  })

  return (
    <div className="bg-zinc-900 p-6 rounded-lg border border-white/[0.08]">
      <h3 className="text-lg font-semibold text-white/80 mb-4">Recommandations</h3>
      <div className="space-y-3">
        {sortedRecommendations.map((rec) => (
          <div
            key={rec.id}
            className="border border-white/[0.08] rounded-lg p-4 hover:bg-white/[0.03] transition-colors"
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <p className="font-medium text-white/80">{rec.title}</p>
                <p className="text-xs text-white/40 mt-1">{rec.category}</p>
              </div>
              <span
                className={`px-2 py-1 text-xs font-medium rounded border ${getPriorityColor(rec.priority)}`}
              >
                {getPriorityLabel(rec.priority)}
              </span>
            </div>
            <p className="text-sm text-white/50">{rec.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
