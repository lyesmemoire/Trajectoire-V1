"use client";

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

        {/* Grille des étapes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <Card key={step.number} variant="default" padding="xl" className="bg-surface-muted border-border hover:shadow-elevated transition-shadow">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 bg-brand-primary text-white">
                    <Icon size={28} />
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-xs tracking-widest uppercase mb-2 text-brand-accent">
                      Étape {step.number} sur 04
                    </div>
                    <h3 className="text-xl font-bold text-ink mb-1">
                      {step.title}
                    </h3>
                    <p className="text-sm font-medium text-brand-primary italic">
                      {step.subtitle}
                    </p>
                  </div>
                </div>

                <p className="text-sm leading-relaxed text-ink-muted mb-6">
                  {step.description}
                </p>

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
                        <span className="text-sm font-medium text-ink">
                          {deliverable}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            );
          })}
        </div>

        {/* CTA final */}
        <div className="mt-12 pt-8 border-t border-border-subtle flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-sm text-ink-muted">
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
      </Container>
    </section>
  );
}
