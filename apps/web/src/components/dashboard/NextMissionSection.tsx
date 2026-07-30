"use client"

interface NextMissionSectionProps {
  mission: {
    title: string
    description: string
    type: string
    estimatedTime: string
    difficulty: "beginner" | "intermediate" | "advanced"
  } | null
}

export function NextMissionSection({ mission }: NextMissionSectionProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-forest-100 text-forest-700"
      case "intermediate":
        return "bg-terracotta-100 text-terracotta-700"
      case "advanced":
        return "bg-brick-100 text-brick-700"
      default:
        return "bg-ivoire-100 text-ink-700"
    }
  }

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "Débutant"
      case "intermediate":
        return "Intermédiaire"
      case "advanced":
        return "Avancé"
      default:
        return difficulty
    }
  }

  if (!mission) {
    return (
      <div className="bg-gradient-to-br from-bronze-50 to-ink-50 p-6 rounded-lg border border-bronze-100">
        <h3 className="text-lg font-semibold text-ink-900 mb-2">Prochaine mission</h3>
        <p className="text-ink-600">Commencez une simulation pour débloquer votre prochaine mission personnalisée.</p>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-bronze-50 to-ink-50 p-6 rounded-lg border border-bronze-100">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-ink-900 mb-1">Prochaine mission</h3>
          <p className="text-sm text-ink-600">{mission.type}</p>
        </div>
        <span
          className={`px-3 py-1 text-xs font-medium rounded ${getDifficultyColor(mission.difficulty)}`}
        >
          {getDifficultyLabel(mission.difficulty)}
        </span>
      </div>

      <div className="mb-4">
        <p className="font-medium text-ink-900 mb-1">{mission.title}</p>
        <p className="text-sm text-ink-600">{mission.description}</p>
      </div>

      <div className="flex items-center gap-4 text-sm text-ink-600">
        <div className="flex items-center gap-1">
          <span>⏱️</span>
          <span>{mission.estimatedTime}</span>
        </div>
      </div>
    </div>
  )
}
