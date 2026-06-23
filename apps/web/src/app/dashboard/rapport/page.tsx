"use client";

import { useRef, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer,
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";
import { staggerContainer, fadeInUp } from "@/lib/motion";
import { SITE_NAME } from "@/lib/constants";
import { useDashboard } from "@/hooks/useDashboard";
import { useProfile }   from "@/hooks/useProfile";

/* ─────────────────────────────────────────────────────────
   Helpers
───────────────────────────────────────────────────────── */
const ttStyle: React.CSSProperties = {
  backgroundColor: "white",
  border:          "1px solid var(--border)",
  borderRadius:    "10px",
  fontSize:        "12px",
  boxShadow:       "0 4px 16px rgba(0,0,0,0.08)",
};

function level(v: number): string {
  return v >= 80 ? "Excellent" : v >= 65 ? "Bon" : v >= 50 ? "En progression" : "À travailler";
}

function levelColor(v: number): string {
  return v >= 80 ? "var(--success)" : v >= 65 ? "var(--primary)" : v >= 50 ? "var(--warning)" : "var(--accent)";
}

function fmt(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric", month: "long", year: "numeric",
  });
}

/* ─────────────────────────────────────────────────────────
   Skeleton
───────────────────────────────────────────────────────── */
function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`rounded-xl animate-pulse ${className}`}
      style={{ backgroundColor: "rgba(229,221,210,0.5)" }}
    />
  );
}

