export default function IntegritySection({
  consistencyGap
}: {
  consistencyGap: number;
}) {
  const assessmentText = consistencyGap < 3 
    ? "Les éléments revendiqués dans le CV sont strictement alignés avec l'exécution démontrée."
    : consistencyGap < 6 
      ? "Les éléments revendiqués dans le CV dépassent partiellement la profondeur opérationnelle démontrée."
      : "Divergence significative détectée entre les revendications écrites et la profondeur réelle.";

  return (
    <section className="mt-8 bg-[#151B23] border border-white/5 p-8">
      <h3 className="text-xs font-bold font-sans text-[#9CA3AF] uppercase tracking-widest mb-6">
        Intégrité & Cohérence Narrative
      </h3>
      <div className="space-y-6">
        <p className="text-[#E5E7EB] font-sans leading-relaxed text-sm">
          {assessmentText}
        </p>
        <div className="flex items-center gap-4 text-xs font-mono text-[#9CA3AF]">
          <span>Consistency Gap:</span>
          <span>{consistencyGap.toFixed(1)} / 10</span>
        </div>
      </div>
    </section>
  );
}
