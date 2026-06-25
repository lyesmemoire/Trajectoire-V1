"use client";

import { ArrowRight, CheckCircle2, Clock, ShieldCheck } from "lucide-react";
import { Container, LinkButton } from "@/components/ui";

const GUARANTEES = [
  { icon: CheckCircle2, label: "Gratuit pour commencer" },
  { icon: Clock, label: "Résultats en 10 minutes" },
  { icon: ShieldCheck, label: "30 jours satisfait ou remboursé" },
];

export default function CTA() {
  return (
    <section className="py-24 lg:py-32 bg-surface-muted overflow-hidden">
      <Container>
        <div className="relative rounded-[2.5rem] bg-brand-primary text-white overflow-hidden p-10 lg:p-20 flex flex-col items-center text-center">
          {/* Backgrounds décoratifs */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(232,80,26,0.15) 0%, transparent 60%)",
            }}
          />

          <span className="inline-flex items-center px-4 py-2 rounded-full text-xs font-semibold tracking-widest uppercase bg-brand-accent/20 text-white border border-brand-accent/30 mb-8 relative z-10">
            Démarrez aujourd&apos;hui
          </span>

          <h2 className="text-display-2 text-balance font-bold max-w-4xl mb-6 relative z-10">
            Votre prochaine décision de carrière mérite{" "}
            <span className="text-brand-accent italic">mieux qu&apos;une intuition</span>.
          </h2>

          <p className="text-body-lg text-white/80 max-w-2xl mb-12 relative z-10">
            En 10 minutes, vous obtenez votre profil comportemental complet et un plan d&apos;action personnalisé. Sans carte bancaire, sans engagement.
          </p>

          <div className="flex flex-col items-center gap-4 relative z-10">
            <LinkButton
              href="/register"
              variant="primary"
              size="xl"
              rightIcon={<ArrowRight size={20} />}
            >
              Démarrer mon évaluation
            </LinkButton>
            <p className="text-sm font-medium text-white/70">
              Essai gratuit en moins de 2 minutes
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 mt-12 relative z-10">
            {GUARANTEES.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-sm text-white/80">
                <Icon size={16} className="text-brand-accent flex-shrink-0" />
                {label}
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
