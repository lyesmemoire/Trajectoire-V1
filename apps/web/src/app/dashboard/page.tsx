"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { fetchInterviews, createCheckoutSession, createPortalSession } from "@/lib/api";
import { useRouter } from "next/navigation";

interface InterviewSummary {
  sessionId: string;
  startedAt: number;
  endedAt?: number;
  targetRole?: string;
  score?: { overall: number; roleUsed?: string };
  createdAt?: string;
}

export default function DashboardPage() {
  const [interviews, setInterviews] = useState<InterviewSummary[]>([]);
  const [plan, setPlan] = useState<string>("free");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const load = useCallback(async () => {
    try {
      const data = await fetchInterviews();
      setInterviews(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Fetch user plan from Supabase metadata
    supabase.auth.getUser().then(({ data }) => {
      const userPlan = data?.user?.user_metadata?.plan;
      if (userPlan) setPlan(userPlan);
    });
    load();
  }, [load, supabase.auth]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const handleUpgrade = async () => {
    try {
      const { url } = await createCheckoutSession();
      if (url) window.location.href = url;
    } catch {
      setError("Impossible de lancer le paiement.");
    }
  };

  const handleManageSubscription = async () => {
    try {
      const { url } = await createPortalSession();
      if (url) window.location.href = url;
    } catch {
      setError("Impossible d'accéder à la gestion de l'abonnement.");
    }
  };

  const scoreClass = (score: number) => {
    if (score >= 70) return "high";
    if (score >= 40) return "mid";
    return "low";
  };

  const formatDate = (ts: number) => {
    return new Date(ts).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const avgScore =
    interviews.length > 0
      ? Math.round(
          interviews
            .filter((i) => i.score?.overall)
            .reduce((sum, i) => sum + (i.score?.overall ?? 0), 0) /
            Math.max(
              interviews.filter((i) => i.score?.overall).length,
              1,
            ),
        )
      : 0;

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      {/* Header */}
      <div className="dashboard-header">
        <h1>Tableau de bord</h1>
        <div className="header-actions">
          <span className={`plan-badge ${plan}`}>{plan}</span>
          {plan === "free" ? (
            <button className="btn-upgrade" onClick={handleUpgrade}>
              ✨ Upgrade Pro
            </button>
          ) : (
            <button className="btn-upgrade" onClick={handleManageSubscription} style={{ background: "rgba(255, 255, 255, 0.1)", color: "white", border: "1px solid rgba(255, 255, 255, 0.2)" }}>
              ⚙️ Gérer l'abonnement
            </button>
          )}
          <button className="btn-logout" onClick={handleLogout}>
            Déconnexion
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Stats */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-label">Entretiens</div>
          <div className="stat-value">{interviews.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Score moyen</div>
          <div className={`stat-value accent`}>
            {avgScore > 0 ? `${avgScore}/100` : "—"}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Plan actif</div>
          <div className="stat-value" style={{ textTransform: "capitalize" }}>
            {plan}
          </div>
        </div>
      </div>

      {/* Interview list */}
      <div className="section-title">Historique des entretiens</div>
      {interviews.length === 0 ? (
        <div className="empty-state">
          <p>Aucun entretien pour le moment.</p>
          <p style={{ fontSize: "0.8rem" }}>
            Lance ton premier entretien vocal pour voir tes résultats ici.
          </p>
        </div>
      ) : (
        <div className="interviews-list">
          {interviews.map((interview) => (
            <a
              key={interview.sessionId}
              href={`/interviews/${interview.sessionId}`}
              className="interview-card"
            >
              <div className="interview-info">
                <span className="interview-date">
                  {formatDate(interview.startedAt)}
                </span>
                <span className="interview-role">
                  {interview.targetRole ?? "generic"}
                </span>
              </div>
              <div
                className={`interview-score ${
                  interview.score?.overall
                    ? scoreClass(interview.score.overall)
                    : ""
                }`}
              >
                {interview.score?.overall
                  ? `${interview.score.overall}`
                  : "—"}
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
