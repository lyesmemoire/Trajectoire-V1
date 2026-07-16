import { PriorityAction as PriorityActionType } from "@/modules/dashboard/domain/entities/dashboard.entity";
import { Badge } from "./Badge";

interface PriorityActionsListProps {
  actions: PriorityActionType[];
}

const priorityStyles = {
  high: "error",
  medium: "warning",
  low: "info",
} as const;

const priorityLabels = {
  high: "Haute",
  medium: "Moyenne",
  low: "Faible",
} as const;

export function PriorityActionsList({ actions }: PriorityActionsListProps) {
  if (actions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Aucune action prioritaire</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {actions.map((action) => (
        <div key={action.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
          <div className="flex-shrink-0 mt-0.5">
            <div className={`w-2 h-2 rounded-full ${
              action.priority === "high" ? "bg-red-500" :
              action.priority === "medium" ? "bg-yellow-500" : "bg-blue-500"
            }`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-medium text-gray-900 text-sm">{action.title}</h4>
              <Badge variant={priorityStyles[action.priority]} size="sm">
                {priorityLabels[action.priority]}
              </Badge>
            </div>
            <p className="text-xs text-gray-600 mb-1">{action.description}</p>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{action.category}</span>
              <span>{new Date(action.dueDate).toLocaleDateString('fr-FR')}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
