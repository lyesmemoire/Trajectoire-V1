"use client";

import { ArrowRight, CheckCircle2 } from "lucide-react";
import { trackEvent } from "@/lib/analytics/trackEvent";
import { ANALYTICS_EVENTS } from "@/lib/analytics/events";
import { LinkButton, Container, Badge } from "@/components/ui";

const BADGES = [
  "Évaluation Comportementale",
  "Préparation Stratégique",
  "Données, pas intuition",
];

const GUARANTEES = [
  "Gratuit pour commencer",
  "Aucune carte bancaire",
  "Résultats en 10 minutes",
];

export default function Hero() {
  return (
    <section className="relative min-h-[calc(100vh-80px)] flex items-center overflow-hidden pt-32 pb-20 bg-surface-muted">

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
        <div className="max-w-3xl mx-auto text-center">

          {/* Badges */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {BADGES.map((badge) => (
              <Badge key={badge} variant="primary" uppercase>
                {badge}
              </Badge>
            ))}
          </div>

          {/* Titre */}
          <h1 className="text-display-1 text-balance text-ink mb-6">
            Décidez avec plus de clarté.
            <br />
            Même lorsque la pression est forte.
          </h1>

          {/* Sous-titre */}
          <p className="text-body-lg text-ink-muted max-w-2xl mx-auto mb-10">
            Trajectoire vous aide à prendre les bonnes décisions, au bon moment, avec clarté et confiance.
          </p>

          {/* CTA */}
          <div className="flex flex-col items-center gap-4 mb-10">
            <LinkButton
              href="/register"
              variant="accent"
              size="xl"
              rightIcon={<ArrowRight size={20} />}
              onClick={() => { trackEvent(ANALYTICS_EVENTS.HERO_CTA_CLICKED); }}
            >
              Démarrer gratuitement
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

          {/* Garanties */}
          <div className="flex flex-wrap items-center justify-center gap-6">
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
      </Container>
    </section>
  );
}
