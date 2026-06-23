"use client";

import { useState } from "react";
import { Check, Sparkles, ArrowRight } from "lucide-react";
import { trackEvent } from "@/lib/analytics/trackEvent";
import { ANALYTICS_EVENTS } from "@/lib/analytics/events";
import { Container, SectionHeader, Card, LinkButton } from "@/components/ui";

const PLANS = [
  {
    name: "Essentiel",
    tagline: "Pour clarifier votre prochaine décision",
    priceMonthly: 29,
    priceYearly: 290,
    description: "L'évaluation comportementale complète + plan d'action personnalisé.",
    features: [
      "Évaluation Career DNA complète",
      "Profil comportemental détaillé",
      "Cartographie de vos forces",
      "Plan d'action sur 4 semaines",
      "Accès au coaching IA (50 questions/mois)",
      "Support email sous 24h",
    ],
    cta: "Démarrer l'évaluation",
    highlight: false,
  },
  {
    name: "Cadre",
    tagline: "Pour préparer un moment à fort enjeu",
    priceMonthly: 79,
    priceYearly: 790,
    description: "Tout l'Essentiel + simulations vidéo illimitées + coaching IA contextuel.",
    features: [
      "Tout ce qui est inclus dans Essentiel",
      "Simulations vidéo illimitées",
      "Analyse comportementale en direct",
      "Coaching IA contextuel illimité (24/7)",
      "Re-évaluation automatique à 4 et 8 semaines",
      "Tableau de bord de progression",
      "Garantie satisfait ou remboursé 30 jours",
    ],
    cta: "Choisir Cadre",
    highlight: true,
    badge: "Le plus choisi",
  },
  {
    name: "Direction",
    tagline: "Pour les enjeux exécutifs et dirigeants",
    priceMonthly: 249,
    priceYearly: 2490,
    description: "Tout Cadre + accompagnement humain par un coach exécutif certifié.",
    features: [
      "Tout ce qui est inclus dans Cadre",
      "2 sessions / mois avec un coach exécutif",
      "Préparation board & comité de direction",
      "Analyse stratégique 360° de votre positionnement",
      "Hotline coach prioritaire",
      "Suivi confidentiel multi-trimestres",
      "Onboarding personnalisé",
    ],
    cta: "Demander un entretien",
    highlight: false,
  },
];

export default function Pricing() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("yearly");

  return (
    <section id="pricing" className="py-24 lg:py-32 bg-white">
      <Container>
        <SectionHeader
          badge="Tarifs"
          badgeVariant="primary"
          title="Investissez dans votre trajectoire"
          description={
            <>
              Sans engagement. Annulation en 1 clic.<br />
              <strong className="text-ink">30 jours satisfait ou remboursé</strong> sur toutes les offres.
            </>
          }
          className="mb-12"
        />

        {/* Toggle Mensuel / Annuel */}
        <div className="flex justify-center mb-14">
          <div className="inline-flex items-center p-1.5 rounded-full bg-surface-muted border border-border">
            <button
              onClick={() => setBilling("monthly")}
              className={`px-6 py-2.5 rounded-full font-semibold transition-all duration-200 text-sm ${
                billing === "monthly"
                  ? "bg-white text-ink shadow-soft"
                  : "bg-transparent text-ink-muted hover:text-ink"
              }`}
            >
              Mensuel
            </button>
            <button
              onClick={() => setBilling("yearly")}
              className={`px-6 py-2.5 rounded-full font-semibold transition-all duration-200 text-sm flex items-center gap-2 ${
                billing === "yearly"
                  ? "bg-white text-ink shadow-soft"
                  : "bg-transparent text-ink-muted hover:text-ink"
              }`}
            >
              Annuel
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-success-light text-success">
                −2 mois
              </span>
            </button>
          </div>
        </div>

        {/* Grille des plans */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch lg:items-start">
          {PLANS.map((plan) => {
            const price = billing === "monthly" ? plan.priceMonthly : Math.round(plan.priceYearly / 12);
            const isHighlight = plan.highlight;
            return (
              <Card
                key={plan.name}
                variant={isHighlight ? "primary" : "default"}
                padding="xl"
                className={`relative flex flex-col ${isHighlight ? "lg:-mt-4 lg:-mb-4 shadow-elevated" : ""}`}
              >
                {/* Badges */}
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold bg-brand-accent text-white shadow-glow-accent">
                    <Sparkles size={12} />
                    {plan.badge}
                  </div>
                )}

                <div className="font-bold mb-2 text-[22px] tracking-tight">
                  {plan.name}
                </div>

                <div className={`text-sm mb-6 ${isHighlight ? "text-white/80" : "text-ink-muted"}`}>
                  {plan.tagline}
                </div>

                <div className="flex items-baseline gap-2 mb-2">
                  <span className="font-bold text-[52px] leading-none tracking-tight">
                    {price}€
                  </span>
                  <span className={`text-[15px] ${isHighlight ? "text-white/60" : "text-ink-muted"}`}>
                    / mois
                  </span>
                </div>

                <div className={`text-xs mb-6 ${isHighlight ? "text-white/60" : "text-ink-muted"}`}>
                  {billing === "yearly"
                    ? `Soit ${plan.priceYearly}€ facturés annuellement`
                    : "Facturation mensuelle, sans engagement"}
                </div>

                <p className={`text-sm leading-relaxed mb-8 pb-8 border-b ${isHighlight ? "text-white/90 border-white/20" : "text-ink border-border"}`}>
                  {plan.description}
                </p>

                <ul className="flex flex-col gap-3.5 mb-10 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${isHighlight ? "bg-brand-accent/20" : "bg-success-light"}`}>
                        <Check size={12} strokeWidth={3} className={isHighlight ? "text-brand-accent" : "text-success"} />
                      </div>
                      <span className={`text-sm leading-relaxed ${isHighlight ? "text-white" : "text-ink"}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-col gap-3">
                  <LinkButton
                    href="/signup"
                    variant={isHighlight ? "accent" : "dark"}
                    fullWidth
                    rightIcon={<ArrowRight size={16} />}
                    onClick={() => { trackEvent(ANALYTICS_EVENTS.PRICING_CTA_CLICKED, { plan: plan.name, billing }); }}
                  >
                    {plan.cta}
                  </LinkButton>
                  <p className={`text-xs text-center font-medium ${isHighlight ? "text-white/70" : "text-ink-subtle"}`}>
                    Aucune carte bancaire requise
                  </p>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Footer pricing */}
        <div className="flex flex-col items-center text-center gap-4 mt-16">
          <p className="text-sm font-medium text-ink-muted">
            🔒 Paiement sécurisé · 🇫🇷 Hébergement européen · ⏱️ Activation immédiate
          </p>
          <p className="max-w-xl text-[13px] text-ink-subtle leading-relaxed">
            Trajectoire est éligible à la prise en charge employeur. Sur demande, nous fournissons un dossier de présentation
            pour votre service formation.
          </p>
        </div>
      </Container>
    </section>
  );
}
