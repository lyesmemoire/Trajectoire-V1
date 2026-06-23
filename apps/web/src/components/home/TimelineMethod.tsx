"use client";

import { Container, SectionHeader, Card } from "@/components/ui";

const STEPS = [
  {
    step: "1",
    title: "Évaluation",
    description: "Répondez à des questions de mise en situation pour identifier vos réflexes comportementaux naturels.",
  },
  {
    step: "2",
    title: "Analyse IA",
    description: "Nos modèles traitent vos réponses en croisant des milliers de profils cadres et dirigeants.",
  },
  {
    step: "3",
    title: "Détection des schémas",
    description: "Identification de vos forces, points de bascule sous stress et styles de leadership.",
  },
  {
    step: "4",
    title: "Rapport personnalisé",
    description: "Génération d'un rapport détaillé, sans filtre, pour objectiver votre prochaine étape de carrière.",
  },
  {
    step: "5",
    title: "Recommandations",
    description: "Propositions d'actions concrètes et d'axes de développement pour maximiser votre impact.",
  },
];

export default function TimelineMethod() {
  return (
    <section className="py-24 bg-surface-muted border-t border-border">
      <Container>
        <SectionHeader
          badge="Transparence"
          badgeVariant="neutral"
          title="Comment sont générés vos résultats ?"
          description="Un processus rigoureux en 5 étapes pour passer de l'intuition à la certitude data-driven."
          className="mb-16"
        />

        <div className="max-w-4xl mx-auto relative">
          {/* Ligne verticale timeline */}
          <div className="absolute left-[31px] md:left-1/2 top-4 bottom-4 w-px bg-border md:-translate-x-1/2 z-0" />

          <div className="flex flex-col gap-8 md:gap-12 relative z-10">
            {STEPS.map((item, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <div
                  key={item.step}
                  className={`flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-12 ${
                    isEven ? "md:flex-row-reverse" : ""
                  }`}
                >
                  <div className="hidden md:block flex-1 w-full" />
                  
                  {/* Numéro central */}
                  <div className="w-16 h-16 rounded-full bg-white border-2 border-brand-primary flex items-center justify-center text-xl font-bold text-brand-primary shadow-soft flex-shrink-0 relative z-10">
                    {item.step}
                  </div>
                  
                  <div className="flex-1 w-full ml-16 md:ml-0 -mt-20 md:mt-0">
                    <Card variant="default" padding="lg" hover className={`relative ${
                      isEven ? "md:text-right" : "md:text-left"
                    }`}>
                      <h3 className="text-heading-3 text-ink mb-2">{item.title}</h3>
                      <p className="text-body-sm text-ink-muted">{item.description}</p>
                    </Card>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
