"use client";

import { Container, SectionHeader, Card } from "@/components/ui";

const PILLARS = [
  {
    title: "Évaluation comportementale",
    description: "Méthodologie issue des standards de l'évaluation exécutive, adaptée pour une auto-évaluation objective et sans biais.",
  },
  {
    title: "Psychologie du travail",
    description: "Indicateurs construits sur les modèles de leadership situationnel et d'intelligence émotionnelle validés.",
  },
  {
    title: "Analyse décisionnelle",
    description: "Détection des heuristiques et schémas cognitifs sous stress pour fiabiliser vos prises de décision à fort enjeu.",
  },
];

export default function ScienceLegitimacy() {
  return (
    <section className="py-20 bg-white">
      <Container>
        <SectionHeader
          badge="Rigueur Scientifique"
          badgeVariant="neutral"
          title="Une méthode fondée sur la recherche"
          description="Conçu à partir de travaux académiques en psychologie comportementale et prise de décision."
          className="mb-12"
        />

        <div className="grid md:grid-cols-3 gap-6">
          {PILLARS.map((pillar, idx) => (
            <Card key={idx} variant="default" padding="lg">
              <div className="w-8 h-8 border-b-2 border-brand-primary mb-6" />
              <h3 className="text-body-lg font-bold text-ink mb-3">{pillar.title}</h3>
              <p className="text-sm text-ink-muted leading-relaxed">
                {pillar.description}
              </p>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
