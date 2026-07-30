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
        return "bg-brick-100 text-brick-700 border-brick-200"
      case "medium":
        return "bg-terracotta-100 text-terracotta-700 border-terracotta-200"
      case "low":
        return "bg-bronze-100 text-bronze-700 border-bronze-200"
      default:
        return "bg-ivoire-100 text-ink-700 border-ivoire-200"
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
      <div className="bg-white/70 backdrop-blur-xl p-6 rounded-lg border border-ivoire-200">
        <h3 className="text-lg font-semibold text-ink-900 mb-4">Recommandations</h3>
        <p className="text-ink-600">Aucune recommandation pour le moment. Continuez à pratiquer!</p>
      </div>
    )
  }

  const sortedRecommendations = [...recommendations].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 }
    return priorityOrder[a.priority] - priorityOrder[b.priority]
  })

  return (
    <div className="bg-white/70 backdrop-blur-xl p-6 rounded-lg border border-ivoire-200">
      <h3 className="text-lg font-semibold text-ink-900 mb-4">Recommandations</h3>
      <div className="space-y-3">
        {sortedRecommendations.map((rec) => (
          <div
            key={rec.id}
            className="border rounded-lg p-4 hover:bg-ivoire-50 transition-colors"
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <p className="font-medium text-ink-900">{rec.title}</p>
                <p className="text-xs text-ink-500 mt-1">{rec.category}</p>
              </div>
              <span
                className={`px-2 py-1 text-xs font-medium rounded border ${getPriorityColor(rec.priority)}`}
              >
                {getPriorityLabel(rec.priority)}
              </span>
            </div>
            <p className="text-sm text-ink-600">{rec.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
