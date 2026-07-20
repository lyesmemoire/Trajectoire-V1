"use client";

interface NextMissionSectionProps {
  mission: {
    title: string;
    description: string;
    type: string;
    estimatedTime: string;
    difficulty: "beginner" | "intermediate" | "advanced";
  } | null;
}

export function NextMissionSection({ mission }: NextMissionSectionProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-700";
      case "intermediate":
        return "bg-yellow-100 text-yellow-700";
      case "advanced":
        return "bg-red-100 text-red-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "Débutant";
      case "intermediate":
        return "Intermédiaire";
      case "advanced":
        return "Avancé";
      default:
        return difficulty;
    }
  };

  if (!mission) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-100">
        <h3 className="text-lg font-semibold text-slate-900 mb-2">Prochaine mission</h3>
        <p className="text-slate-600">Commencez une simulation pour débloquer votre prochaine mission personnalisée.</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-100">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-1">Prochaine mission</h3>
          <p className="text-sm text-slate-600">{mission.type}</p>
        </div>
        <span
          className={`px-3 py-1 text-xs font-medium rounded ${getDifficultyColor(mission.difficulty)}`}
        >
          {getDifficultyLabel(mission.difficulty)}
        </span>
      </div>

      <div className="mb-4">
        <p className="font-medium text-slate-900 mb-1">{mission.title}</p>
        <p className="text-sm text-slate-600">{mission.description}</p>
      </div>

      <div className="flex items-center gap-4 text-sm text-slate-600">
        <div className="flex items-center gap-1">
          <span>⏱️</span>
          <span>{mission.estimatedTime}</span>
        </div>
      </div>
    </div>
  );
}
