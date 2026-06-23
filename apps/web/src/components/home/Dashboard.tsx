"use client";

import { useState, useEffect } from "react";
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar,
} from "recharts";
import { RADAR_DATA, PROGRESSION_DATA, STRESS_DATA } from "@/lib/constants";
import { Container, SectionHeader, Card, ChartContainer, Badge } from "@/components/ui";

// Recharts tooltip styles — déplacé vers un objet sérialisable compatible SSR
// (les variables CSS restent résolues côté client, pas d'hydratation mismatch)
const tooltipStyle = {
  backgroundColor: "var(--color-surface-elevated)",
  border: "1px solid var(--color-border-subtle)",
  borderRadius: "12px",
  fontSize: "12px",
  boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
  color: "var(--color-ink)",
};

const TABS = [
  { id: "overview",        label: "Vue d'ensemble",  locked: false },
  { id: "skills",          label: "Compétences",     locked: true  },
  { id: "progression",     label: "Progression",     locked: true  },
  { id: "recommendations", label: "Recommandations", locked: true  },
];

// 3 points colorés de la barre de titre — palette neutralisée (design system)
const TRAFFIC_DOTS = [
  { bg: "bg-[var(--color-danger)]",    label: "Fermer" },
  { bg: "bg-[var(--color-warning)]",   label: "Réduire" },
  { bg: "bg-[var(--color-success)]",   label: "Agrandir" },
];

