"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Sparkles, ArrowRight } from "lucide-react";

const PLANS = [
  {
    name: "Essentiel",
    tagline: "Pour clarifier votre prochaine décision",
    priceMonthly: 29,
    priceYearly: 290,
    description:
      "L'évaluation comportementale complète + plan d'action personnalisé.",
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
    description:
      "Tout l'Essentiel + simulations vidéo illimitées + coaching IA contextuel.",
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
    description:
      "Tout Cadre + accompagnement humain par un coach exécutif certifié.",
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
    <section
      id="pricing"
      className="relative py-24 lg:py-32"
      style={{ backgroundColor: "#FFFFFF" }}
    >
      <div className="max-w-[1400px] mx-auto px-8 lg:px-12">

        {/* Header */}
        <div className="flex flex-col items-center text-center gap-5 mb-12">
          <span
            className="inline-flex items-center px-4 py-2 rounded-full text-xs font-semibold tracking-widest uppercase"
            style={{
              background: "rgba(26,60,52,0.06)",
              color: "#1A3C34",
              border: "1px solid rgba(26,60,52,0.12)",
            }}
          >
            Tarifs
          </span>
          <h2
            className="font-bold text-balance max-w-3xl"
            style={{
              fontSize: "clamp(32px, 4.5vw, 56px)",
              lineHeight: "1.05",
              letterSpacing: "-0.035em",
              color: "#0A0A0A",
            }}
          >
            Choisissez l&apos;offre adaptée à{" "}
            <span style={{ color: "#1A3C34" }}>votre moment de carrière</span>.
          </h2>
          <p
            className="max-w-2xl"
            style={{
              fontSize: "18px",
              lineHeight: "1.65",
              color: "#4A4A4A",
            }}
          >
            Sans engagement. Annulation en 1 clic. 30 jours satisfait ou
            remboursé sur toutes les offres.
          </p>
        </div>

        {/* Toggle Mensuel / Annuel */}
        <div className="flex justify-center mb-14">
          <div
            className="inline-flex items-center p-1.5 rounded-full"
            style={{
              backgroundColor: "#F7F8F9",
              border: "1px solid #E2E8E4",
            }}
          >
            <button
              onClick={() => setBilling("monthly")}
              className="px-6 py-2.5 rounded-full font-semibold transition-all duration-200"
              style={{
                fontSize: "14px",
                backgroundColor: billing === "monthly" ? "#FFFFFF" : "transparent",
                color: billing === "monthly" ? "#0A0A0A" : "#4A4A4A",
                boxShadow:
                  billing === "monthly"
                    ? "0 2px 8px rgba(0,0,0,0.05)"
                    : "none",
              }}
            >
              Mensuel
            </button>
            <button
              onClick={() => setBilling("yearly")}
              className="px-6 py-2.5 rounded-full font-semibold transition-all duration-200 flex items-center gap-2"
              style={{
                fontSize: "14px",
                backgroundColor: billing === "yearly" ? "#FFFFFF" : "transparent",
                color: billing === "yearly" ? "#0A0A0A" : "#4A4A4A",
                boxShadow:
                  billing === "yearly"
                    ? "0 2px 8px rgba(0,0,0,0.05)"
                    : "none",
              }}
            >
              Annuel
              <span
                className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold"
                style={{
                  backgroundColor: "rgba(26,127,75,0.12)",
                  color: "#1A7F4B",
                }}
              >
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
              <div
                key={plan.name}
                className="relative flex flex-col rounded-3xl p-8 lg:p-10 transition-all duration-300"
                style={{
                  backgroundColor: isHighlight ? "#1A3C34" : "#FFFFFF",
                  border: `2px solid ${isHighlight ? "#1A3C34" : "#E2E8E4"}`,
                  color: isHighlight ? "#FFFFFF" : "#0A0A0A",
                  transform: "scale(1)",
                  marginTop: isHighlight ? "-12px" : "0",
                  marginBottom: isHighlight ? "-12px" : "0",
                  boxShadow: isHighlight
                    ? "0 24px 60px rgba(26,60,52,0.25)"
                    : "none",
                }}
              >
                {/* Badge */}
                {plan.badge && (
                  <div
                    className="absolute -top-4 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold"
                    style={{
                      backgroundColor: "#E8501A",
                      color: "#FFFFFF",
                    }}
                  >
                    <Sparkles size={12} />
                    {plan.badge}
                  </div>
                )}

                {/* Nom */}
                <div
                  className="font-bold mb-2"
                  style={{
                    fontSize: "22px",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {plan.name}
                </div>

                {/* Tagline */}
                <div
                  className="mb-6"
                  style={{
                    fontSize: "14px",
                    color: isHighlight
                      ? "rgba(255,255,255,0.7)"
                      : "#4A4A4A",
                  }}
                >
                  {plan.tagline}
                </div>

                {/* Prix */}
                <div className="flex items-baseline gap-2 mb-2">
                  <span
                    className="font-bold"
                    style={{
                      fontSize: "52px",
                      lineHeight: 1,
                      letterSpacing: "-0.03em",
                    }}
                  >
                    {price}€
                  </span>
                  <span
                    style={{
                      fontSize: "15px",
                      color: isHighlight
                        ? "rgba(255,255,255,0.6)"
                        : "#4A4A4A",
                    }}
                  >
                    / mois
                  </span>
                </div>

                {/* Sous-prix */}
                <div
                  className="mb-6 text-xs"
                  style={{
                    color: isHighlight
                      ? "rgba(255,255,255,0.5)"
                      : "#4A4A4A",
                  }}
                >
                  {billing === "yearly"
                    ? `Soit ${plan.priceYearly}€ facturés annuellement`
                    : "Facturation mensuelle, sans engagement"}
                </div>

                {/* Description */}
                <p
                  className="mb-8 pb-8 border-b"
                  style={{
                    fontSize: "14px",
                    lineHeight: "1.6",
                    color: isHighlight
                      ? "rgba(255,255,255,0.8)"
                      : "#4A4A4A",
                    borderColor: isHighlight
                      ? "rgba(255,255,255,0.15)"
                      : "#E2E8E4",
                  }}
                >
                  {plan.description}
                </p>

                {/* Features */}
                <ul className="flex flex-col gap-3.5 mb-10 flex-1">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3"
                    >
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{
                          backgroundColor: isHighlight
                            ? "rgba(232,80,26,0.2)"
                            : "rgba(26,127,75,0.12)",
                        }}
                      >
                        <Check
                          size={12}
                          strokeWidth={3}
                          style={{
                            color: isHighlight ? "#E8501A" : "#1A7F4B",
                          }}
                        />
                      </div>
                      <span
                        style={{
                          fontSize: "14px",
                          lineHeight: "1.5",
                          color: isHighlight
                            ? "rgba(255,255,255,0.9)"
                            : "#0A0A0A",
                        }}
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 w-full"
                  style={{
                    backgroundColor: isHighlight ? "#E8501A" : "#1A3C34",
                    color: "#FFFFFF",
                    padding: "16px 24px",
                    fontSize: "15px",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = isHighlight
                      ? "#D04415"
                      : "#142E28";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = isHighlight
                      ? "#E8501A"
                      : "#1A3C34";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  {plan.cta}
                  <ArrowRight size={16} />
                </Link>
              </div>
            );
          })}
        </div>

        {/* Footer pricing */}
        <div className="flex flex-col items-center text-center gap-4 mt-16">
          <p
            style={{
              fontSize: "14px",
              color: "#4A4A4A",
            }}
          >
            🔒 Paiement sécurisé · 🇫🇷 Hébergement français · ⏱️ Activation immédiate
          </p>
          <p
            className="max-w-xl"
            style={{
              fontSize: "13px",
              color: "#4A4A4A",
              lineHeight: 1.6,
            }}
          >
            Trajectoire est éligible à la prise en charge employeur (CPF non
            éligible). Sur demande, nous fournissons un dossier de présentation
            pour votre service formation.
          </p>
        </div>
      </div>
    </section>
  );
}
