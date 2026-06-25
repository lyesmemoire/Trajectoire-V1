"use client";

import { AlertCircle, EyeOff, Compass, Flame } from "lucide-react";
import { Container, SectionHeader, Card } from "@/components/ui";

const PROBLEMS = [
  {
    icon: Compass,
    title: "Vous prenez vos décisions à l'aveugle",
    description: "Promotion, mobilité... vous tranchez à l'instinct sans grille de lecture de vos vraies forces.",
    consequence: "Résultat : choix subis.",
  },
  {
    icon: EyeOff,
    title: "Entretiens préparés sans méthode",
    description: "Vous n'avez aucune visibilité objective sur la façon dont vous êtes réellement perçu.",
    consequence: "Résultat : mode survie.",
  },
  {
    icon: AlertCircle,
    title: "Vous doutez de vos vraies forces",
    description: "Le syndrome de l'imposteur ou l'absence de feedback structuré brouillent votre positionnement.",
    consequence: "Résultat : posture fragile.",
  },
  {
    icon: Flame,
    title: "Vous subissez le stress à fort enjeu",
    description: "La préparation mentale est laissée au hasard. Le stress prend le dessus quand l'enjeu monte.",
    consequence: "Résultat : performance bridée.",
  },
];

export default function ProblemGrid() {
  return (
    <section className="py-20 bg-surface-muted border-b border-border">
      <Container>
        <SectionHeader
          badge="Le constat"
          badgeVariant="warning"
          title="Les 4 angles morts qui plafonnent les carrières"
          description="Trajectoire a été conçu pour résoudre ces 4 problèmes précis."
          className="mb-12"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {PROBLEMS.map(({ icon: Icon, title, description, consequence }) => (
            <Card key={title} variant="default" padding="md" hover className="flex flex-col">
              <div className="w-10 h-10 rounded-xl bg-brand-accent/10 flex items-center justify-center mb-4 text-brand-accent">
                <Icon size={20} />
              </div>
              <h3 className="text-body-lg font-bold text-ink mb-2">
                {title}
              </h3>
              <p className="text-sm text-ink-muted leading-relaxed mb-4 flex-1">
                {description}
              </p>
              <div className="pt-4 border-t border-border mt-auto">
                <span className="text-xs font-semibold text-brand-primary">
                  {consequence}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
