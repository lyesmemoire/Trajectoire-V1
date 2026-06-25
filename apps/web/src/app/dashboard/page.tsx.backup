"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar, Cell,
} from "recharts";
import { staggerContainer, fadeInUp, scaleIn } from "@/lib/motion";
import {
  SITE_NAME,
  RADAR_DATA,
  DASHBOARD_TABS,
  DASHBOARD_RECOMMENDATIONS,
  SIDEBAR_NAV,
  type DashboardTab,
} from "@/lib/constants";
import { useDashboard } from "@/hooks/useDashboard";
import { useProfile }   from "@/hooks/useProfile";
import { useAuth }      from "@/hooks/useAuth";
import type { NotifType } from "@/types/database";
import { trackEvent } from "@/lib/analytics/trackEvent";
import { ANALYTICS_EVENTS } from "@/lib/analytics/events";

/* ─────────────────────────────────────────────────────────
   Shared
───────────────────────────────────────────────────────── */
const ttStyle: React.CSSProperties = {
  backgroundColor: "white",
  border:          "1px solid var(--border)",
  borderRadius:    "10px",
  fontSize:        "12px",
  boxShadow:       "0 4px 16px rgba(0,0,0,0.08)",
};

function NotifDot({ type }: { type: NotifType }) {
  const colors: Record<NotifType, string> = {
    success: "var(--success)",
    info:    "var(--primary)",
    warning: "var(--warning)",
  };
  return (
    <div
      className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5"
      style={{ backgroundColor: colors[type] }}
      aria-hidden="true"
    />
  );
}

