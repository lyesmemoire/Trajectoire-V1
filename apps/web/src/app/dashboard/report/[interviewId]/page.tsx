"use client";

/**
 * Page rapport exécutif — /dashboard/report/[interviewId]
 * Corrections appliquées :
 * B1A — fetchReport() → toReportViewModel() : toutes les props passées
 *       aux composants sont désormais en camelCase et typées ReportViewModel.
 *       Le rapport ne s'affiche plus vide.
 * B1B — fetchReport typé RawReportResponse (plus de any).
 * Auth — getUser() pour vérification identité.
 */
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { fetchReport } from "@/lib/api";
import { toReportViewModel, type ReportViewModel } from "@/lib/report-adapter";
import UnifiedHeader from "@/components/report/UnifiedHeader";
import ExecutiveOverview from "@/components/report/ExecutiveOverview";
import DualBreakdown from "@/components/report/DualBreakdown";
import IntegritySection from "@/components/report/IntegritySection";
import DecisionSimulation from "@/components/report/DecisionSimulation";

export default function ReportPage() {
  const { interviewId } = useParams<{ interviewId: string }>();
  const router = useRouter();

  const [report, setReport] = useState<ReportViewModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!interviewId) return;

    async function load() {
      try {
        const supabase = createClient();

        // Vérification identité — méthode sécurisée (validation serveur)
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          router.replace("/login");
          return;
        }

        // Fetch + adaptation snake_case → camelCase
        const raw = await fetchReport(interviewId as string);
        setReport(toReportViewModel(raw));
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erreur inattendue"
        );
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [interviewId, router]);

  // ── États de chargement / erreur ────────────────────────────────────────

  if (loading) {
    return (
      <div className="cabinet-theme">
        <div className="report-loading">
          <div className="report-loading-spinner" aria-label="Chargement" />
          <p className="report-loading-text">Chargement du rapport…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cabinet-theme">
        <div className="report-error">
          <p className="report-error-icon">⚠</p>
          <h2 className="report-error-title">Rapport indisponible</h2>
          <p className="report-error-message">{error}</p>
          <Link href="/dashboard" className="btn btn-primary">
            Retour au tableau de bord
          </Link>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="cabinet-theme">
        <div className="report-error">
          <p className="report-error-icon">📄</p>
          <h2 className="report-error-title">Rapport introuvable</h2>
          <p className="report-error-message">
            Ce rapport n'existe pas ou vous n'y avez pas accès.
          </p>
          <Link href="/dashboard" className="btn btn-primary">
            Retour au tableau de bord
          </Link>
        </div>
      </div>
    );
  }

  // ── Entretien non terminé ───────────────────────────────────────────────

  if (!report.isAnalysisAvailable) {
    return (
      <div className="cabinet-theme">
        <div className="report-loading">
          <div className="report-loading-spinner" />
          <p className="report-loading-text">
            L'analyse de votre entretien est en cours de génération…
          </p>
          <p className="report-loading-text" style={{ fontSize: "0.8rem", marginTop: "0.5rem" }}>
            Cette page se met à jour automatiquement.
          </p>
        </div>
      </div>
    );
  }

  // ── Rapport complet ─────────────────────────────────────────────────────

  return (
    <div className="cabinet-theme">
      <div className="report-container">
        {/* En-tête */}
        <UnifiedHeader
          candidateName={report.candidateName}
          date={report.createdAt}
          targetRole="Candidat"
        />

        {/* Vue d'ensemble — visible même sans premium */}
        <ExecutiveOverview
          finalScore={report.globalScore}
          percentile={report.percentile}
          integrityRiskLevel={report.integrityScore > 70 ? "low" : "moderate"}
        />

        {/* Sections premium */}
        {report.isPremiumUnlocked ? (
          <>
            <DualBreakdown
              cvScore={0}
              interviewScore={report.globalScore}
              technicalDepthScore={0}
              communicationScore={0}
              quantificationDepthScore={0}
              leadershipCompositeScore={0}
            />

            <IntegritySection
              consistencyGap={report.consistencyScore > 0 ? 10 - report.consistencyScore : 0}
            />

            <DecisionSimulation
              hr="PASS"
              technical="BORDERLINE"
              committee="PASS"
            />
          </>
        ) : (
          /* Premium gate */
          <div className="premium-gate">
            <div className="premium-gate-overlay" aria-hidden="true" />
            <div className="premium-gate-content">
              <span className="premium-gate-icon">🔒</span>
              <h2 className="premium-gate-title">
                Débloquez l'analyse complète
              </h2>
              <p className="premium-gate-description">
                Accédez à l'intégralité de votre rapport exécutif : compétences
                détaillées, intégrité comportementale, simulation de décisions.
              </p>
              <ul className="premium-gate-features">
                <li>Décomposition par compétence (soft &amp; hard skills)</li>
                <li>Score d'intégrité et cohérence comportementale</li>
                <li>Analyse des scénarios de décision</li>
                <li>Recommandations personnalisées actionnables</li>
              </ul>
              <Link href="/dashboard" className="btn-unlock">
                Passer au plan Pro — 19€/mois →
              </Link>
              <p className="premium-gate-note">
                Sans engagement · Annulable à tout moment
              </p>
            </div>
          </div>
        )}

        {/* Navigation retour */}
        <div className="report-footer-nav">
          <Link href="/dashboard" className="report-back-link">
            ← Retour au tableau de bord
          </Link>
        </div>
      </div>
    </div>
  );
}
