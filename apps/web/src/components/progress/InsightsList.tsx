import { AlertCircle, CheckCircle2, Info } from "lucide-react";
import { SkillInsight } from "@/lib/progress-service";

interface InsightsListProps {
  insights: SkillInsight[];
}

export function InsightsList({ insights }: InsightsListProps) {
  if (!insights || insights.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-3">
      <h3 className="mb-2 text-lg font-semibold text-gray-900">
        Coaching Automatique
      </h3>
      {insights.map((insight, idx) => {
        const isWeakness = insight.type === "weakness";
        const isStrength = insight.type === "strength";

        return (
          <div
            key={idx}
            className={`flex items-start gap-3 rounded-lg border p-4 ${
              isWeakness
                ? "border-rose-100 bg-rose-50/50"
                : isStrength
                  ? "border-emerald-100 bg-emerald-50/50"
                  : "border-blue-100 bg-blue-50/50"
            }`}
          >
            {isWeakness && (
              <AlertCircle className="mt-0.5 h-5 w-5 text-rose-600" />
            )}
            {isStrength && (
              <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600" />
            )}
            {!isWeakness && !isStrength && (
              <Info className="mt-0.5 h-5 w-5 text-blue-600" />
            )}

            <p
              className={`text-sm ${
                isWeakness
                  ? "text-rose-900"
                  : isStrength
                    ? "text-emerald-900"
                    : "text-blue-900"
              }`}
            >
              {insight.message}
            </p>
          </div>
        );
      })}
    </div>
  );
}
