import { ActivityEvent as ActivityEventType } from "@/modules/dashboard/domain/entities/dashboard.entity";

interface RecentActivityListProps {
  activities: ActivityEventType[];
}

const eventIcons = {
  analysis: "📊",
  objective_completed: "✅",
  action_completed: "🎯",
  profile_updated: "👤",
} as const;

const eventColors = {
  analysis: "bg-blue-100 text-blue-600",
  objective_completed: "bg-green-100 text-green-600",
  action_completed: "bg-purple-100 text-purple-600",
  profile_updated: "bg-gray-100 text-gray-600",
} as const;

export function RecentActivityList({ activities }: RecentActivityListProps) {
  if (activities.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Aucune activité récente</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start space-x-3">
          <div className={`flex-shrink-0 w-8 h-8 rounded-full ${eventColors[activity.type]} flex items-center justify-center`}>
            <span className="text-sm">{eventIcons[activity.type]}</span>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-gray-900 text-sm">{activity.title}</h4>
            <p className="text-xs text-gray-600 mb-1">{activity.description}</p>
            <p className="text-xs text-gray-500">
              {new Date(activity.timestamp).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
