"use client";

import { Container } from "@/components/ui";

const CREDIBILITY_ITEMS = [
  "Méthode structurée",
  "Analyse basée sur les données",
  "Inspirée de la psychologie du travail",
  "Rapport personnalisé",
];

export default function CredibilityBar() {
  return (
    <section className="bg-surface-muted border-b border-border py-4">
      <Container>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
          {CREDIBILITY_ITEMS.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-2 text-sm font-medium text-ink-muted"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-brand-accent/60" />
              {item}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
