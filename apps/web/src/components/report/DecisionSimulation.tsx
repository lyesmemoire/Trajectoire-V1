export default function DecisionSimulation({
  hr,
  technical,
  committee
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

  return (
    <section className="mt-8 border-t border-white/5 pt-8">
      <h3 className="text-xs font-bold font-sans text-[#9CA3AF] uppercase tracking-widest mb-6">
        Simulation Décisionnelle
      </h3>
      <div className="space-y-4">
        <div className="flex justify-between items-center text-sm">
          <span className="text-[#9CA3AF] font-sans">Filtrage RH</span>
          <span className="text-[#E5E7EB] font-serif tracking-wide">{getOutcomeText(hr)}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-[#9CA3AF] font-sans">Entretien technique</span>
          <span className="text-[#E5E7EB] font-serif tracking-wide">{getOutcomeText(technical)}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-[#9CA3AF] font-sans">Comité final</span>
          <span className="text-[#E5E7EB] font-serif tracking-wide">{getOutcomeText(committee)}</span>
        </div>
      </div>
    </section>
  );
}
