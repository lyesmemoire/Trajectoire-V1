"use client";

import { Container, SectionHeader, Card } from "@/components/ui";

const TESTIMONIALS = [
  {
    quote: "Trajectoire m'a permis de confirmer une décision stratégique que je reportais depuis plusieurs mois. L'objectivité des données a fait la différence.",
    name: "Sophie M.",
    role: "Directrice Marketing",
  },
  {
    quote: "Pour la première fois, j'ai pu objectiver mes hésitations. L'analyse des schémas sous stress est d'une précision redoutable.",
    name: "Thomas R.",
    role: "Manager Opérations",
  },
  {
    quote: "Une approche bien plus rigoureuse que le coaching traditionnel. Les recommandations sont directement actionnables.",
    name: "Claire D.",
    role: "DRH",
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-white border-t border-border">
      <Container>
        <SectionHeader
          badge="Avis vérifiés"
          badgeVariant="neutral"
          title="Ils utilisent Trajectoire"
          description="Ce que les leaders disent de notre approche data-driven."
          className="mb-16"
        />

        <div className="grid md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((item, idx) => (
            <Card key={idx} variant="default" padding="lg" hover className="flex flex-col justify-between">
              <div className="mb-8 relative pt-4">
                <span className="text-6xl text-border absolute -top-2 -left-2 z-0 font-serif leading-none">"</span>
                <p className="text-body relative z-10 text-ink-muted font-medium italic">
                  {item.quote}
                </p>
              </div>
              
              <div className="flex items-center gap-4 border-t border-border pt-5 mt-auto">
                <div className="w-12 h-12 rounded-full bg-surface-muted flex items-center justify-center text-ink font-bold text-lg">
                  {item.name.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-bold text-ink">{item.name}</div>
                  <div className="text-xs text-ink-subtle">{item.role}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
