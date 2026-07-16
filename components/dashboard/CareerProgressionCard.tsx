import { CareerProgression as CareerProgressionType } from "@/modules/dashboard/domain/entities/dashboard.entity";

interface CareerProgressionCardProps {
  data: CareerProgressionType;
}

export function CareerProgressionCard({ data }: CareerProgressionCardProps) {
  return (
    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
      <h3 className="text-lg font-semibold mb-4">Progression de carrière</h3>
      
      <div className="mb-6">
        <div className="flex items-end justify-between mb-2">
          <span className="text-4xl font-bold">{data.globalScore}</span>
          <span className="text-blue-100">/ 100</span>
        </div>
        <p className="text-blue-100 text-sm">Score global</p>
      </div>

      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span>Progression</span>
          <span>{data.progressionPercentage}%</span>
        </div>
        <div className="w-full bg-blue-400/30 rounded-full h-2">
          <div 
            className="bg-white h-2 rounded-full transition-all duration-500"
            style={{ width: `${data.progressionPercentage}%` }}
          />
        </div>
      </div>

      <div className="flex justify-between items-center text-sm">
        <div>
          <p className="text-blue-100">Niveau actuel</p>
          <p className="font-semibold">{data.currentLevel}</p>
        </div>
        {data.lastAnalysis && (
          <div className="text-right">
            <p className="text-blue-100">Dernière analyse</p>
            <p className="font-semibold">
              {new Date(data.lastAnalysis).toLocaleDateString('fr-FR')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
