"use client";

import { TrendingUp, Users, Award, Clock } from "lucide-react";
import { Container, SectionHeader, Card } from "@/components/ui";

const HEADLINE_STATS = [
  {
    value: "94%",
    label: "se sentent prêts",
    sublabel: "avant un moment décisif",
    icon: Award,
  },
  {
    value: "+26",
    label: "points de confiance",
    sublabel: "en moyenne sur 8 semaines",
    icon: TrendingUp,
  },
  {
    value: "2 400+",
    label: "cadres accompagnés",
    sublabel: "depuis le lancement",
    icon: Users,
  },
  {
    value: "8/10",
    label: "obtiennent leur objectif",
    sublabel: "promotion, mobilité, négociation",
    icon: Clock,
  },
];

const DETAILED_RESULTS = [
  {
    metric: "Préparation aux entretiens",
    before: 42,
    after: 89,
    unit: "%",
  },
  {
    metric: "Clarté sur ses forces",
    before: 38,
    after: 92,
    unit: "%",
  },
  {
    metric: "Gestion du stress en situation",
    before: 51,
    after: 84,
    unit: "%",
  },
  {
    metric: "Cohérence CV / discours",
    before: 47,
    after: 95,
    unit: "%",
  },
];

export default function Results() {
  return (
    <section id="results" className="py-24 lg:py-32 bg-surface-muted pt-0 lg:pt-0">
      <Container>
        <SectionHeader
          badge="Les résultats parlent"
          badgeVariant="primary"
          title={<>Ce que vivent les cadres qui utilisent <span className="text-brand-accent italic">Trajectoire</span>.</>}
          description="Chiffres mesurés sur les 2 400+ parcours suivis depuis le lancement. Mise à jour mensuelle."
          className="mb-16"
        />

        <div className="max-w-5xl mx-auto flex flex-col gap-8">
          {/* Headline Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {HEADLINE_STATS.map(({ value, label, sublabel, icon: Icon }) => (
              <Card key={label} variant="default" padding="lg" hover className="flex flex-col border-border">
                <div className="w-10 h-10 rounded-xl bg-brand-accent/10 flex items-center justify-center mb-5 text-brand-accent">
                  <Icon size={20} />
                </div>
                {/* Hiérarchie typographique alignée sur le design system */}
                <div className="text-display-2 font-bold leading-none tracking-tight text-ink mb-2">
                  {value}
                </div>
                <div className="font-bold text-sm text-ink mb-1">
                  {label}
                </div>
                <div className="text-xs text-ink-subtle">
                  {sublabel}
                </div>
              </Card>
            ))}
          </div>

          {/* Detailed Results — Avant / Après */}
          <Card variant="default" padding="xl" className="border-border">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-10 border-b border-border pb-6">
              <div>
                <div className="font-bold text-xs tracking-widest uppercase mb-3 text-brand-accent">
                  Avant → Après
                </div>
                <h3 className="text-heading-3 text-ink">
                  Progression moyenne sur 8 semaines de programme.
                </h3>
              </div>
              <div className="flex items-center gap-6 text-xs font-bold tracking-wider uppercase text-ink-subtle">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-surface-muted border border-border" />
                  Avant
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-brand-accent" />
                  Après
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-8">
              {DETAILED_RESULTS.map(({ metric, before, after, unit }) => {
                const gain = after - before;
                return (
                  <div key={metric}>
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-bold text-sm text-ink">
                        {metric}
                      </span>
                      <span className="font-bold text-sm text-brand-accent">
                        +{gain}{unit}
                      </span>
                    </div>

                    {/* Barre de progression — largeurs dynamiques (style inline nécessaire) */}
                    <div
                      className="relative h-3 rounded-full bg-surface-muted overflow-hidden"
                      role="progressbar"
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={after}
                      aria-label={`${metric} : ${before}${unit} avant, ${after}${unit} après`}
                    >
                      {/* Avant */}
                      <div
                        className="absolute top-0 left-0 h-full rounded-full bg-border-subtle"
                        style={{ width: `${before}%` }}
                        aria-hidden="true"
                      />
                      {/* Après */}
                      <div
                        className="absolute top-0 left-0 h-full rounded-full transition-all duration-1000 bg-brand-accent"
                        style={{ width: `${after}%` }}
                        aria-hidden="true"
                      />
                    </div>

                    <div className="flex items-center justify-between mt-2 text-xs font-medium text-ink-muted">
                      <span>{before}{unit}</span>
                      <span className="text-ink font-bold">{after}{unit}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Note de transparence — honnêteté des chiffres */}
            <p className="text-xs text-ink-subtle mt-8 pt-6 border-t border-border-subtle">
              <span className="font-semibold text-ink-muted">Méthodologie :</span> autoévaluations
              déclaratives recueillies en début et fin de programme sur les parcours clôturés
              (n = 2 412). Les pourcentages d&apos;atteinte d&apos;objectif sont mesurés à 90 jours post-programme.
            </p>
          </Card>
        </div>
      </Container>
    </section>
  );
}
