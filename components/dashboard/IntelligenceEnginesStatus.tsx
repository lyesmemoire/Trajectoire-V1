import { IntelligenceEngine as IntelligenceEngineType } from "@/modules/dashboard/domain/entities/dashboard.entity";
import { Badge } from "./Badge";

interface IntelligenceEnginesStatusProps {
  engines: IntelligenceEngineType[];
}

const statusStyles = {
  active: "success",
  inactive: "warning",
  error: "error",
} as const;

const statusLabels = {
  active: "Actif",
  inactive: "Inactif",
  error: "Erreur",
} as const;

export function IntelligenceEnginesStatus({ engines }: IntelligenceEnginesStatusProps) {
  const activeCount = engines.filter(e => e.status === "active").length;
  const totalCount = engines.length;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Moteurs d'intelligence</h3>
        <Badge variant="info">
          {activeCount}/{totalCount} actifs
        </Badge>
      </div>

      <div className="space-y-3">
        {engines.map((engine) => (
          <div key={engine.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900 text-sm">{engine.name}</h4>
              {engine.lastProcessed && (
                <p className="text-xs text-gray-500">
                  Dernier traitement: {new Date(engine.lastProcessed).toLocaleDateString('fr-FR')}
                </p>
              )}
            </div>
            <Badge variant={statusStyles[engine.status]} size="sm">
              {statusLabels[engine.status]}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
}
