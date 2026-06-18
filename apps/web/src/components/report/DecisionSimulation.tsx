export default function DecisionSimulation({
  hr,
  technical,
  committee,
}: {
  hr: "PASS" | "BORDERLINE" | "FAIL";
  technical: "PASS" | "BORDERLINE" | "FAIL";
  committee: "PASS" | "BORDERLINE" | "FAIL";
}) {
  const getOutcomeText = (decision: string) => {
    if (decision === "PASS") return "Probable validation";
    if (decision === "BORDERLINE") return "Vigilance accrue";
    return "Évaluation approfondie requise";
  };

  const getOutcomeClass = (decision: string) => {
    if (decision === "PASS") return "outcome-pass";
    if (decision === "BORDERLINE") return "outcome-borderline";
    return "outcome-fail";
  };

  return (
    <section className="decision-simulation">
      <h3 className="section-title">Simulation Décisionnelle</h3>
      
      <ul className="decision-list">
        <li className={`decision-item ${getOutcomeClass(hr)}`}>
          <span className="bullet">■</span>
          <span className="row-label" style={{ minWidth: "180px" }}>Filtrage RH</span>
          <span className="row-value">{getOutcomeText(hr)}</span>
        </li>
        
        <li className={`decision-item ${getOutcomeClass(technical)}`}>
          <span className="bullet">■</span>
          <span className="row-label" style={{ minWidth: "180px" }}>Entretien technique</span>
          <span className="row-value">{getOutcomeText(technical)}</span>
        </li>
        
        <li className={`decision-item ${getOutcomeClass(committee)}`}>
          <span className="bullet">■</span>
          <span className="row-label" style={{ minWidth: "180px" }}>Comité final</span>
          <span className="row-value">{getOutcomeText(committee)}</span>
        </li>
      </ul>
    </section>
  );
}
