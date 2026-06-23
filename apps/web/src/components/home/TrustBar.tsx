"use client";

import { Container } from "@/components/ui";

const COMPANIES = [
  "LVMH",
  "BCG",
  "McKinsey",
  "L'Oréal",
  "BNP Paribas",
  "Total Energies",
  "Capgemini",
  "Saint-Gobain",
];

export default function TrustBar() {
  return (
    <section className="relative py-16 bg-surface-muted border-y border-border">
      <Container>
        <div className="flex flex-col items-center gap-10">
          <p className="text-center text-[13px] font-medium uppercase tracking-[0.15em] text-ink-muted">
            Nos utilisateurs viennent des plus grandes entreprises
          </p>

          <div className="w-full overflow-hidden">
            <div className="flex items-center justify-around gap-12 flex-wrap opacity-65">
              {COMPANIES.map((company) => (
                <div
                  key={company}
                  className="font-bold text-[22px] tracking-tight text-brand-primary transition-transform duration-300 hover:scale-105"
                >
                  {company}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
