"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar,
} from "recharts";
import { staggerContainer, fadeInUp, scaleIn, VIEWPORT_CONFIG } from "@/lib/motion";
import { RADAR_DATA, PROGRESSION_DATA, STRESS_DATA } from "@/lib/constants";

const TABS = [
  { id: "overview",        label: "Vue d'ensemble",  locked: false },
  { id: "skills",          label: "Compétences",      locked: true  },
  { id: "progression",     label: "Progression",      locked: true  },
  { id: "recommendations", label: "Recommandations",  locked: true  },
];

function ScoreCard({
  label, value, unit, color, detail,
}: {
  label: string; value: number; unit: string; color: string; detail: string;
}) {
  return (
    <motion.div
      variants={scaleIn}
      className="p-5 rounded-xl border"
      style={{ borderColor: "var(--border)", backgroundColor: "rgba(248,245,240,0.5)" }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
    >
      <p className="text-xs font-medium uppercase tracking-wide mb-2" style={{ color: "var(--muted)" }}>
        {label}
      </p>
      <div className="flex items-end gap-1">
        <span className="text-3xl font-bold" style={{ color }}>{value}</span>
        <span className="text-sm mb-1" style={{ color: "var(--muted)" }}>{unit}</span>
      </div>
      <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>{detail}</p>
    </motion.div>
  );
}

const tooltipStyle = {
  backgroundColor: "white",
  border: "1px solid var(--border)",
  borderRadius: "8px",
  fontSize: "12px",
};

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <section
      className="section-padding"
      aria-labelledby="dashboard-heading"
      style={{ backgroundColor: "var(--text)" }}
    >
      <div className="section-container">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_CONFIG}
        >
          {/* Header */}
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <span
              className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-medium tracking-widest uppercase mb-4"
              style={{
                backgroundColor: "rgba(26,60,52,0.2)",
                color: "var(--primary-light)",
                border: "1px solid rgba(26,60,52,0.3)",
              }}
            >
              Tableau de bord
            </span>
            <h2
              id="dashboard-heading"
              className="heading-2 text-balance"
              style={{ color: "white" }}
            >
              Votre tableau de bord personnel.{" "}
              <span style={{ color: "var(--accent)" }}>
                Tout ce que vous devez savoir, en un regard.
              </span>
            </h2>
            <p className="mt-4 text-lg max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.6)" }}>
              Chaque dimension de votre profil, analysée et présentée avec clarté.
            </p>
          </motion.div>

          {/* Chrome window */}
          <motion.div
            variants={scaleIn}
            className="bg-white rounded-2xl overflow-hidden"
            style={{
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 0 80px rgba(26,60,52,0.18)",
            }}
          >
            {/* Title bar */}
            <div
              className="flex items-center justify-between px-6 py-4 border-b"
              style={{ borderColor: "var(--border)" }}
            >
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5" aria-hidden="true">
                  {["#FF5F56", "#FFBD2E", "#27C93F"].map((c) => (
                    <div key={c} className="w-3 h-3 rounded-full" style={{ backgroundColor: c }} />
                  ))}
                </div>
                <span className="text-sm font-medium" style={{ color: "var(--muted)" }}>
                  trajectoire.app/dashboard
                </span>
              </div>
              <div
                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                style={{ backgroundColor: "rgba(26,127,75,0.12)", color: "var(--success)" }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current" aria-hidden="true" />
                Analyse complète
              </div>
            </div>

            {/* Tabs */}
            <div
              className="flex gap-1 px-6 py-3 border-b overflow-x-auto"
              style={{ borderColor: "var(--border)" }}
              role="tablist"
              aria-label="Sections du tableau de bord"
            >
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  aria-controls={`panel-${tab.id}`}
                  id={`tab-${tab.id}`}
                  onClick={() => { if (!tab.locked) setActiveTab(tab.id); }}
                  disabled={tab.locked}
                  title={tab.locked ? "Disponible après inscription" : undefined}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap"
                  style={{
                    backgroundColor: activeTab === tab.id ? "var(--primary)" : "transparent",
                    color: activeTab === tab.id
                      ? "white"
                      : tab.locked ? "rgba(98,98,98,0.35)" : "var(--muted)",
                    cursor: tab.locked ? "not-allowed" : "pointer",
                  }}
                >
                  {tab.label}
                  {tab.locked && (
                    <span className="ml-1.5 text-xs" aria-label="Disponible après inscription">
                      🔒
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Panel */}
            <div
              id="panel-overview"
              role="tabpanel"
              aria-labelledby="tab-overview"
              className="p-6 lg:p-8"
            >
              {/* Score cards */}
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={VIEWPORT_CONFIG}
                className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
              >
                <ScoreCard label="Confiance"   value={78} unit="/100" color="var(--primary)" detail="↑ +12 pts ce mois" />
                <ScoreCard label="Stress"      value={32} unit="%"    color="var(--accent)"  detail="↓ Niveau maîtrisé" />
                <ScoreCard label="Préparation" value={85} unit="/100" color="var(--success)" detail="↑ Excellent niveau" />
                <ScoreCard label="Décision"    value={91} unit="/100" color="var(--warning)" detail="★ Point fort majeur" />
              </motion.div>

              {/* Radar + Area */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <motion.div variants={fadeInUp} className="p-5 rounded-xl border" style={{ borderColor: "var(--border)" }}>
                  <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text)" }}>
                    Analyse comportementale — 8 dimensions
                  </h3>
                  <div style={{ height: 240 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={RADAR_DATA}>
                        <PolarGrid stroke="var(--border)" />
                        <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: "var(--muted)" }} />
                        <Radar
                          name="Profil" dataKey="value"
                          stroke="var(--primary)" fill="var(--primary)"
                          fillOpacity={0.15} strokeWidth={2}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>

                <motion.div variants={fadeInUp} className="p-5 rounded-xl border" style={{ borderColor: "var(--border)" }}>
                  <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text)" }}>
                    Progression sur 8 semaines
                  </h3>
                  <div style={{ height: 240 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={PROGRESSION_DATA}>
                        <defs>
                          <linearGradient id="gConf" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%"  stopColor="var(--primary)" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="gPrep" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%"  stopColor="var(--success)" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="var(--success)" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(229,221,210,0.5)" />
                        <XAxis dataKey="week" tick={{ fontSize: 11, fill: "var(--muted)" }} />
                        <YAxis domain={[40, 100]} tick={{ fontSize: 11, fill: "var(--muted)" }} />
                        <Tooltip contentStyle={tooltipStyle} />
                        <Area type="monotone" dataKey="confidence"   name="Confiance"   stroke="var(--primary)" strokeWidth={2} fill="url(#gConf)" />
                        <Area type="monotone" dataKey="preparedness" name="Préparation" stroke="var(--success)" strokeWidth={2} fill="url(#gPrep)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
              </div>

              {/* Bar */}
              <motion.div variants={fadeInUp} className="p-5 rounded-xl border" style={{ borderColor: "var(--border)" }}>
                <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text)" }}>
                  Gestion de la pression par contexte
                </h3>
                <div style={{ height: 180 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={STRESS_DATA} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(229,221,210,0.5)" />
                      <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: "var(--muted)" }} />
                      <YAxis type="category" dataKey="category" tick={{ fontSize: 11, fill: "var(--muted)" }} width={128} />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Bar dataKey="value" name="Score" fill="var(--primary)" radius={[0, 4, 4, 0]} fillOpacity={0.85} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Sub-CTA */}
          <motion.div variants={fadeInUp} className="text-center mt-8">
            <a
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-base transition-all duration-200"
              style={{ backgroundColor: "white", color: "var(--primary)" }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.boxShadow = "0 8px 32px rgba(255,255,255,0.18)";
                el.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.boxShadow = "none";
                el.style.transform = "translateY(0)";
              }}
            >
              Obtenir mon tableau de bord
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <p className="text-sm mt-3" style={{ color: "rgba(255,255,255,0.35)" }}>
              Gratuit · Sans engagement · Résultats immédiats
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
