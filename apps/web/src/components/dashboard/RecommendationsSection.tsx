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
        return "bg-calm-warn-soft text-calm-warn border-calm-warn-line"
      case "medium":
        return "bg-calm-warn-soft text-calm-warn border-calm-warn-line"
      case "low":
        return "bg-calm-accent-soft text-calm-accent border-calm-accent-line"
      default:
        return "bg-calm-accent-wash text-calm-secondary border-calm-line"
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
      <div className="bg-calm-surface p-6 rounded-lg border border-calm-line">
        <h3 className="text-lg font-semibold text-calm-ink mb-4">Recommandations</h3>
        <p className="text-calm-secondary">Aucune recommandation pour le moment. Continuez à pratiquer!</p>
      </div>
    )
  }

  const sortedRecommendations = [...recommendations].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 }
    return priorityOrder[a.priority] - priorityOrder[b.priority]
  })

  return (
    <div className="bg-calm-surface p-6 rounded-lg border border-calm-line">
      <h3 className="text-lg font-semibold text-calm-ink mb-4">Recommandations</h3>
      <div className="space-y-3">
        {sortedRecommendations.map((rec) => (
          <div
            key={rec.id}
            className="border border-calm-line rounded-lg p-4 hover:bg-calm-accent-wash transition-colors"
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <p className="font-medium text-calm-ink">{rec.title}</p>
                <p className="text-xs text-calm-tertiary mt-1">{rec.category}</p>
              </div>
              <span
                className={`px-2 py-1 text-xs font-medium rounded border ${getPriorityColor(rec.priority)}`}
              >
                {getPriorityLabel(rec.priority)}
              </span>
            </div>
            <p className="text-sm text-calm-secondary">{rec.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
