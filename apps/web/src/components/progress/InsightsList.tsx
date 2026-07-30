import { AlertCircle, CheckCircle2, Info } from "lucide-react"
import { SkillInsight } from "@/lib/progress-service"

interface InsightsListProps {
  insights: SkillInsight[]
}

export function InsightsList({ insights }: InsightsListProps) {
  if (!insights || insights.length === 0) {
    return null
  }

  return (
    <div className="flex flex-col gap-3">
      <h3 className="mb-2 text-lg font-semibold text-gray-900">
        Coaching Automatique
      </h3>
      {insights.map((insight, idx) => {
        const isWeakness = insight.type === "weakness"
        const isStrength = insight.type === "strength"

        return (
          <div
            key={idx}
            className={`flex items-start gap-3 rounded-lg border p-4 ${
              isWeakness
                ? "border-brick-100 bg-brick-50/50"
                : isStrength
                  ? "border-forest-100 bg-forest-50/50"
                  : "border-ivoire-200 bg-ivoire-50/50"
            }`}
          >
            {isWeakness && (
              <AlertCircle className="mt-0.5 h-5 w-5 text-brick-600" />
            )}
            {isStrength && (
              <CheckCircle2 className="mt-0.5 h-5 w-5 text-forest-600" />
            )}
            {!isWeakness && !isStrength && (
              <Info className="mt-0.5 h-5 w-5 text-ink-600" />
            )}

            <p
              className={`text-sm ${
                isWeakness
                  ? "text-brick-900"
                  : isStrength
                    ? "text-forest-900"
                    : "text-ink-900"
              }`}
            >
              {insight.message}
            </p>
          </div>
        )
      })}
    </div>
  )
}
