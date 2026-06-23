"use client";

import { useState } from "react";
import { Microscope, Crosshair, Drama, ClipboardCheck } from "lucide-react";

const STEPS = [
  {
    number: "01",
    icon: Microscope,
    title: "Évaluation comportementale",
    subtitle: "Votre Career DNA en 10 minutes",
    description:
      "Vous répondez à un protocole d'évaluation conçu avec des chercheurs en psychologie du travail. L'IA analyse vos schémas de décision, vos zones de confort et vos vrais leviers de performance.",
    deliverables: [
      "Profil comportemental détaillé",
      "Cartographie de vos forces différenciantes",
      "Score de cohérence interne",
    ],
  },
  {
    number: "02",
    icon: Crosshair,
    title: "Identification des angles morts",
    subtitle: "Ce que vous ne voyez pas sur vous-même",
    description:
      "Croisement entre votre auto-évaluation, votre parcours et les standards du marché. Trajectoire détecte les écarts entre votre perception, la réalité de vos compétences et les attentes des décideurs.",
    deliverables: [
      "3 à 5 angles morts critiques",
      "Diagnostic de cohérence CV / discours",
      "Plan de renforcement personnalisé",
    ],
  },
  {
    number: "03",
    icon: Drama,
    title: "Simulations à fort enjeu",
    subtitle: "Entraînez-vous avant que ça compte vraiment",
    description:
      "Entretiens de promotion, négociation salariale, comité de direction, prise de poste. Vous simulez les moments décisifs avec un coaching IA qui analyse votre posture, votre verbal et votre stress en temps réel.",
    deliverables: [
      "Simulations vidéo interactives",
      "Analyse comportementale en direct",
      "Replay annoté avec recommandations",
    ],
  },
  {
    number: "04",
    icon: ClipboardCheck,
    title: "Plan d'action chiffré",
    subtitle: "Des décisions, pas des intentions",
    description:
      "À la fin du parcours, vous recevez un plan de progression mesurable sur 4 à 12 semaines. Indicateurs clairs, jalons hebdomadaires, ajustements continus selon vos résultats.",
    deliverables: [
      "Plan de progression chiffré",
      "Tableau de bord de suivi hebdomadaire",
      "Re-évaluation à 4 et 8 semaines",
    ],
  },
];