function ScoreCard({
  label, value, unit, detail, isAccent = false,
}: {
  label: string; value: number; unit: string; detail: string; isAccent?: boolean;
}) {
  return (
    <Card variant="default" padding="md" hover>
      <p className="text-xs font-semibold uppercase tracking-wide mb-2 text-ink-muted">
        {label}
      </p>
      <div className="flex items-end gap-1 mb-1">
        <span
          className={`text-3xl font-bold tracking-tight ${
            isAccent ? "text-brand-accent" : "text-brand-primary"
          }`}
        >
          {value}
        </span>
        <span className="text-sm text-ink-muted mb-1">{unit}</span>
      </div>
      <p className="text-xs text-ink-subtle">{detail}</p>
    </Card>
  );
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="py-24 lg:py-32 bg-surface-muted">
      <Container>
        <SectionHeader
          badge="Tableau de bord"
          badgeVariant="primary"
          title={<>Votre profil. <span className="text-brand-accent">Objectivé.</span></>}
          description="Chaque dimension de votre comportement analysée et présentée avec clarté."
          className="mb-16"
        />

        <div className="max-w-5xl mx-auto">
          <Card variant="default" padding="none" className="overflow-hidden shadow-elevated">
            {/* Title bar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface-muted/30">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5" aria-hidden="true">
                  {TRAFFIC_DOTS.map((dot) => (
                    <div key={dot.label} className={`w-3 h-3 rounded-full ${dot.bg}`} />
                  ))}
                </div>
                <span className="text-sm font-medium text-ink-muted hidden sm:block">
                  trajectoire.app/dashboard
                </span>
              </div>
              <Badge variant="success">Analyse complétée</Badge>
            </div>

            {/* Tabs */}
            <div
              className="flex gap-2 px-6 py-3 border-b border-border overflow-x-auto hide-scrollbar bg-surface-muted/10"
              role="tablist"
              aria-label="Sections du tableau de bord"
            >
              {TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    role="tab"
                    aria-selected={isActive}
                    aria-disabled={tab.locked}
                    onClick={() => { if (!tab.locked) setActiveTab(tab.id); }}
                    disabled={tab.locked}
                    className={[
                      "px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200",
                      "whitespace-nowrap flex items-center gap-1.5",
                      isActive
                        ? "bg-brand-primary text-[var(--color-on-brand)] shadow-soft"
                        : tab.locked
                        ? "text-ink-subtle opacity-60 cursor-not-allowed"
                        : "text-ink-muted hover:text-ink hover:bg-border-subtle",
                    ].join(" ")}
                  >
                    {tab.label}
                    {tab.locked && (
                      <span aria-label="Verrouillé" className="text-xs">🔒</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Panel Content */}
            <div className="p-6 lg:p-8 bg-white">
              {/* Score cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <ScoreCard label="Confiance"   value={78} unit="/100" detail="↑ +12 pts ce mois" />
                <ScoreCard label="Stress"      value={32} unit="%"    detail="↓ Niveau maîtrisé" isAccent />
                <ScoreCard label="Préparation" value={85} unit="/100" detail="↑ Excellent niveau" />
                <ScoreCard label="Décision"    value={91} unit="/100" detail="★ Point fort majeur" />
              </div>

              {/* Charts Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

                {/* Radar Chart */}
                <Card variant="default" padding="md" className="border-border">
                  <h3 className="text-sm font-bold text-ink mb-6">Analyse comportementale</h3>
                  {mounted ? (
                    <ChartContainer height={280}>
                      <RadarChart
                        data={RADAR_DATA}
                        role="img"
                        aria-label="Diagramme radar montrant le profil comportemental sur 5 dimensions"
                      >
                        <title>Analyse comportementale</title>
                        <PolarGrid stroke="var(--color-border)" />
                        <PolarAngleAxis
                          dataKey="subject"
                          tick={{ fontSize: 11, fill: "var(--color-ink-muted)" }}
                        />
                        <Radar
                          name="Profil"
                          dataKey="value"
                          stroke="var(--color-brand-primary)"
                          fill="var(--color-brand-primary)"
                          fillOpacity={0.15}
                          strokeWidth={2}
                        />
                      </RadarChart>
                    </ChartContainer>
                  ) : (
                    /* Skeleton à hauteur fixe pour éviter le warning Recharts au mount */
                    <div
                      className="w-full rounded-lg bg-surface-muted/40 animate-pulse"
                      style={{ height: 280, minHeight: 280 }}
                      aria-hidden="true"
                    />
                  )}
                </Card>

                {/* Area Chart */}
                <Card variant="default" padding="md" className="border-border">
                  <h3 className="text-sm font-bold text-ink mb-6">Progression</h3>
                  {mounted ? (
                    <ChartContainer height={280}>
                      <AreaChart
                        data={PROGRESSION_DATA}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                        role="img"
                        aria-label="Courbe de progression de la confiance et de la préparation sur plusieurs semaines"
                      >
                        <title>Progression</title>
                        <defs>
                          <linearGradient id="gConf" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%"  stopColor="var(--color-brand-primary)" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="var(--color-brand-primary)" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="gPrep" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%"  stopColor="var(--color-success)" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="var(--color-success)" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                        <XAxis
                          dataKey="week"
                          tick={{ fontSize: 11, fill: "var(--color-ink-muted)" }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          domain={[40, 100]}
                          tick={{ fontSize: 11, fill: "var(--color-ink-muted)" }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <Tooltip
                          contentStyle={tooltipStyle}
                          cursor={{ stroke: "var(--color-border)", strokeWidth: 1 }}
                        />
                        <Area
                          type="monotone"
                          dataKey="confidence"
                          name="Confiance"
                          stroke="var(--color-brand-primary)"
                          strokeWidth={2}
                          fill="url(#gConf)"
                        />
                        <Area
                          type="monotone"
                          dataKey="preparedness"
                          name="Préparation"
                          stroke="var(--color-success)"
                          strokeWidth={2}
                          fill="url(#gPrep)"
                        />
                      </AreaChart>
                    </ChartContainer>
                  ) : (
                    <div
                      className="w-full rounded-lg bg-surface-muted/40 animate-pulse"
                      style={{ height: 280, minHeight: 280 }}
                      aria-hidden="true"
                    />
                  )}
                </Card>

              </div>

              {/* Bar Chart */}
              <Card variant="default" padding="md" className="border-border">
                <h3 className="text-sm font-bold text-ink mb-6">Gestion de la pression par contexte</h3>
                {mounted ? (
                  <ChartContainer height={200}>
                    <BarChart
                      data={STRESS_DATA}
                      layout="vertical"
                      margin={{ top: 0, right: 20, left: 0, bottom: 0 }}
                      role="img"
                      aria-label="Diagramme en barres horizontales montrant le score de gestion de la pression par contexte"
                    >
                      <title>Gestion de la pression par contexte</title>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--color-border)" />
                      <XAxis
                        type="number"
                        domain={[0, 100]}
                        tick={{ fontSize: 11, fill: "var(--color-ink-muted)" }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        type="category"
                        dataKey="category"
                        tick={{ fontSize: 11, fill: "var(--color-ink-muted)", fontWeight: 500 }}
                        width={120}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        contentStyle={tooltipStyle}
                        cursor={{ fill: "var(--color-surface-muted)", opacity: 0.5 }}
                      />
                      <Bar
                        dataKey="value"
                        name="Score"
                        fill="var(--color-brand-primary)"
                        radius={[0, 4, 4, 0]}
                        barSize={24}
                      />
                    </BarChart>
                  </ChartContainer>
                ) : (
                  <div
                    className="w-full rounded-lg bg-surface-muted/40 animate-pulse"
                    style={{ height: 200, minHeight: 200 }}
                    aria-hidden="true"
                  />
                )}
              </Card>
            </div>
          </Card>
        </div>
      </Container>
    </section>
  );
}
