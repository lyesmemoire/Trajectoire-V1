export default function ExecutiveOverview({
  finalScore,
  percentile,
  integrityRiskLevel
}: {
  finalScore: number;
  percentile: number;
  integrityRiskLevel: string;
}) {
  const getRiskLabel = (riskLevel: string) => {
    switch(riskLevel?.toLowerCase()) {
      case "low": return "Faible";
      case "high": return "Élevé";
      case "critical": return "Critique";
      default: return "Modéré";
    }
  };

  return (
    <section>
      <h2 className="text-xs font-bold font-sans text-[#9CA3AF] uppercase tracking-widest mb-10">
        Executive Evaluation
      </h2>
      
      <div className="flex flex-col gap-4">
        <div className="font-serif text-7xl md:text-8xl tracking-wide text-[#E5E7EB]">
          {percentile}e <span className="text-4xl md:text-5xl text-[#9CA3AF]">Percentile</span>
        </div>
        
        <div className="font-sans text-xl text-[#E5E7EB]">
          Score exécutif : {finalScore?.toFixed(1)} / 10
        </div>
        
        <div className="font-sans text-sm text-[#9CA3AF]">
          Indice d’intégrité : {getRiskLabel(integrityRiskLevel)}
        </div>
      </div>
    </section>
  )
}
