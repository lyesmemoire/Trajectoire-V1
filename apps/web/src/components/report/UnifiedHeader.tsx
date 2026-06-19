export default function UnifiedHeader({
  targetRole,
  date,
  candidateName, // added as optional if not provided
}: {
  candidateName?: string;
  targetRole: string;
  date: string;
}) {
  const formattedDate = new Date(date).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="report-header">
      <div className="report-header-top">
        <span className="report-cabinet-label">TRAJECTOIRE</span>
        <span className="report-confidential-label">CONFIDENTIEL</span>
      </div>

      <div className="report-header-body">
        <h1 className="report-title">Rapport d'Évaluation Exécutif</h1>
        <p className="report-subtitle">
          Analyse comportementale et cognitive par la Méthode Trajectoire
        </p>
      </div>

      <div className="report-meta">
        {candidateName && (
          <div className="report-meta-item">
            <span className="report-meta-label">Candidat</span>
            <span className="report-meta-value">{candidateName}</span>
          </div>
        )}
        <div className="report-meta-item">
          <span className="report-meta-label">Rôle cible</span>
          <span className="report-meta-value">{targetRole}</span>
        </div>
        <div className="report-meta-item">
          <span className="report-meta-label">Date</span>
          <span className="report-meta-value">{formattedDate}</span>
        </div>
      </div>

      <div className="report-header-divider" />
    </header>
  );
}
