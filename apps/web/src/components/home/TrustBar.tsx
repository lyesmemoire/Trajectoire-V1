"use client";

import { Container } from "@/components/ui";
import { CheckCircle2, ShieldCheck, Target, BarChart3 } from "lucide-react";

const TRUST_ITEMS = [
  { icon: Target, label: "Méthode structurée" },
  { icon: BarChart3, label: "Analyse comportementale" },
  { icon: ShieldCheck, label: "Données sécurisées" },
  { icon: CheckCircle2, label: "Validé par des chercheurs" },
];

export default function TrustBar() {
  return (
    <section className="relative py-12 bg-surface-muted border-y border-border">
      <Container>
        <div className="flex flex-col items-center gap-8">
          <p className="text-center text-[13px] font-semibold uppercase tracking-[0.15em] text-ink-muted">
            Pourquoi nous faire confiance
          </p>

          <div className="w-full overflow-hidden">
            <div className="flex items-center justify-around gap-8 flex-wrap">
              {TRUST_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="flex items-center gap-2 text-sm font-medium text-ink transition-transform duration-300 hover:scale-105"
                  >
                    <Icon size={16} className="text-brand-primary flex-shrink-0" />
                    {item.label}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
