"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SuccessPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/dashboard?upgraded=true");
    }, 4000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="success-container">
      <div className="success-card">
        <div className="success-icon">🎉</div>
        <h1>Upgrade réussi !</h1>
        <p>
          Ton compte a été mis à jour vers le plan <strong>Pro</strong>.
          <br />
          Tu as maintenant accès au retour détaillé et à 20 entretiens
          par mois.
        </p>
        <a href="/dashboard" className="btn-primary btn-inline">
          Aller au Dashboard →
        </a>
      </div>
    </div>
  );
}
