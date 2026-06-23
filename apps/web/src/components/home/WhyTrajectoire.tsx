"use client";

import { CheckCircle2, XCircle } from "lucide-react";
import { Container, SectionHeader, Card } from "@/components/ui";

const COMPARISON_DATA = [
  {
    feature: "Processus de décision",
    classic: "Basé sur l'intuition et l'avis d'un réseau restreint",
    trajectoire: "Objectivé par des données comportementales",
  },
  {
    feature: "Méthode d'évaluation",
    classic: "Avis isolés ou tests psychométriques génériques",
    trajectoire: "Simulations ciblées et analyse structurée",
  },
  {
    feature: "Fiabilité",
    classic: "Haut risque de biais cognitifs",
    trajectoire: "Évaluation neutre, sans biais",
  },
  {
    feature: "Accompagnement",
    classic: "Coaching ponctuel et souvent onéreux",
    trajectoire: "Suivi continu, accessible à tout moment",
  },
];

export default function WhyTrajectoire() {
  return (
    <section id="why" className="py-16 bg-white">
      <Container>
        <SectionHeader
          badge="Le problème"
          badgeVariant="warning"
          title="Pourquoi choisir Trajectoire ?"
          description="Une approche radicalement différente pour sécuriser vos prochaines étapes."
          className="mb-16"
        />

        <div className="max-w-5xl mx-auto">
          <div className="hidden md:grid grid-cols-12 gap-4 mb-4 px-6 text-sm font-bold uppercase tracking-wider text-ink-subtle">
            <div className="col-span-4">Domaine</div>
            <div className="col-span-4">Approche classique</div>
            <div className="col-span-4 text-brand-primary">Avec Trajectoire</div>
          </div>

          <Card variant="default" padding="none" className="overflow-hidden">
            {COMPARISON_DATA.map((item, idx) => (
              <div
                key={idx}
                className={`grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-0 p-6 md:p-0 md:items-center ${
                  idx !== COMPARISON_DATA.length - 1 ? "border-b border-border" : ""
                }`}
              >
                {/* Feature Name */}
                <div className="md:col-span-4 md:p-6 font-semibold text-ink">
                  {item.feature}
                </div>

                {/* Classic Approach */}
                <div className="md:col-span-4 md:p-6 text-ink-muted bg-surface-muted/30 flex items-start gap-3">
                  <XCircle size={18} className="text-ink-subtle mt-0.5 flex-shrink-0" />
                  <span className="text-body-sm">{item.classic}</span>
                </div>

                {/* Trajectoire Approach */}
                <div className="md:col-span-4 md:p-6 text-brand-primary bg-glass-primary-06 flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-success mt-0.5 flex-shrink-0" />
                  <span className="text-body-sm font-medium">{item.trajectoire}</span>
                </div>
              </div>
            ))}
          </Card>
        </div>
      </Container>
    </section>
  );
}
