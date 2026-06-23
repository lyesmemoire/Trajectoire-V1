"use client";

export default function CancelPage() {
  return (
    <div className="auth-container">
      <div className="auth-card text-center">
        <h1>Paiement annulé</h1>
        <p className="subtitle mb-md">
          Aucun montant n&apos;a été débité. Tu peux réessayer à tout moment.
        </p>
        <a href="/dashboard" className="btn-primary btn-inline">
          Retour au Dashboard
        </a>
      </div>
    </div>
  );
}
