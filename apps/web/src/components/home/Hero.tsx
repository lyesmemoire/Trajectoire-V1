"use client";

import {
  ArrowRight,
  Target,
  Brain,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";
import { trackEvent } from "@/lib/analytics/trackEvent";
import { ANALYTICS_EVENTS } from "@/lib/analytics/events";
import { LinkButton, Container, Badge, Card } from "@/components/ui";

const BADGES = [
  "Évaluation Comportementale",
  "Préparation Stratégique",
  "Données, pas intuition",
];

const PROGRESSION_DATA = [
  { week: "S1", value: 45 },
  { week: "S2", value: 52 },
  { week: "S3", value: 58 },
  { week: "S4", value: 67 },
  { week: "S5", value: 74 },
  { week: "S6", value: 82 },
  { week: "S7", value: 88 },
  { week: "S8", value: 94 },
];

const INSIGHTS = [
  "Posture exécutive renforcée",
  "Gestion du stress maîtrisée",
  "Cohérence CV / discours validée",
];

const GUARANTEES = [
  "Gratuit pour commencer",
  "Aucune carte bancaire",
  "Résultats en 10 minutes",
];

export default function Hero() {
  const maxValue = Math.max(...PROGRESSION_DATA.map((d) => d.value));

  return (
    <section className="relative min-h-[calc(100vh-80px)] flex items-center overflow-hidden pt-32 pb-16 bg-surface-muted">

      {/* Backgrounds décoratifs */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 70% 40%, rgba(26,60,52,0.05) 0%, transparent 60%)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 40% 30% at 30% 70%, rgba(232,80,26,0.03) 0%, transparent 60%)",
        }}
      />

      <Container className="relative">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">

          {/* ── Colonne gauche ── */}
          <div className="flex flex-col gap-7">

            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              {BADGES.map((badge) => (
                <Badge key={badge} variant="primary" uppercase>
                  {badge}
                </Badge>
              ))}
            </div>

            {/* Titre */}
            <h1 className="text-display-1 text-balance text-ink max-w-2xl">
              Préparez vos{" "}
              <span className="text-brand-primary">décisions de carrière</span>{" "}
              avec{" "}
              <span className="text-brand-accent italic">confiance</span>.
            </h1>

            {/* Sous-titre */}
            <p className="text-body-lg text-ink-muted max-w-xl">
              Cadres, managers et professionnels expérimentés utilisent
              Trajectoire pour évaluer leurs forces comportementales, simuler
              les moments à fort enjeu et prendre leurs décisions de carrière
              avec clarté et méthode.{" "}
              <strong className="text-ink">Pas d&apos;intuition. Des données.</strong>
            </p>

            {/* CTA */}
            <div className="flex flex-col items-start gap-4">
              <div className="flex flex-wrap items-center gap-5">
                <LinkButton
                  href="/register"
                  variant="accent"
                  size="xl"
                  rightIcon={<ArrowRight size={20} />}
                  onClick={() => { trackEvent(ANALYTICS_EVENTS.HERO_CTA_CLICKED); }}
                >
                  Démarrer mon évaluation
                </LinkButton>

                <a
                  href="#method"
                  onClick={(e) => {
                    e.preventDefault();
                    const target = document.querySelector("#method");
                    if (target) {
                      const offset = target.getBoundingClientRect().top + window.scrollY - 100;
                      window.scrollTo({ top: offset, behavior: "smooth" });
                    }
                  }}
                  className="inline-flex items-center gap-2 text-body font-medium text-brand-primary hover:text-brand-primary-hover transition-colors"
                >
                  Découvrir la méthode
                  <ArrowRight size={18} />
                </a>
              </div>
              <p className="text-sm font-medium text-ink-subtle pl-1">
                Aucune carte bancaire requise • Résultats en 10 min
              </p>
            </div>

            {/* Garanties */}
            <div className="flex flex-wrap items-center gap-6 mt-2">
              {GUARANTEES.map((label) => (
                <div
                  key={label}
                  className="flex items-center gap-2 text-body-sm text-ink-muted"
                >
                  <CheckCircle2 size={16} className="text-success" />
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* ── Colonne droite — Dashboard ── */}
          <div className="w-full">
            <Card
              variant="default"
              padding="none"
              className="overflow-hidden shadow-hero rounded-3xl"
            >
              {/* Header dashboard */}
              <div className="flex items-center justify-between px-7 py-5 border-b border-border bg-surface-muted">
                <div>
                  <div className="text-micro font-bold uppercase tracking-widest text-ink-muted">
                    Tableau de bord
                  </div>
                  <div className="text-body-sm font-semibold mt-0.5 text-ink">
                    Sophie M. — Directrice Marketing
                  </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-success-light">
                  <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  <span className="text-xs font-semibold text-success">
                    PRÊTE
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-7 flex flex-col gap-7">

                {/* KPIs */}
                <div className="grid grid-cols-3 gap-4">
                  <KpiCard
                    icon={<Target size={16} />}
                    iconColor="text-brand-primary"
                    label="Confiance"
                    value="94%"
                    sublabel="↑ +26 pts en 8 sem."
                    sublabelColor="text-success"
                  />
                  <KpiCard
                    icon={<Brain size={16} />}
                    iconColor="text-brand-accent"
                    label="Clarté"
                    value="Élevée"
                    sublabel="Score 8.9/10"
                    sublabelColor="text-ink-muted"
                  />
                  <KpiCard
                    icon={<TrendingUp size={16} />}
                    iconColor="text-success"
                    label="Préparation"
                    value="85%"
                    sublabel="12 simulations"
                    sublabelColor="text-ink-muted"
                  />
                </div>

                {/* Graphique */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                      Progression sur 8 semaines
                    </span>
                    <span className="text-xs font-semibold text-success">
                      +49 pts
                    </span>
                  </div>
                  <div
                    className="flex items-end gap-2 p-4 rounded-2xl bg-surface-muted"
                    style={{ height: "176px" }}
                  >
                    {PROGRESSION_DATA.map((d, i) => (
                      <div
                        key={d.week}
                        className="flex-1 flex flex-col items-center gap-2 h-full justify-end"
                      >
                        <div
                          className={`w-full rounded-t-lg transition-all duration-500 ${
                            i === PROGRESSION_DATA.length - 1
                              ? "bg-brand-accent"
                              : "bg-brand-primary"
                          }`}
                          style={{
                            height: `${(d.value / maxValue) * 100}%`,
                            minHeight: "20px",
                            opacity:
                              i === PROGRESSION_DATA.length - 1
                                ? 1
                                : 0.55 + i * 0.05,
                          }}
                        />
                        <span className="text-[10px] font-medium text-ink-muted">
                          {d.week}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Insights */}
                <div className="flex flex-col gap-2.5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted mb-1">
                    Insights comportementaux
                  </span>
                  {INSIGHTS.map((insight) => (
                    <div
                      key={insight}
                      className="flex items-center gap-3 p-4 rounded-xl bg-surface-muted"
                    >
                      <CheckCircle2
                        size={18}
                        className="text-success flex-shrink-0"
                      />
                      <span className="text-body-sm font-medium text-ink">
                        {insight}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

        </div>
      </Container>
    </section>
  );
}

// ─────────────────────────────────────────────
// Sub-component : KPI Card du dashboard
// ─────────────────────────────────────────────

function KpiCard({
  icon,
  iconColor,
  label,
  value,
  sublabel,
  sublabelColor,
}: {
  icon: React.ReactNode;
  iconColor: string;
  label: string;
  value: string;
  sublabel: string;
  sublabelColor: string;
}) {
  return (
    <div className="p-5 rounded-2xl bg-surface-muted">
      <div className="flex items-center gap-2 mb-3">
        <span className={iconColor}>{icon}</span>
        <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
          {label}
        </span>
      </div>
      <div className="font-bold text-[28px] leading-none text-ink">
        {value}
      </div>
      <div className={`text-xs mt-2 ${sublabelColor}`}>{sublabel}</div>
    </div>
  );
}
