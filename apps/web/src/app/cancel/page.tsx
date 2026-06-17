"use client";

export default function CancelPage() {
  return (
    <div className="auth-container">
      <div className="auth-card" style={{ textAlign: "center" }}>
        <h1>Paiement annulé</h1>
        <p className="subtitle" style={{ marginBottom: "1.5rem" }}>
          Aucun montant n&apos;a été débité. Tu peux réessayer à tout moment.
        </p>
        <a href="/dashboard" className="btn-primary" style={{ display: "inline-block", width: "auto", padding: "0.75rem 2rem" }}>
          Retour au Dashboard
        </a>
      </div>
    </div>
  );
}
