"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { fetchInterview, createCheckoutSession } from "@/lib/api";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

interface Competencies {
  communication: number;
  technical_depth: number;
  clarity: number;
  problem_solving: number;
  confidence: number;
}

interface PremiumReport {
  detailedAnalysis: Record<string, string>;
  actionPlan: string[];
  hireProbability: number;
  recruiterVerdict: string;
}

interface InterviewDetail {
  sessionId: string;
  userId: string;
  targetRole?: string;
  startedAt: number;
  endedAt?: number;
  transcript: string[];
  score?: {
    overall: number;
    roleUsed?: string;
    competencies: Competencies;
  };
  premiumReport?: PremiumReport;
}

const COMPETENCY_LABELS: Record<string, string> = {
  communication: "Communication",
  technical_depth: "Technique",
  clarity: "Clarté",
  problem_solving: "Résolution",
  confidence: "Confiance",
};

export default function InterviewReportPage() {
  const params = useParams();
  const sessionId = params.sessionId as string;
  const [interview, setInterview] = useState<InterviewDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await fetchInterview(sessionId);
      setInterview(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    load();
  }, [load]);

  const handleUpgrade = async () => {
    try {
      const { url } = await createCheckoutSession();
      if (url) window.location.href = url;
    } catch {
      setError("Impossible de lancer le paiement.");
    }
  };

  const scoreClass = (score: number) => {
    if (score >= 70) return "high";
    if (score >= 40) return "mid";
    return "low";
  };

  const formatDate = (ts: number) =>
    new Date(ts).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner" />
      </div>
    );
  }

  if (error || !interview) {
    return (
      <div className="report-layout">
        <a href="/dashboard" className="report-back">
          ← Retour au dashboard
        </a>
        <div className="error-message">{error ?? "Entretien introuvable."}</div>
      </div>
    );
  }

  const { score, premiumReport } = interview;
  const competencies = score?.competencies;
  const hasPremium = !!premiumReport;

  const radarData = competencies
    ? Object.entries(competencies).map(([key, value]) => ({
        subject: COMPETENCY_LABELS[key] ?? key,
        score: value,
        fullMark: 100,
      }))
    : [];

  return (
    <div className="report-layout">
      <a href="/dashboard" className="report-back">
        ← Retour au dashboard
      </a>

      {/* Hero — Score + Meta */}
      <div className="report-hero">
        <div className="score-ring">
          <div className="score-ring-bg" />
          <div className="score-ring-fill" />
          <span
            className={`score-number ${score ? scoreClass(score.overall) : ""}`}
          >
            {score?.overall ?? "—"}
          </span>
        </div>
        <div className="hero-meta">
          <h1>Rapport d&apos;entretien</h1>
          <div className="meta-line">
            📅 {formatDate(interview.startedAt)}
          </div>
          <div className="meta-line">
            🎯 Poste : {interview.targetRole ?? "Générique"}
          </div>
          {score?.roleUsed && (
            <div className="meta-line">
              ⚖️ Scoring : pondération {score.roleUsed}
            </div>
          )}
        </div>
      </div>

      {/* Radar Chart */}
      {competencies && (
        <div className="report-section">
          <div className="report-section-title">Compétences évaluées</div>
          <div className="radar-container">
            <ResponsiveContainer width="100%" height={320}>
              <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="75%">
                <PolarGrid stroke="rgba(255,255,255,0.08)" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 100]}
                  tick={{ fill: "#6b7280", fontSize: 10 }}
                />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="#6366f1"
                  fill="#6366f1"
                  fillOpacity={0.25}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Competency Cards */}
      {competencies && (
        <div className="report-section">
          <div className="report-section-title">Détail des scores</div>
          <div className="competency-grid">
            {Object.entries(competencies).map(([key, value]) => (
              <div key={key} className="competency-card">
                <div className="competency-name">
                  {COMPETENCY_LABELS[key] ?? key}
                </div>
                <div
                  className={`competency-score ${scoreClass(value)}`}
                >
                  {value}
                </div>
                <div className="competency-bar">
                  <div
                    className="competency-bar-fill"
                    style={{ width: `${value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Premium Report — Gated or Unlocked */}
      <div className="report-section">
        <div className="report-section-title">
          💎 Analyse Premium
        </div>

        {hasPremium ? (
          /* ---- UNLOCKED ---- */
          <div className="premium-content">
            <div className="premium-badge-inline">✨ PRO — Rapport débloqué</div>

            {/* Hire Probability */}
            <div className="hire-probability" style={{ marginBottom: "1.25rem" }}>
              <div
                className={`hp-value ${scoreClass(premiumReport.hireProbability)}`}
              >
                {premiumReport.hireProbability}%
              </div>
              <div className="hp-label">
                Probabilité estimée d&apos;embauche
              </div>
            </div>

            {/* Detailed Analysis */}
            <div style={{ marginBottom: "1.5rem" }}>
              <div className="report-section-title" style={{ marginTop: "0.5rem" }}>
                Analyse détaillée
              </div>
              {Object.entries(premiumReport.detailedAnalysis).map(
                ([key, text]) => (
                  <div key={key} className="analysis-item">
                    <h4>{COMPETENCY_LABELS[key] ?? key}</h4>
                    <p>{text}</p>
                  </div>
                ),
              )}
            </div>

            {/* Action Plan */}
            <div style={{ marginBottom: "1.5rem" }}>
              <div className="report-section-title">Plan d&apos;amélioration</div>
              <ul className="action-plan-list">
                {premiumReport.actionPlan.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            {/* Recruiter Verdict */}
            <div>
              <div className="report-section-title">Verdict recruteur</div>
              <div className="recruiter-verdict">
                &ldquo;{premiumReport.recruiterVerdict}&rdquo;
              </div>
            </div>
          </div>
        ) : (
          /* ---- LOCKED ---- */
          <div className="premium-gate">
            <div className="premium-gate-content">
              <div className="hire-probability">
                <div className="hp-value">??%</div>
                <div className="hp-label">Probabilité d&apos;embauche</div>
              </div>
              <div style={{ marginTop: "1rem" }}>
                <div className="analysis-item">
                  <h4>Communication</h4>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                    do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  </p>
                </div>
                <div className="analysis-item">
                  <h4>Plan d&apos;amélioration</h4>
                  <p>
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco
                    laboris nisi ut aliquip ex ea commodo.
                  </p>
                </div>
              </div>
            </div>
            <div className="premium-gate-overlay">
              <div className="lock-icon">🔒</div>
              <p>
                Débloque l&apos;analyse détaillée, le plan d&apos;action, et la probabilité
                d&apos;embauche avec le plan Pro.
              </p>
              <button className="btn-unlock" onClick={handleUpgrade}>
                ✨ Débloquer le Retour Détaillé
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
