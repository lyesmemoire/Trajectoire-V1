export default function ExecutiveOverview({
  finalScore,
  percentile,
  integrityRiskLevel,
}: {
  finalScore: number;
  percentile: number;
  integrityRiskLevel: string;
}) {
  const getRiskLabel = (riskLevel: string) => {
    switch (riskLevel?.toLowerCase()) {
      case "low":
        return "Faible";
      case "high":
        return "Élevé";
      case "critical":
        return "Critique";
      default:
        return "Modéré";
    }
  };

  return (
    <section className="exec-overview">
      <div className="percentile-block">
        <span className="big-percentile">{percentile}e</span>
        <span className="row-label">Percentile</span>
      </div>

      <div className="score-block">
        <span className="big-score">{finalScore?.toFixed(1)} / 10</span>
        <span className="row-label">Score exécutif</span>
      </div>

      <div className="risk-block">
        <span className="risk-label">Indice d'intégrité</span>
        <span className="risk-value">
          {getRiskLabel(integrityRiskLevel)}
        </span>
      </div>
    </section>
  );
}
