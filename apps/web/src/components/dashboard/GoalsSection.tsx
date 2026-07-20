"use client";

interface Goal {
  id: string;
  title: string;
  progress: number;
  target: number;
  current: number;
  unit: string;
  type: "daily" | "weekly" | "milestone";
}

interface GoalsSectionProps {
  goals: Goal[];
}

export function GoalsSection({ goals }: GoalsSectionProps) {
  const getGoalTypeLabel = (type: string) => {
    switch (type) {
      case "daily":
        return "Quotidien";
      case "weekly":
        return "Hebdomadaire";
      case "milestone":
        return "Jalon";
      default:
        return type;
    }
  };

  const getGoalTypeColor = (type: string) => {
    switch (type) {
      case "daily":
        return "bg-blue-100 text-blue-700";
      case "weekly":
        return "bg-purple-100 text-purple-700";
      case "milestone":
        return "bg-green-100 text-green-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 1) return "bg-green-500";
    if (progress >= 0.7) return "bg-blue-500";
    if (progress >= 0.4) return "bg-yellow-500";
    return "bg-red-500";
  };

  if (goals.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Objectifs</h3>
        <p className="text-slate-600">Aucun objectif actif. Commencez une simulation pour générer des objectifs personnalisés.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg border border-slate-200">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Objectifs</h3>
      <div className="space-y-4">
        {goals.map((goal) => (
          <div key={goal.id} className="space-y-2">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-slate-900">{goal.title}</span>
                  <span className={`px-2 py-0.5 text-xs font-medium rounded ${getGoalTypeColor(goal.type)}`}>
                    {getGoalTypeLabel(goal.type)}
                  </span>
                </div>
                <p className="text-sm text-slate-600">
                  {goal.current} / {goal.target} {goal.unit}
                </p>
              </div>
              <span className="text-sm font-medium text-slate-700">
                {(goal.progress * 100).toFixed(0)}%
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div
                className={`${getProgressColor(goal.progress)} h-2 rounded-full transition-all duration-300`}
                style={{ width: `${Math.min(goal.progress * 100, 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
