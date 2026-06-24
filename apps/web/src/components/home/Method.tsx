"use client";

import { useState, useRef, KeyboardEvent } from "react";
import { Microscope, Crosshair, Drama, ClipboardCheck, Check, ArrowRight } from "lucide-react";
import { Container, SectionHeader, Card, LinkButton } from "@/components/ui";

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
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const step = STEPS[activeStep];
  const Icon = step.icon;
  const tabPanelId = `method-tabpanel-${activeStep}`;

  // Navigation clavier conforme ARIA (flèches gauche/droite + Home/End)
  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex: number | null = null;

    switch (e.key) {
      case "ArrowRight":
      case "ArrowDown":
        e.preventDefault();
        nextIndex = (index + 1) % STEPS.length;
        break;
      case "ArrowLeft":
      case "ArrowUp":
        e.preventDefault();
        nextIndex = (index - 1 + STEPS.length) % STEPS.length;
        break;
      case "Home":
        e.preventDefault();
        nextIndex = 0;
        break;
      case "End":
        e.preventDefault();
        nextIndex = STEPS.length - 1;
        break;
    }

    if (nextIndex !== null) {
      setActiveStep(nextIndex);
      tabRefs.current[nextIndex]?.focus();
    }
  };

  return (
    <section id="method" className="py-24 lg:py-32 bg-white">
      <Container>
        <SectionHeader
          badge="La méthode Trajectoire"
          badgeVariant="neutral"
          title={
            <>
              4 étapes pour transformer{" "}
              <span className="text-brand-accent italic">l&apos;intuition</span> en{" "}
              <span className="text-brand-primary">certitude</span>.
            </>
          }
          description="Une méthode séquentielle, validée par la recherche, conçue pour les professionnels qui jouent leur carrière sur des moments précis."
          className="mb-16 lg:mb-20"
        />

        {/* Layout : Steps à gauche, Détail à droite */}
        <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">

          {/* ── Colonne gauche — Tablist ARIA conforme ── */}
          <div
            className="lg:col-span-5 flex flex-col gap-3"
            role="tablist"
            aria-label="Les 4 étapes de la méthode Trajectoire"
            aria-orientation="vertical"
          >
            {STEPS.map((s, i) => {
              const isActive = i === activeStep;
              const StepIcon = s.icon;
              const tabId = `method-tab-${i}`;
              return (
                <button
                  key={s.number}
                  ref={(el) => { tabRefs.current[i] = el; }}
                  id={tabId}
                  role="tab"
                  type="button"
                  aria-selected={isActive}
                  aria-controls={tabPanelId}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => setActiveStep(i)}
                  onKeyDown={(e) => handleKeyDown(e, i)}
                  className={[
                    "text-left p-5 lg:p-6 rounded-2xl transition-all duration-300",
                    "flex-1 border min-h-[100px] outline-none",
                    "focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2",
                    isActive
                      ? "bg-brand-primary border-brand-primary"
                      : "bg-surface-muted border-border hover:bg-surface-muted/80",
                  ].join(" ")}
                >
                  <div className="flex items-center gap-4 h-full">
                    <div
                      className={[
                        "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
                        "transition-all duration-300",
                        isActive
                          ? "bg-white/15 text-[var(--color-on-brand)]"
                          : "bg-brand-primary/10 text-brand-primary",
                      ].join(" ")}
                    >
                      <StepIcon size={22} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div
                        className={[
                          "font-bold text-xs tracking-widest uppercase mb-1",
                          isActive ? "text-white/60" : "text-ink-muted",
                        ].join(" ")}
                      >
                        Étape {s.number}
                      </div>
                      <div
                        className={[
                          "text-body font-bold leading-tight tracking-tight",
                          isActive ? "text-[var(--color-on-brand)]" : "text-ink",
                        ].join(" ")}
                      >
                        {s.title}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* ── Colonne droite — Tabpanel de l'étape active ── */}
          <div className="lg:col-span-7">
            <Card
              variant="default"
              padding="xl"
              className="h-full flex flex-col bg-surface-muted border-border"
            >
              <div
                id={tabPanelId}
                role="tabpanel"
                aria-labelledby={`method-tab-${activeStep}`}
                tabIndex={0}
                className="outline-none flex flex-col flex-1"
              >
                {/* Header de l'étape */}
                <div className="flex items-start gap-5 mb-7">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 bg-brand-primary text-[var(--color-on-brand)]">
                    <Icon size={28} />
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-xs tracking-widest uppercase mb-2 text-brand-accent">
                      Étape {step.number} sur 04
                    </div>
                    <h3 className="text-heading-3 text-ink mb-1">
                      {step.title}
                    </h3>
                    <p className="text-body font-medium text-brand-primary italic">
                      {step.subtitle}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <p className="mb-7 text-body leading-relaxed text-ink-muted">
                  {step.description}
                </p>

                {/* Livrables */}
                <div className="mt-auto">
                  <div className="font-bold text-xs tracking-widest uppercase mb-3 text-ink-muted">
                    Ce que vous obtenez
                  </div>
                  <ul className="flex flex-col gap-2.5">
                    {step.deliverables.map((deliverable) => (
                      <li
                        key={deliverable}
                        className="flex items-center gap-3 p-3.5 rounded-xl bg-white border border-border/50"
                      >
                        <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 bg-success/10 text-success">
                          <Check size={14} strokeWidth={2.5} />
                        </div>
                        <span className="text-body-sm font-medium text-ink">
                          {deliverable}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* CTA — Pont vers la conversion, n'apparaît qu'à la dernière étape */}
              {activeStep === STEPS.length - 1 && (
                <div className="mt-8 pt-6 border-t border-border-subtle flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <p className="text-body-sm text-ink-muted">
                    Prêt à transformer votre prochaine étape de carrière&nbsp;?
                  </p>
                  <LinkButton
                    variant="primary"
                    size="md"
                    href="#pricing"
                    className="group"
                  >
                    Voir les formules
                    <ArrowRight
                      size={16}
                      className="ml-2 transition-transform group-hover:translate-x-1"
                    />
                  </LinkButton>
                </div>
              )}
            </Card>
          </div>
        </div>
      </Container>
    </section>
  );
}