/* ─────────────────────────────────────────────────────────
   Loading skeleton
───────────────────────────────────────────────────────── */
function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`rounded-xl animate-pulse ${className}`}
      style={{ backgroundColor: "rgba(229,221,210,0.5)" }}
    />
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1,2,3,4].map((i) => <Skeleton key={i} className="h-28" />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
      </div>
      <Skeleton className="h-56" />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   NavLink
───────────────────────────────────────────────────────── */
function NavLink({
  href, label, icon, active,
}: {
  href: string; label: string; icon: React.ReactNode; active?: boolean;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
      style={{
        backgroundColor: active ? "rgba(26,60,52,0.1)" : "transparent",
        color:           active ? "var(--primary)"      : "var(--muted)",
      }}
      aria-current={active ? "page" : undefined}
      onMouseEnter={(e) => { if (!active) { const el = e.currentTarget as HTMLAnchorElement; el.style.backgroundColor = "rgba(26,60,52,0.06)"; el.style.color = "var(--text)"; } }}
      onMouseLeave={(e) => { if (!active) { const el = e.currentTarget as HTMLAnchorElement; el.style.backgroundColor = "transparent"; el.style.color = "var(--muted)"; } }}
    >
      <span aria-hidden="true">{icon}</span>
      {label}
    </Link>
  );
}

/* ─────────────────────────────────────────────────────────
   Score ring
───────────────────────────────────────────────────────── */
function ScoreRing({
  value = 0, size = 80, strokeWidth = 7, color, label,
}: {
  value?: number | null; size?: number; strokeWidth?: number; color: string; label: string;
}) {
  const v    = value ?? 0;
  const r    = (size - strokeWidth) / 2;
  const circ = r * 2 * Math.PI;
  const off  = circ - (v / 100) * circ;

  return (
    <div className="flex flex-col items-center gap-1.5">
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
          <span className="text-lg font-bold" style={{ color: "var(--text)" }}>{v}</span>
        </div>
      </div>
      <span className="text-xs font-medium text-center" style={{ color: "var(--muted)" }}>{label}</span>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   KPI card
───────────────────────────────────────────────────────── */
function KPICard({
  label, value, unit, delta, color,
}: {
  label: string; value: number | null; unit: string; delta: string; color: string;
}) {
  const positive = delta.startsWith("+") || delta.startsWith("↑");
  return (
    <motion.div
      variants={scaleIn}
      className="bg-white rounded-2xl border p-5"
      style={{ borderColor: "var(--border)" }}
      whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(0,0,0,0.07)", transition: { duration: 0.2 } }}
    >
      <p className="text-xs font-medium uppercase tracking-wide mb-3" style={{ color: "var(--muted)" }}>{label}</p>
      <div className="flex items-end gap-1 mb-1.5">
        <span className="text-3xl font-bold" style={{ color }}>{value ?? "—"}</span>
        <span className="text-sm mb-0.5" style={{ color: "var(--muted)" }}>{unit}</span>
      </div>
      <p className="text-xs font-semibold" style={{ color: positive ? "var(--success)" : "var(--accent)" }}>
        {delta}
      </p>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────
   Panel — Overview
───────────────────────────────────────────────────────── */
function OverviewPanel() {
  const {
    summary, competencies, actions, notifications,
    progression, loading, toggleAction, readNotif,
  } = useDashboard();

  if (loading) return <DashboardSkeleton />;

  /* Adaptation des données Supabase → format graphique */
  const progressionChart = progression.map((p) => ({
    week:         p.week_label,
    confidence:   p.confidence   ?? 0,
    preparedness: p.preparedness ?? 0,
  }));

  const radarData = competencies.length > 0
    ? competencies.map((c) => ({ subject: c.name, value: c.score, fullMark: 100 }))
    : RADAR_DATA;

  return (
    <motion.div
      key="overview"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      {/* KPI row */}
      <motion.div variants={staggerContainer} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard label="Confiance"   value={summary?.confidence_score ?? null} unit="/100" delta="↑ ce mois"    color="var(--primary)" />
        <KPICard label="Préparation" value={summary?.preparedness     ?? null} unit="/100" delta="↑ ce mois"    color="var(--success)" />
        <KPICard label="Décision"    value={summary?.decision_score   ?? null} unit="/100" delta="↑ ce mois"    color="var(--warning)" />
        <KPICard label="Stress"      value={summary?.stress_score     ?? null} unit="%"    delta="↓ Maîtrisé"   color="var(--accent)"  />
      </motion.div>

      {/* Rings + Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <motion.div variants={fadeInUp} className="bg-white rounded-2xl border p-6" style={{ borderColor: "var(--border)" }}>
          <h3 className="text-sm font-semibold mb-5" style={{ color: "var(--text)" }}>Scores principaux</h3>
          <div className="grid grid-cols-3 gap-4">
            <ScoreRing value={summary?.confidence_score} color="var(--primary)" label="Confiance" />
            <ScoreRing value={summary?.preparedness}     color="var(--success)" label="Préparation" />
            <ScoreRing value={summary?.stress_score}     color="var(--accent)"  label="Stress" />
          </div>
        </motion.div>

        <motion.div variants={fadeInUp} className="bg-white rounded-2xl border p-6" style={{ borderColor: "var(--border)" }}>
          <h3 className="text-sm font-semibold mb-2" style={{ color: "var(--text)" }}>Profil comportemental</h3>
          <div style={{ height: "200px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="var(--border)" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: "var(--muted)" }} />
                <Radar name="Profil" dataKey="value" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.15} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Area chart */}
      {progressionChart.length > 0 && (
        <motion.div variants={fadeInUp} className="bg-white rounded-2xl border p-6" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold" style={{ color: "var(--text)" }}>Progression</h3>
            <div className="flex items-center gap-4 text-xs" style={{ color: "var(--muted)" }}>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-1 rounded-full inline-block" style={{ backgroundColor: "var(--primary)" }} />
                Confiance
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-1 rounded-full inline-block" style={{ backgroundColor: "var(--success)" }} />
                Préparation
              </span>
            </div>
          </div>
          <div style={{ height: "200px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={progressionChart}>
                <defs>
                  <linearGradient id="ovConf" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="var(--primary)" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}    />
                  </linearGradient>
                  <linearGradient id="ovPrep" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="var(--success)" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="var(--success)" stopOpacity={0}    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(229,221,210,0.6)" />
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: "var(--muted)" }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "var(--muted)" }} />
                <Tooltip contentStyle={ttStyle} />
                <Area type="monotone" dataKey="confidence"   name="Confiance"   stroke="var(--primary)" strokeWidth={2} fill="url(#ovConf)" />
                <Area type="monotone" dataKey="preparedness" name="Préparation" stroke="var(--success)" strokeWidth={2} fill="url(#ovPrep)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}

      {/* Actions + Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Actions */}
        <motion.div variants={fadeInUp} className="bg-white rounded-2xl border p-6" style={{ borderColor: "var(--border)" }}>
          <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text)" }}>
            Plan d&apos;action — cette semaine
          </h3>
          {actions.length === 0 ? (
            <p className="text-sm" style={{ color: "var(--muted)" }}>Aucune action pour le moment.</p>
          ) : (
            <ul className="space-y-3" role="list">
              {actions.map((item) => (
                <li key={item.id} className="flex items-start gap-3" role="listitem">
                  <button
                    type="button"
                    onClick={() => toggleAction(item.id, !item.done)}
                    className="w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-200"
                    style={{
                      borderColor:     item.done ? "var(--success)" : "var(--border)",
                      backgroundColor: item.done ? "var(--success)" : "transparent",
                    }}
                    aria-label={item.done ? "Marquer comme à faire" : "Marquer comme terminé"}
                  >
                    {item.done && (
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                        <path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </button>
                  <p
                    className="flex-1 text-sm leading-snug"
                    style={{
                      color:          item.done ? "var(--muted)" : "var(--text)",
                      textDecoration: item.done ? "line-through"  : "none",
                    }}
                  >
                    {item.label}
                  </p>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full flex-shrink-0"
                    style={{
                      backgroundColor:
                        item.priority === "high"   ? "rgba(232,80,26,0.1)" :
                        item.priority === "medium" ? "rgba(217,119,6,0.1)"  :
                        "rgba(229,221,210,0.5)",
                      color:
                        item.priority === "high"   ? "var(--accent)"  :
                        item.priority === "medium" ? "var(--warning)" :
                        "var(--muted)",
                    }}
                  >
                    {item.priority === "high" ? "Priorité" : item.priority === "medium" ? "Cette semaine" : "Optionnel"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </motion.div>

        {/* Notifications */}
        <motion.div variants={fadeInUp} className="bg-white rounded-2xl border p-6" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold" style={{ color: "var(--text)" }}>Notifications</h3>
            {notifications.filter((n) => !n.read).length > 0 && (
              <span
                className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{ backgroundColor: "rgba(26,60,52,0.1)", color: "var(--primary)" }}
              >
                {notifications.filter((n) => !n.read).length} nouvelles
              </span>
            )}
          </div>
          {notifications.length === 0 ? (
            <p className="text-sm" style={{ color: "var(--muted)" }}>Aucune notification.</p>
          ) : (
            <ul className="space-y-4" role="list">
              {notifications.map((n) => (
                <li
                  key={n.id}
                  className="flex items-start gap-3 cursor-pointer"
                  style={{ opacity: n.read ? 0.55 : 1 }}
                  onClick={() => !n.read && readNotif(n.id)}
                  role="listitem"
                >
                  <NotifDot type={n.type} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>{n.title}</p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>{n.body}</p>
                    <p className="text-xs mt-1" style={{ color: "var(--muted)", opacity: 0.6 }}>
                      {new Date(n.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────
   Panel — Compétences
───────────────────────────────────────────────────────── */
function CompetencesPanel() {
  const { competencies, loading, summary } = useDashboard();
  if (loading) return <DashboardSkeleton />;

  const FALLBACK_COLOR = "var(--primary)";
  const COLOR_MAP: Record<string, string> = {
    "Leadership":    "var(--primary)",
    "Communication": "var(--accent)",
    "Décision":      "var(--success)",
    "Stress":        "var(--warning)",
    "Assertivité":   "var(--primary)",
    "Adaptabilité":  "var(--success)",
    "Émotion":       "var(--accent)",
    "Vision":        "var(--primary)",
  };

  const data = competencies.map((c) => ({
    ...c,
    color: COLOR_MAP[c.name] ?? FALLBACK_COLOR,
    prev:  c.prev_score ?? Math.max(0, c.score - 5),
  }));

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-2xl border p-8 text-center" style={{ borderColor: "var(--border)" }}>
        <p className="text-base font-medium mb-2" style={{ color: "var(--text)" }}>Aucune donnée de compétence</p>
        <p className="text-sm" style={{ color: "var(--muted)" }}>Complétez une évaluation pour voir votre profil.</p>
        <Link
          href="/dashboard/evaluation"
          className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 rounded-xl text-sm font-semibold"
          style={{ backgroundColor: "var(--primary)", color: "white" }}
        >
          Démarrer l&apos;évaluation
        </Link>
      </div>
    );
  }

  // Generate some simple stress breakdown from summary if not in competencies
  const stressData = [
    { category: "Entretiens", value: summary?.stress_score ? Math.min(100, summary.stress_score + 10) : 50 },
    { category: "Présentations", value: summary?.stress_score ? Math.max(0, summary.stress_score - 5) : 35 },
    { category: "Négociations", value: summary?.stress_score ?? 40 },
    { category: "Feedback", value: summary?.stress_score ? Math.max(0, summary.stress_score - 15) : 20 },
  ];

  return (
    <motion.div key="competences" variants={staggerContainer} initial="hidden" animate="visible" exit={{ opacity: 0 }} className="space-y-6">
      {/* Bar chart */}
      <motion.div variants={fadeInUp} className="bg-white rounded-2xl border p-6" style={{ borderColor: "var(--border)" }}>
        <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text)" }}>
          Scores par compétence — comparaison période précédente
        </h3>
        <div style={{ height: "260px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(229,221,210,0.6)" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: "var(--muted)" }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "var(--muted)" }} />
              <Tooltip contentStyle={ttStyle} />
              <Bar dataKey="prev"  name="Période précédente" fill="var(--border)" radius={[4,4,0,0]} />
              <Bar dataKey="score" name="Actuel"             radius={[4,4,0,0]}>
                {data.map((entry, i) => <Cell key={i} fill={entry.color} fillOpacity={0.85} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Score cards */}
      <motion.div variants={staggerContainer} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {data.map((c) => {
          const delta = c.score - c.prev;
          return (
            <motion.div
              key={c.name}
              variants={scaleIn}
              className="bg-white rounded-2xl border p-5"
              style={{ borderColor: "var(--border)" }}
              whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(0,0,0,0.07)", transition: { duration: 0.2 } }}
            >
              <p className="text-xs font-medium mb-3" style={{ color: "var(--muted)" }}>{c.name}</p>
              <p className="text-3xl font-bold mb-2" style={{ color: c.color }}>{c.score}</p>
              <div className="flex items-center gap-2">
                <div
                  className="flex-1 h-1.5 rounded-full overflow-hidden"
                  style={{ backgroundColor: "var(--border)" }}
                >
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: c.color }}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${c.score}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
                <span
                  className="text-xs font-semibold"
                  style={{ color: delta >= 0 ? "var(--success)" : "var(--accent)" }}
                >
                  {delta >= 0 ? "+" : ""}{delta}
                </span>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Stress bar chart */}
      <motion.div variants={fadeInUp} className="bg-white rounded-2xl border p-6" style={{ borderColor: "var(--border)" }}>
        <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text)" }}>Gestion de la pression par contexte</h3>
        <div style={{ height: "200px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stressData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(229,221,210,0.6)" />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: "var(--muted)" }} />
              <YAxis type="category" dataKey="category" tick={{ fontSize: 11, fill: "var(--muted)" }} width={130} />
              <Tooltip contentStyle={ttStyle} />
              <Bar dataKey="value" name="Score d'anxiété" fill="var(--primary)" radius={[0, 4, 4, 0]} fillOpacity={0.85} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────
   Panel — Progression
───────────────────────────────────────────────────────── */
function ProgressionPanel() {
  const { progression, loading, summary } = useDashboard();
  if (loading) return <DashboardSkeleton />;

  const progressionChart = progression.map((p) => ({
    week:         p.week_label,
    confidence:   p.confidence   ?? 0,
    preparedness: p.preparedness ?? 0,
  }));

  const deltas = [
    { label: "Confiance globale", value: summary?.confidence_score ?? 0, detail: "+8% vs mois dernier", color: "var(--primary)" },
    { label: "Préparation moyenne", value: summary?.preparedness ?? 0, detail: "+12% vs mois dernier", color: "var(--success)" },
    { label: "Pic de stress", value: summary?.stress_score ?? 0, detail: "-15% vs mois dernier", color: "var(--accent)" },
  ];

  if (progressionChart.length === 0) {
    return (
      <div className="bg-white rounded-2xl border p-8 text-center" style={{ borderColor: "var(--border)" }}>
        <p className="text-base font-medium mb-2" style={{ color: "var(--text)" }}>Aucune donnée de progression</p>
        <p className="text-sm" style={{ color: "var(--muted)" }}>Revenez la semaine prochaine pour voir votre évolution.</p>
      </div>
    );
  }

  return (
    <motion.div key="progression" variants={staggerContainer} initial="hidden" animate="visible" exit={{ opacity: 0 }} className="space-y-6">
      <motion.div variants={fadeInUp} className="bg-white rounded-2xl border p-6" style={{ borderColor: "var(--border)" }}>
        <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text)" }}>Évolution de vos scores — 8 semaines</h3>
        <div style={{ height: "300px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={progressionChart}>
              <defs>
                <linearGradient id="prConf" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="var(--primary)" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}   />
                </linearGradient>
                <linearGradient id="prPrep" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="var(--success)" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="var(--success)" stopOpacity={0}   />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(229,221,210,0.6)" />
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: "var(--muted)" }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "var(--muted)" }} />
              <Tooltip contentStyle={ttStyle} />
              <Area type="monotone" dataKey="confidence" name="Confiance" stroke="var(--primary)" strokeWidth={2.5} fill="url(#prConf)" dot={{ r: 4, fill: "var(--primary)", strokeWidth: 0 }} />
              <Area type="monotone" dataKey="preparedness" name="Préparation" stroke="var(--success)" strokeWidth={2.5} fill="url(#prPrep)" dot={{ r: 4, fill: "var(--success)", strokeWidth: 0 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <motion.div variants={staggerContainer} className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {deltas.map((item) => (
          <motion.div
            key={item.label} variants={scaleIn}
            className="bg-white rounded-2xl border p-5" style={{ borderColor: "var(--border)" }}
            whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(0,0,0,0.07)", transition: { duration: 0.2 } }}
          >
            <p className="text-xs font-medium mb-2" style={{ color: "var(--muted)" }}>{item.label}</p>
            <p className="text-2xl font-bold mb-1" style={{ color: item.color }}>{item.value}</p>
            <p className="text-xs" style={{ color: "var(--muted)" }}>{item.detail}</p>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────
   Panel — Plan d'action
───────────────────────────────────────────────────────── */
function PlanPanel() {
  const { milestones, loading } = useDashboard();
  if (loading) return <DashboardSkeleton />;

  return (
    <motion.div key="plan" variants={staggerContainer} initial="hidden" animate="visible" exit={{ opacity: 0 }} className="space-y-6">
      {/* Timeline */}
      <motion.div variants={fadeInUp} className="bg-white rounded-2xl border p-6" style={{ borderColor: "var(--border)" }}>
        <h3 className="text-sm font-semibold mb-6" style={{ color: "var(--text)" }}>Plan d&apos;action — 30 jours</h3>
        {milestones.length === 0 ? (
          <p className="text-sm" style={{ color: "var(--muted)" }}>Aucun jalon défini.</p>
        ) : (
          <div className="relative">
            <div className="absolute left-5 top-0 bottom-0 w-px" style={{ backgroundColor: "var(--border)" }} aria-hidden="true" />
            <ol className="space-y-6 relative" role="list">
              {milestones.map((m, i) => {
                const done = m.status === "done";
                const current = m.status === "current";
                return (
                  <motion.li key={m.id} variants={fadeInUp} className="flex items-start gap-5 pl-14 relative" role="listitem">
                    <div
                      className="absolute left-3 w-5 h-5 rounded-full border-2 flex items-center justify-center"
                      style={{
                        borderColor:     done ? "var(--success)" : current ? "var(--primary)" : "var(--border)",
                        backgroundColor: done ? "var(--success)" : current ? "var(--primary)" : "white",
                        zIndex: 1,
                      }}
                      aria-hidden="true"
                    >
                      {done && (
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                          <path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                      {current && <div className="w-2 h-2 rounded-full bg-white" aria-hidden="true" />}
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span
                          className="text-xs font-medium px-2.5 py-0.5 rounded-full"
                          style={{
                            backgroundColor: current ? "rgba(26,60,52,0.1)" : "rgba(229,221,210,0.5)",
                            color: current ? "var(--primary)" : "var(--muted)",
                          }}
                        >
                          {m.week_label}
                        </span>
                        {current && <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full" style={{ backgroundColor: "rgba(232,80,26,0.1)", color: "var(--accent)" }}>En cours</span>}
                        {done && <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full" style={{ backgroundColor: "rgba(26,127,75,0.1)", color: "var(--success)" }}>Terminé</span>}
                      </div>
                      <p
                        className="text-sm font-medium"
                        style={{ color: done ? "var(--muted)" : "var(--text)", textDecoration: done ? "line-through" : "none" }}
                      >
                        {m.title}
                      </p>
                    </div>
                  </motion.li>
                );
              })}
            </ol>
          </div>
        )}
      </motion.div>

      {/* Recommendations */}
      <motion.div variants={fadeInUp} className="bg-white rounded-2xl border p-6" style={{ borderColor: "var(--border)" }}>
        <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text)" }}>Recommandations personnalisées</h3>
        <div className="space-y-3">
          {DASHBOARD_RECOMMENDATIONS.map((rec, i) => (
            <div key={i} className="flex items-start gap-4 p-4 rounded-xl border-l-2" style={{ backgroundColor: "rgba(248,245,240,0.6)", borderLeftColor: rec.color }}>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>{rec.title}</p>
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: `${rec.color}18`, color: rec.color }}>{rec.tag}</span>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>{rec.body}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────
   Sidebar icons
───────────────────────────────────────────────────────── */
const SIDEBAR_ICONS: Record<string, React.ReactNode> = {
  "/dashboard": (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="2" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="9" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="2" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="9" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  "/dashboard/evaluation": (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 5v3l2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  "/dashboard/simulation": (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M4 3l9 5-9 5V3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  ),
  "/dashboard/rapport": (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M4 2h6l4 4v8H4V2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M10 2v4h4M6 9h4M6 11h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  "/dashboard/plan": (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8l3 3 7-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

/* ─────────────────────────────────────────────────────────
   Main page
───────────────────────────────────────────────────────── */
export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<DashboardTab>("overview");
  const [notifOpen, setNotifOpen] = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);

  const { notifications, readNotif } = useDashboard();
  const { profile } = useProfile();
  const { signOut } = useAuth();

  useEffect(() => {
    trackEvent(ANALYTICS_EVENTS.DASHBOARD_VIEWED);
  }, []);

  const unread = notifications.filter((n) => !n.read).length;

  const firstName = profile?.first_name || "Utilisateur";
  const lastName  = profile?.last_name || "";
  const role      = profile?.role || "Membre";
  const plan      = profile?.plan || "free";
  const initials  = (firstName[0] || "") + (lastName[0] || "");

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "var(--background)" }}>
      {/* ── Sidebar ── */}
      <aside
        className="hidden lg:flex flex-col w-64 border-r py-8 px-4"
        style={{ backgroundColor: "white", borderColor: "var(--border)", position: "sticky", top: 0, height: "100vh", overflowY: "auto" }}
      >
        <Link href="/" className="text-xl font-bold px-4 mb-8 block transition-opacity hover:opacity-75" style={{ color: "var(--text)" }}>
          {SITE_NAME}
        </Link>

        <nav className="flex-1 space-y-1">
          {SIDEBAR_NAV.map((item) => (
            <NavLink key={item.href} href={item.href} label={item.label} active={item.href === "/dashboard"} icon={SIDEBAR_ICONS[item.href]} />
          ))}
        </nav>

        <div className="space-y-3 mt-6">
          {plan === "free" && (
            <div className="p-4 rounded-xl" style={{ backgroundColor: "rgba(26,60,52,0.07)", border: "1px solid rgba(26,60,52,0.12)" }}>
              <p className="text-xs font-semibold mb-1" style={{ color: "var(--primary)" }}>Plan Gratuit</p>
              <p className="text-xs mb-3" style={{ color: "var(--muted)" }}>Passez en Pro pour tout débloquer.</p>
              <Link
                href="/register?plan=pro"
                className="block text-center text-xs font-semibold py-2 rounded-lg transition-all duration-200"
                style={{ backgroundColor: "var(--primary)", color: "white" }}
              >
                Passer en Pro
              </Link>
            </div>
          )}

          <div className="flex items-center gap-3 p-3 rounded-xl border" style={{ borderColor: "var(--border)" }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ backgroundColor: "var(--primary)", color: "white" }}>
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold truncate" style={{ color: "var(--text)" }}>{firstName} {lastName}</p>
              <p className="text-xs truncate" style={{ color: "var(--muted)" }}>{role}</p>
            </div>
            <button
              onClick={signOut}
              style={{ color: "var(--muted)" }}
              title="Déconnexion"
              className="hover:text-red-500 transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M9 2h3v10H9M6 4l-3 3 3 3M3 7h7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col min-w-0">
        <header
          className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 border-b"
          style={{ backgroundColor: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)", borderColor: "var(--border)" }}
        >
          <Link href="/" className="lg:hidden text-lg font-bold" style={{ color: "var(--text)" }}>
            {SITE_NAME}
          </Link>

          <div className="hidden lg:block">
            <h1 className="text-lg font-bold" style={{ color: "var(--text)" }}>
              Bonjour, {firstName} 👋
            </h1>
            <p className="text-xs" style={{ color: "var(--muted)" }}>
              Votre progression cette semaine est excellente.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setNotifOpen((p) => !p)}
                className="relative w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 border"
                style={{ borderColor: "var(--border)", backgroundColor: "white" }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 2a5 5 0 0 1 5 5v2l1 2H2l1-2V7a5 5 0 0 1 5-5z" stroke="var(--text)" strokeWidth="1.5" strokeLinejoin="round" />
                  <path d="M6 13a2 2 0 0 0 4 0" stroke="var(--text)" strokeWidth="1.5" />
                </svg>
                {unread > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-xs font-bold flex items-center justify-center" style={{ backgroundColor: "var(--accent)", color: "white" }}>
                    {unread}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {notifOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.97 }} transition={{ duration: 0.2 }}
                    className="absolute right-0 top-12 w-80 bg-white rounded-2xl border shadow-elevated z-50 p-4" style={{ borderColor: "var(--border)" }}
                  >
                    <p className="text-sm font-semibold mb-3" style={{ color: "var(--text)" }}>Notifications</p>
                    {notifications.length === 0 ? (
                      <p className="text-xs" style={{ color: "var(--muted)" }}>Aucune notification.</p>
                    ) : (
                      <ul className="space-y-3">
                        {notifications.map((n) => (
                          <li
                            key={n.id}
                            className="flex items-start gap-3 p-3 rounded-xl transition-colors cursor-pointer"
                            style={{ backgroundColor: n.read ? "transparent" : "rgba(26,60,52,0.04)", opacity: n.read ? 0.6 : 1 }}
                            onClick={() => !n.read && readNotif(n.id)}
                          >
                            <NotifDot type={n.type} />
                            <div>
                              <p className="text-xs font-semibold" style={{ color: "var(--text)" }}>{n.title}</p>
                              <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>{n.body}</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              href="/dashboard/evaluation"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200"
              style={{ backgroundColor: "var(--primary)", color: "white" }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              Nouvelle évaluation
            </Link>

            <button
              className="lg:hidden w-9 h-9 rounded-xl flex items-center justify-center border"
              style={{ borderColor: "var(--border)", backgroundColor: "white" }}
              onClick={() => setMenuOpen((p) => !p)}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 4h12M2 8h12M2 12h12" stroke="var(--text)" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </header>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}
              className="lg:hidden border-b px-4 py-3 space-y-1 absolute w-full z-10"
              style={{ backgroundColor: "white", borderColor: "var(--border)", top: "69px" }}
            >
              {SIDEBAR_NAV.map((link) => (
                <Link key={link.href} href={link.href} className="block px-4 py-2.5 rounded-xl text-sm font-medium" style={{ color: "var(--text)" }} onClick={() => setMenuOpen(false)}>
                  {link.label}
                </Link>
              ))}
              <button
                className="block w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium text-red-500"
                onClick={() => { signOut(); setMenuOpen(false); }}
              >
                Déconnexion
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <main className="flex-1 p-6 lg:p-8 max-w-6xl w-full mx-auto" id="main-content">
          <div className="flex gap-1 p-1 rounded-xl mb-8 overflow-x-auto" style={{ backgroundColor: "white", border: "1px solid var(--border)" }}>
            {DASHBOARD_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as DashboardTab)}
                className="px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all duration-200"
                style={{ backgroundColor: activeTab === tab.id ? "rgba(26,60,52,0.1)" : "transparent", color: activeTab === tab.id ? "var(--primary)" : "var(--muted)" }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeTab === "overview" && <OverviewPanel />}
            {activeTab === "competences" && <CompetencesPanel />}
            {activeTab === "progression" && <ProgressionPanel />}
            {activeTab === "plan" && <PlanPanel />}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
