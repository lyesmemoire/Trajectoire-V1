import { CareerCopilot as CareerCopilotType } from "@/modules/dashboard/domain/entities/dashboard.entity";
import { Badge } from "./Badge";
import { useRouter } from "next/navigation";

interface CareerCopilotCardProps {
  data: CareerCopilotType;
}

export function CareerCopilotCard({ data }: CareerCopilotCardProps) {
  const router = useRouter();

  const handleLaunchAnalysis = () => {
    router.push("/copilot");
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Career Copilot</h3>
        <Badge variant={data.available ? "success" : "warning"}>
          {data.available ? "Disponible" : "Indisponible"}
        </Badge>
      </div>

      {data.aiSummary ? (
        <div className="mb-4">
          <p className="text-gray-700 text-sm leading-relaxed">{data.aiSummary}</p>
          {data.lastAnalysis && (
            <p className="text-xs text-gray-500 mt-2">
              Dernière analyse: {new Date(data.lastAnalysis).toLocaleDateString('fr-FR')}
            </p>
          )}
        </div>
      ) : (
        <div className="mb-4 text-gray-500 text-sm italic">
          Aucune analyse disponible. Lancez une nouvelle analyse pour commencer.
        </div>
      )}

      <button
        onClick={handleLaunchAnalysis}
        disabled={!data.available}
        className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        Lancer une analyse
      </button>
    </div>
  );
}