function ReportSkeleton() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Skeleton className="h-40" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1,2,3,4].map(i => <Skeleton key={i} className="h-28" />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Skeleton className="h-72" />
        <Skeleton className="h-72" />
      </div>
      <Skeleton className="h-64" />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Score ring (static, for print)
───────────────────────────────────────────────────────── */
function ScoreRing({
  value, color, label, size = 88, strokeWidth = 8,
}: {
  value: number; color: string; label: string; size?: number; strokeWidth?: number;
}) {
  const r    = (size - strokeWidth) / 2;
  const circ = r * 2 * Math.PI;
  const off  = circ - (value / 100) * circ;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--border)" strokeWidth={strokeWidth} />
          <motion.circle
            cx={size/2} cy={size/2} r={r}
            fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            whileInView={{ strokeDashoffset: off }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold" style={{ color: "var(--text)" }}>{value}</span>
        </div>
      </div>
      <span className="text-xs font-medium text-center" style={{ color: "var(--muted)" }}>{label}</span>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Section wrapper (for print page breaks)
───────────────────────────────────────────────────────── */
function Section({
  id, title, children,
}: {
  id?: string; title: string; children: React.ReactNode;
}) {
  return (
    <motion.section
      id={id}
      variants={fadeInUp}
      className="bg-white rounded-2xl border p-8"
      style={{ borderColor: "var(--border)" }}
      aria-labelledby={id ? `${id}-heading` : undefined}
    >
      <h2
        id={id ? `${id}-heading` : undefined}
        className="text-sm font-semibold uppercase tracking-widest mb-6"
        style={{ color: "var(--muted)" }}
      >
        {title}
      </h2>
      {children}
    </motion.section>
  );
}

/* ─────────────────────────────────────────────────────────
   Print styles injected via <style>
───────────────────────────────────────────────────────── */
const PRINT_CSS = `
@media print {
  body { background: white !important; }
  header, nav, .no-print { display: none !important; }
  .print-content { padding: 0 !important; }
  section { break-inside: avoid; margin-bottom: 24px; box-shadow: none !important; border: 1px solid #e5ddd2 !important; }
  .recharts-wrapper { break-inside: avoid; }
}
`;

/* ─────────────────────────────────────────────────────────
   Main
───────────────────────────────────────────────────────── */
export default function RapportPage() {
  const { profile, loading: profileLoading } = useProfile();
  const {
    summary,
    competencies,
    loading,
  } = useDashboard();

  const printRef = useRef<HTMLDivElement>(null);

  /* ── Print handler ── */
  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  /* ── PDF export via browser print dialog → Save as PDF ── */
  const handleExport = useCallback(() => {
    window.print();
  }, []);

  /* ── Derived data ── */
  const radarData = competencies.map((c) => ({
    subject: c.name,
    value:   c.score,
    fullMark: 100,
  }));

  const barData = competencies.map((c) => ({
    name:  c.name,
    score: c.score,
    prev:  c.prev_score ?? Math.max(0, c.score - 5),
    color: levelColor(c.score),
  }));

  const topStrengths = [...competencies]
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const topImprovements = [...competencies]
    .sort((a, b) => a.score - b.score)
    .slice(0, 3);

  const fullName    = profile
    ? `${profile.first_name} ${profile.last_name}`.trim()
    : "—";
  const reportDate  = fmt(summary?.last_evaluated_at ?? null);
  const hasData     = competencies.length > 0;

  if (loading || profileLoading) return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--background)" }}>
      <RapportHeader onPrint={() => {}} onExport={() => {}} disabled />
      <main className="flex-1 p-6 lg:p-8">
        <ReportSkeleton />
      </main>
    </div>
  );

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "var(--background)" }}
    >
      <style dangerouslySetInnerHTML={{ __html: PRINT_CSS }} />

      {/* Header */}
      <RapportHeader onPrint={handlePrint} onExport={handleExport} disabled={!hasData} />

      {/* Body */}
      <main className="flex-1 p-6 lg:p-8 print-content" ref={printRef}>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto space-y-6"
        >
          {!hasData ? (
            <EmptyState />
          ) : (
            <>
              {/* Cover */}
              <CoverSection
                fullName={fullName}
                role={profile?.role ?? "—"}
                objective={profile?.objective ?? null}
                reportDate={reportDate}
                totalEvaluations={summary?.total_evaluations ?? 0}
                totalSimulations={summary?.total_simulations ?? 0}
              />

              {/* Main scores */}
              <Section id="scores" title="Scores principaux">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                  <ScoreRing
                    value={summary?.confidence_score ?? 0}
                    color="var(--primary)"
                    label="Confiance"
                  />
                  <ScoreRing
                    value={summary?.preparedness ?? 0}
                    color="var(--success)"
                    label="Préparation"
                  />
                  <ScoreRing
                    value={summary?.stress_score ?? 0}
                    color="var(--accent)"
                    label="Stress"
                  />
                  <ScoreRing
                    value={summary?.decision_score ?? 0}
                    color="var(--warning)"
                    label="Décision"
                  />
                </div>
              </Section>

              {/* Radar + Bar */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <Section id="radar" title="Profil comportemental">
                  <div style={{ height: 280 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={radarData}>
                        <PolarGrid stroke="var(--border)" />
                        <PolarAngleAxis
                          dataKey="subject"
                          tick={{ fontSize: 10, fill: "var(--muted)" }}
                        />
                        <Radar
                          name="Profil"
                          dataKey="value"
                          stroke="var(--primary)"
                          fill="var(--primary)"
                          fillOpacity={0.15}
                          strokeWidth={2}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </Section>

                <Section id="comparison" title="Évolution par dimension">
                  <div style={{ height: 280 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={barData} barGap={4}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(229,221,210,0.6)" />
                        <XAxis dataKey="name" tick={{ fontSize: 9, fill: "var(--muted)" }} />
                        <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "var(--muted)" }} />
                        <Tooltip contentStyle={ttStyle} />
                        <Bar dataKey="prev"  name="Précédent" fill="var(--border)" radius={[4,4,0,0]} />
                        <Bar dataKey="score" name="Actuel"    radius={[4,4,0,0]}>
                          {barData.map((entry, i) => (
                            <Cell key={i} fill={entry.color} fillOpacity={0.85} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Section>
              </div>

              {/* Full dimension breakdown */}
              <Section id="dimensions" title="Analyse détaillée par dimension">
                <div className="space-y-5">
                  {competencies.map((c) => {
                    const delta = c.prev_score !== null ? c.score - c.prev_score : null;
                    const color = levelColor(c.score);
                    return (
                      <div key={c.name}>
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                              {c.name}
                            </span>
                            <span
                              className="text-xs px-2 py-0.5 rounded-full font-medium"
                              style={{
                                backgroundColor: `${color}15`,
                                color,
                              }}
                            >
                              {level(c.score)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {delta !== null && (
                              <span
                                className="text-xs font-semibold"
                                style={{ color: delta >= 0 ? "var(--success)" : "var(--accent)" }}
                              >
                                {delta >= 0 ? "+" : ""}{delta} pts
                              </span>
                            )}
                            <span className="text-sm font-bold" style={{ color }}>
                              {c.score}/100
                            </span>
                          </div>
                        </div>
                        <div
                          className="h-2 rounded-full overflow-hidden"
                          style={{ backgroundColor: "var(--border)" }}
                        >
                          <motion.div
                            className="h-full rounded-full"
                            style={{ backgroundColor: color }}
                            initial={{ width: 0 }}
                            whileInView={{ width: `${c.score}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Section>

              {/* Strengths + Improvements */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Section id="strengths" title="Points forts">
                  <ul className="space-y-3" role="list">
                    {topStrengths.map((c, i) => (
                      <li
                        key={c.name}
                        className="flex items-center gap-4 p-3 rounded-xl"
                        style={{ backgroundColor: "rgba(26,127,75,0.06)" }}
                        role="listitem"
                      >
                        <span
                          className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                          style={{ backgroundColor: "var(--success)", color: "white" }}
                          aria-hidden="true"
                        >
                          {i + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                            {c.name}
                          </p>
                          <p className="text-xs" style={{ color: "var(--success)" }}>
                            Score : {c.score}/100 · {level(c.score)}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </Section>

                <Section id="improvements" title="Axes de progression">
                  <ul className="space-y-3" role="list">
                    {topImprovements.map((c, i) => (
                      <li
                        key={c.name}
                        className="flex items-center gap-4 p-3 rounded-xl"
                        style={{ backgroundColor: "rgba(232,80,26,0.06)" }}
                        role="listitem"
                      >
                        <span
                          className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                          style={{ backgroundColor: "var(--accent)", color: "white" }}
                          aria-hidden="true"
                        >
                          {i + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                            {c.name}
                          </p>
                          <p className="text-xs" style={{ color: "var(--accent)" }}>
                            Score : {c.score}/100 · {level(c.score)}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </Section>
              </div>

              {/* Recommendations */}
              <Section id="recommendations" title="Recommandations personnalisées">
                <div className="space-y-4">
                  {topImprovements.map((c) => (
                    <RecommendationCard key={c.name} dimension={c.name} score={c.score} />
                  ))}
                </div>
              </Section>

              {/* Activity summary */}
              <Section id="activity" title="Résumé d'activité">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    {
                      label: "Évaluations",
                      value: String(summary?.total_evaluations ?? 0),
                      color: "var(--primary)",
                      icon:  "📋",
                    },
                    {
                      label: "Simulations",
                      value: String(summary?.total_simulations ?? 0),
                      color: "var(--success)",
                      icon:  "🎯",
                    },
                    {
                      label: "Actions en attente",
                      value: String(summary?.pending_actions ?? 0),
                      color: "var(--warning)",
                      icon:  "⏳",
                    },
                    {
                      label: "Dernière évaluation",
                      value: reportDate,
                      color: "var(--muted)",
                      icon:  "📅",
                    },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="p-4 rounded-xl border"
                      style={{ borderColor: "var(--border)" }}
                    >
                      <span className="text-xl mb-2 block" aria-hidden="true">{stat.icon}</span>
                      <p className="text-xs mb-1" style={{ color: "var(--muted)" }}>{stat.label}</p>
                      <p className="text-lg font-bold" style={{ color: stat.color }}>
                        {stat.value}
                      </p>
                    </div>
                  ))}
                </div>
              </Section>

              {/* Footer note */}
              <motion.p
                variants={fadeInUp}
                className="text-center text-xs pb-4 no-print"
                style={{ color: "var(--muted)" }}
              >
                Rapport généré par {SITE_NAME} · Données confidentielles ·{" "}
                {new Date().toLocaleDateString("fr-FR")}
              </motion.p>
            </>
          )}
        </motion.div>
      </main>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Sub-components
───────────────────────────────────────────────────────── */

function RapportHeader({
  onPrint, onExport, disabled,
}: {
  onPrint:  () => void;
  onExport: () => void;
  disabled: boolean;
}) {
  return (
    <header
      className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 border-b no-print"
      style={{
        backgroundColor:      "rgba(255,255,255,0.9)",
        backdropFilter:       "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderColor:          "var(--border)",
      }}
    >
      <Link
        href="/dashboard"
        className="flex items-center gap-2 text-sm font-medium transition-colors"
        style={{ color: "var(--muted)" }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--text)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--muted)"; }}
        aria-label="Retour au tableau de bord"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M10 4l-4 4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Tableau de bord
      </Link>

      <span className="text-base font-bold" style={{ color: "var(--text)" }}>
        Mon rapport
      </span>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onPrint}
          disabled={disabled}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-200"
          style={{
            borderColor:     "var(--border)",
            color:           disabled ? "var(--muted)" : "var(--text)",
            backgroundColor: "white",
            cursor:          disabled ? "not-allowed" : "pointer",
            opacity:         disabled ? 0.5 : 1,
          }}
          onMouseEnter={(e) => {
            if (!disabled)
              (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--primary)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)";
          }}
          aria-label="Imprimer le rapport"
        >
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
            <path d="M4 4V2h7v2M2 4h11v6H2V4zM4 10v3h7v-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Imprimer
        </button>

        <button
          type="button"
          onClick={onExport}
          disabled={disabled}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200"
          style={{
            backgroundColor: disabled ? "rgba(26,60,52,0.3)" : "var(--primary)",
            color:           "white",
            cursor:          disabled ? "not-allowed" : "pointer",
          }}
          onMouseEnter={(e) => {
            if (!disabled) {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.backgroundColor = "var(--primary-hover)";
              el.style.transform       = "translateY(-1px)";
              el.style.boxShadow       = "0 4px 16px rgba(26,60,52,0.25)";
            }
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLButtonElement;
            el.style.backgroundColor = disabled ? "rgba(26,60,52,0.3)" : "var(--primary)";
            el.style.transform       = "translateY(0)";
            el.style.boxShadow       = "none";
          }}
          aria-label="Exporter le rapport en PDF"
        >
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
            <path d="M7.5 2v8M4 7l3.5 3.5L11 7M2 13h11" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Exporter PDF
        </button>
      </div>
    </header>
  );
}

function CoverSection({
  fullName, role, objective, reportDate,
  totalEvaluations, totalSimulations,
}: {
  fullName:          string;
  role:              string;
  objective:         string | null;
  reportDate:        string;
  totalEvaluations:  number;
  totalSimulations:  number;
}) {
  const objectiveLabels: Record<string, string> = {
    promotion:  "Préparation à une promotion",
    interview:  "Entretien interne",
    transition: "Transition professionnelle",
    direction:  "Prise de direction",
    clarity:    "Clarté de trajectoire",
    other:      "Autre objectif",
  };

  return (
    <motion.div
      variants={fadeInUp}
      className="bg-white rounded-2xl border overflow-hidden"
      style={{ borderColor: "var(--border)" }}
    >
      {/* Top band */}
      <div
        className="px-8 py-6"
        style={{ backgroundColor: "var(--primary)" }}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.6)" }}>
              {SITE_NAME} — Rapport comportemental
            </p>
            <h1 className="text-2xl font-bold" style={{ color: "white" }}>
              {fullName}
            </h1>
            {role !== "—" && (
              <p className="text-sm mt-0.5" style={{ color: "rgba(255,255,255,0.7)" }}>{role}</p>
            )}
          </div>
          <div className="text-right">
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>Généré le</p>
            <p className="text-sm font-semibold" style={{ color: "rgba(255,255,255,0.9)" }}>{reportDate}</p>
          </div>
        </div>
      </div>

      {/* Meta strip */}
      <div className="px-8 py-5 flex flex-wrap gap-6" style={{ borderTop: "1px solid var(--border)" }}>
        {objective && (
          <div>
            <p className="text-xs" style={{ color: "var(--muted)" }}>Objectif</p>
            <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
              {objectiveLabels[objective] ?? objective}
            </p>
          </div>
        )}
        <div>
          <p className="text-xs" style={{ color: "var(--muted)" }}>Évaluations complétées</p>
          <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>{totalEvaluations}</p>
        </div>
        <div>
          <p className="text-xs" style={{ color: "var(--muted)" }}>Simulations réalisées</p>
          <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>{totalSimulations}</p>
        </div>
        <div className="ml-auto">
          <span
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full"
            style={{ backgroundColor: "rgba(26,127,75,0.1)", color: "var(--success)" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current" aria-hidden="true" />
            Rapport complet
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function RecommendationCard({
  dimension, score,
}: {
  dimension: string; score: number;
}) {
  const recs: Record<string, { action: string; ressource: string; delai: string }> = {
    Leadership: {
      action:    "Prenez la parole en premier lors de vos 3 prochaines réunions. Ouvrez, posez le cadre, récapitulez.",
      ressource: "Exercice : préparez une prise de parole de 90 secondes avant chaque réunion clé.",
      delai:     "2 semaines",
    },
    Communication: {
      action:    "Adoptez la structure Situation–Complication–Résolution pour vos emails importants et vos présentations.",
      ressource: "Exercice : rédigez 3 messages selon cette structure cette semaine.",
      delai:     "1 semaine",
    },
    Décision: {
      action:    "Entraînez-vous à décider avec 70% d'information. Documentez vos décisions et leurs résultats.",
      ressource: "Journal décisionnel : 5 minutes par décision importante.",
      delai:     "1 mois",
    },
    Stress: {
      action:    "Introduisez une routine pré-entretien : respiration 4-7-8, visualisation positive, ancrage physique.",
      ressource: "Exercice : 5 minutes de préparation mentale avant chaque moment à enjeu.",
      delai:     "3 semaines",
    },
    Assertivité: {
      action:    "Exprimez un désaccord professionnel cette semaine en utilisant la formule : 'Je comprends votre point. Mon analyse est différente parce que…'",
      ressource: "Simulation : préparez 3 désaccords à exprimer cette semaine.",
      delai:     "1 semaine",
    },
    Adaptabilité: {
      action:    "Face au prochain changement imprévu, notez 3 opportunités qu'il crée avant de noter les contraintes.",
      ressource: "Exercice de recadrage : 10 minutes après chaque situation imprévue.",
      delai:     "Continu",
    },
    Émotion: {
      action:    "Pratiquez l'étiquetage émotionnel : nommez ce que vous ressentez avant d'agir dans les situations de tension.",
      ressource: "Journal émotionnel : 2 minutes après chaque réunion difficile.",
      delai:     "3 semaines",
    },
    Vision: {
      action:    "Rédigez votre 'Executive Summary' personnel : 150 mots sur votre trajectoire et vos ambitions à 3 ans.",
      ressource: "Atelier écriture : 1 heure ce weekend.",
      delai:     "1 semaine",
    },
  };

  const rec    = recs[dimension];
  const color  = levelColor(score);

  if (!rec) return null;

  return (
    <div
      className="p-5 rounded-xl border-l-4"
      style={{ backgroundColor: "rgba(248,245,240,0.6)", borderLeftColor: color }}
    >
      <div className="flex items-center gap-3 mb-3">
        <p className="text-sm font-bold" style={{ color: "var(--text)" }}>{dimension}</p>
        <span
          className="text-xs px-2 py-0.5 rounded-full font-medium"
          style={{ backgroundColor: `${color}15`, color }}
        >
          {score}/100 · {level(score)}
        </span>
      </div>
      <p className="text-sm leading-relaxed mb-2" style={{ color: "var(--text)" }}>
        {rec.action}
      </p>
      <div className="flex flex-wrap items-center gap-4 text-xs" style={{ color: "var(--muted)" }}>
        <span>📌 {rec.ressource}</span>
        <span>⏱ Horizon : {rec.delai}</span>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <motion.div
      variants={fadeInUp}
      className="bg-white rounded-2xl border p-16 text-center max-w-lg mx-auto"
      style={{ borderColor: "var(--border)" }}
    >
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
        style={{ backgroundColor: "rgba(26,60,52,0.1)" }}
        aria-hidden="true"
      >
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <path d="M6 4h10l6 6v14H6V4z" stroke="var(--primary)" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M16 4v6h6M10 13h8M10 17h6" stroke="var(--primary)" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
      <h2 className="text-xl font-bold mb-2" style={{ color: "var(--text)" }}>
        Rapport indisponible
      </h2>
      <p className="text-base leading-relaxed mb-6" style={{ color: "var(--muted)" }}>
        Votre rapport sera généré automatiquement après votre première évaluation comportementale.
      </p>
      <Link
        href="/dashboard/evaluation"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200"
        style={{ backgroundColor: "var(--primary)", color: "white" }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLAnchorElement;
          el.style.backgroundColor = "var(--primary-hover)";
          el.style.transform       = "translateY(-1px)";
          el.style.boxShadow       = "0 8px 24px rgba(26,60,52,0.25)";
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLAnchorElement;
          el.style.backgroundColor = "var(--primary)";
          el.style.transform       = "translateY(0)";
          el.style.boxShadow       = "none";
        }}
      >
        Démarrer l&apos;évaluation
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>
    </motion.div>
  );
}
