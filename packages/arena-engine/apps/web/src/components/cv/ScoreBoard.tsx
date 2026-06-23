export default function ScoreBoard({
  score,
  percentile,
  risk,
}: {
  score: number;
  percentile: number;
  risk: string;
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
    <section className="mb-16">
      <h2 className="text-xs font-bold font-sans text-[#9CA3AF] uppercase tracking-widest mb-6">
        Executive Evaluation
      </h2>
      
      <div className="flex flex-col gap-2">
        <div className="font-serif text-7xl md:text-8xl tracking-wide text-[#E5E7EB] mb-4">
          {percentile}e <span className="text-3xl md:text-4xl">Percentile</span>
        </div>
        
        <div className="font-sans text-lg text-[#E5E7EB]">
          Score exécutif : {score?.toFixed(1)} / 10
        </div>
        
        <div className="font-sans text-sm text-[#9CA3AF]">
          Indice d’intégrité : {getRiskLabel(risk)}
        </div>
      </div>
    </section>
  )
}
