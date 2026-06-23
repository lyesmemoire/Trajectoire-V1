export default function IntegritySection({
  consistencyGap,
}: {
  consistencyGap: number;
}) {
  const assessmentText =
    consistencyGap < 3
      ? "Les éléments revendiqués dans le CV sont strictement alignés avec l'exécution démontrée."
      : consistencyGap < 6
        ? "Les éléments revendiqués dans le CV dépassent partiellement la profondeur opérationnelle démontrée."
        : "Divergence significative détectée entre les revendications écrites et la profondeur réelle.";

  return (
    <section className="integrity-section">
      <h3 className="section-title">Intégrité & Cohérence Narrative</h3>
      
      <p className="assessment-text">
        {assessmentText}
      </p>
      
      <div className="gap-indicator">
        <span className="gap-label">Consistency Gap:</span>
        <span className="gap-value">{consistencyGap.toFixed(1)} / 10</span>
      </div>
    </section>
  );
}
