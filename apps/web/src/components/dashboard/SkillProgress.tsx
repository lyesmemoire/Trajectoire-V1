"use client";

interface SkillProgressProps {
  skills: Record<string, {
    score: number;
    trend: "improving" | "stable" | "declining";
  }>;
}

export function SkillProgress({ skills }: SkillProgressProps) {
  const skillNames: Record<string, string> = {
    communication: "Communication",
    leadership: "Leadership",
    problem_solving: "Résolution de problèmes",
    teamwork: "Travail d'équipe",
    active_listening: "Écoute active",
    empathy: "Empathie",
    decision_making: "Prise de décision",
    delegation: "Délégation",
    critical_thinking: "Esprit critique",
    analytical_thinking: "Pensée analytique",
    collaboration: "Collaboration",
    conflict_resolution: "Résolution de conflits",
    adaptability: "Adaptabilité",
    time_management: "Gestion du temps",
    presentation: "Présentation",
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "improving":
        return "📈";
      case "declining":
        return "📉";
      default:
        return "➡️";
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "improving":
        return "text-green-600";
      case "declining":
        return "text-red-600";
      default:
        return "text-slate-500";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return "bg-green-500";
    if (score >= 0.6) return "bg-blue-500";
    if (score >= 0.4) return "bg-yellow-500";
    return "bg-red-500";
  };

  const sortedSkills = Object.entries(skills).sort((a, b) => b[1].score - a[1].score);

  return (
    <div className="bg-white p-6 rounded-lg border border-slate-200">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Progression des compétences</h3>
      <div className="space-y-4">
        {sortedSkills.map(([skillId, data]) => (
          <div key={skillId} className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="font-medium text-slate-900">
                  {skillNames[skillId] || skillId}
                </span>
                <span className={`text-sm ${getTrendColor(data.trend)}`}>
                  {getTrendIcon(data.trend)}
                </span>
              </div>
              <span className="text-sm font-medium text-slate-700">
                {(data.score * 100).toFixed(0)}%
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div
                className={`${getScoreColor(data.score)} h-2 rounded-full transition-all duration-300`}
                style={{ width: `${data.score * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