export default function Method() {
  const [activeStep, setActiveStep] = useState(0);
  const step = STEPS[activeStep];
  const Icon = step.icon;

  return (
    <section
      id="method"
      className="relative py-24 lg:py-32"
      style={{ backgroundColor: "#FFFFFF" }}
    >
      <div className="max-w-[1400px] mx-auto px-8 lg:px-12">

        {/* Header */}
        <div className="flex flex-col items-center text-center gap-5 mb-16 lg:mb-20">
          <span
            className="inline-flex items-center px-4 py-2 rounded-full text-xs font-semibold tracking-widest uppercase"
            style={{
              background: "rgba(26,60,52,0.06)",
              color: "#1A3C34",
              border: "1px solid rgba(26,60,52,0.12)",
            }}
          >
            La méthode Trajectoire
          </span>
          <h2
            className="font-bold text-balance max-w-4xl"
            style={{
              fontSize: "clamp(32px, 4.5vw, 56px)",
              lineHeight: "1.05",
              letterSpacing: "-0.035em",
              color: "#0A0A0A",
            }}
          >
            4 étapes pour transformer{" "}
            <span style={{ color: "#E8501A", fontStyle: "italic" }}>
              l&apos;intuition
            </span>{" "}
            en{" "}
            <span style={{ color: "#1A3C34" }}>certitude</span>.
          </h2>
          <p
            className="max-w-2xl"
            style={{
              fontSize: "18px",
              lineHeight: "1.65",
              color: "#4A4A4A",
            }}
          >
            Une méthode séquentielle, validée par la recherche, conçue pour
            les professionnels qui jouent leur carrière sur des moments précis.
          </p>
        </div>

        {/* Layout : Steps à gauche, Détail à droite — STRETCH */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">

          {/* ── Colonne gauche — Liste des étapes ── */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            {STEPS.map((s, i) => {
              const isActive = i === activeStep;
              const StepIcon = s.icon;
              return (
                <button
                  key={s.number}
                  onClick={() => setActiveStep(i)}
                  className="text-left p-5 lg:p-6 rounded-2xl transition-all duration-300 flex-1"
                  style={{
                    backgroundColor: isActive ? "#1A3C34" : "#F7F8F9",
                    border: `1px solid ${isActive ? "#1A3C34" : "#E2E8E4"}`,
                    minHeight: "100px",
                  }}
                >
                  <div className="flex items-center gap-4 h-full">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300"
                      style={{
                        backgroundColor: isActive
                          ? "rgba(255,255,255,0.15)"
                          : "rgba(26,60,52,0.08)",
                      }}
                    >
                      <StepIcon
                        size={22}
                        style={{ color: isActive ? "#FFFFFF" : "#1A3C34" }}
                      />
                    </div>

                    <div className="flex-1">
                      <div
                        className="font-bold text-xs tracking-widest uppercase mb-1"
                        style={{
                          color: isActive
                            ? "rgba(255,255,255,0.6)"
                            : "#4A4A4A",
                        }}
                      >
                        Étape {s.number}
                      </div>
                      <div
                        className="font-bold"
                        style={{
                          fontSize: "17px",
                          color: isActive ? "#FFFFFF" : "#0A0A0A",
                          letterSpacing: "-0.02em",
                          lineHeight: 1.25,
                        }}
                      >
                        {s.title}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* ── Colonne droite — Détail de l'étape active ── */}
          <div className="lg:col-span-7">
            <div
              className="rounded-3xl p-8 lg:p-10 transition-all duration-500 h-full flex flex-col"
              style={{
                backgroundColor: "#F7F8F9",
                border: "1px solid #E2E8E4",
              }}
            >
              {/* Header de l'étape */}
              <div className="flex items-start gap-5 mb-7">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: "#1A3C34" }}
                >
                  <Icon size={28} style={{ color: "#FFFFFF" }} />
                </div>
                <div>
                  <div
                    className="font-bold text-xs tracking-widest uppercase mb-2"
                    style={{ color: "#E8501A" }}
                  >
                    Étape {step.number} sur 04
                  </div>
                  <h3
                    className="font-bold mb-1"
                    style={{
                      fontSize: "clamp(22px, 2.4vw, 32px)",
                      lineHeight: "1.15",
                      letterSpacing: "-0.025em",
                      color: "#0A0A0A",
                    }}
                  >
                    {step.title}
                  </h3>
                  <p
                    className="font-medium"
                    style={{
                      fontSize: "15px",
                      color: "#1A3C34",
                      fontStyle: "italic",
                    }}
                  >
                    {step.subtitle}
                  </p>
                </div>
              </div>

              {/* Description */}
              <p
                className="mb-7"
                style={{
                  fontSize: "16px",
                  lineHeight: "1.65",
                  color: "#4A4A4A",
                }}
              >
                {step.description}
              </p>

              {/* Livrables */}
              <div className="mt-auto">
                <div
                  className="font-bold text-xs tracking-widest uppercase mb-3"
                  style={{ color: "#4A4A4A" }}
                >
                  Ce que vous obtenez
                </div>
                <ul className="flex flex-col gap-2.5">
                  {step.deliverables.map((deliverable) => (
                    <li
                      key={deliverable}
                      className="flex items-center gap-3 p-3.5 rounded-xl"
                      style={{ backgroundColor: "#FFFFFF" }}
                    >
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: "rgba(26,127,75,0.12)" }}
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          fill="none"
                        >
                          <path
                            d="M3 7L6 10L11 4"
                            stroke="#1A7F4B"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <span
                        className="font-medium"
                        style={{
                          fontSize: "15px",
                          color: "#0A0A0A",
                        }}
                      >
                        {deliverable}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
