"use client";

interface Recommendation {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  category: string;
}

interface RecommendationsSectionProps {
  recommendations: Recommendation[];
}

export function RecommendationsSection({ recommendations }: RecommendationsSectionProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "low":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "high":
        return "Prioritaire";
      case "medium":
        return "Moyenne";
      case "low":
        return "Basse";
      default:
        return priority;
    }
  };

  if (recommendations.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Recommandations</h3>
        <p className="text-slate-600">Aucune recommandation pour le moment. Continuez à pratiquer!</p>
      </div>
    );
  }

  const sortedRecommendations = [...recommendations].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  return (
    <div className="bg-white p-6 rounded-lg border border-slate-200">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Recommandations</h3>
      <div className="space-y-3">
        {sortedRecommendations.map((rec) => (
          <div
            key={rec.id}
            className="border rounded-lg p-4 hover:bg-slate-50 transition-colors"
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <p className="font-medium text-slate-900">{rec.title}</p>
                <p className="text-xs text-slate-500 mt-1">{rec.category}</p>
              </div>
              <span
                className={`px-2 py-1 text-xs font-medium rounded border ${getPriorityColor(rec.priority)}`}
              >
                {getPriorityLabel(rec.priority)}
              </span>
            </div>
            <p className="text-sm text-slate-600">{rec.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
