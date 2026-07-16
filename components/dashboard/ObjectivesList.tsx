import { Objective as ObjectiveType } from "@/modules/dashboard/domain/entities/dashboard.entity";
import { Badge } from "./Badge";

interface ObjectivesListProps {
  objectives: ObjectiveType[];
}

const statusStyles = {
  active: "success",
  completed: "default",
  delayed: "warning",
} as const;

export function ObjectivesList({ objectives }: ObjectivesListProps) {
  if (objectives.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Aucun objectif actif</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {objectives.map((objective) => (
        <div key={objective.id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
          <div className="flex items-start justify-between mb-2">
            <h4 className="font-medium text-gray-900">{objective.title}</h4>
            <Badge variant={statusStyles[objective.status]} size="sm">
              {objective.status === "active" ? "En cours" : objective.status === "completed" ? "Terminé" : "Retardé"}
            </Badge>
          </div>
          
          <p className="text-sm text-gray-600 mb-3">{objective.description}</p>
          
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-500">
              <span>Progression</span>
              <span>{objective.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className="bg-blue-600 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${objective.progress}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Échéance</span>
              <span>{new Date(objective.targetDate).toLocaleDateString('fr-FR')}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
