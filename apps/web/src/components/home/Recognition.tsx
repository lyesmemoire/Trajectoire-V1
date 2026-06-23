"use client";

import { Award, Newspaper, Sparkles, GraduationCap } from "lucide-react";

const RECOGNITIONS = [
  {
    icon: Newspaper,
    source: "Les Échos",
    quote: "La nouvelle génération d'outils d'aide à la décision de carrière.",
  },
  {
    icon: Sparkles,
    source: "Harvard Business Review France",
    quote: "Une approche qui transforme la préparation des moments décisifs.",
  },
  {
    icon: Award,
    source: "French Tech 2025",
    quote: "Lauréat catégorie Innovation RH & Talent.",
  },
  {
    icon: GraduationCap,
    source: "Partenariat ESCP & HEC",
    quote: "Méthodologie validée par la recherche académique.",
  },
];

export default function Recognition() {
  return (
    <section
      className="relative py-24 lg:py-32"
      style={{ backgroundColor: "#FFFFFF" }}
    >
      <div className="max-w-[1400px] mx-auto px-8 lg:px-12">

        {/* Header */}
        <div className="flex flex-col items-center text-center gap-5 mb-16">
          <span
            className="inline-flex items-center px-4 py-2 rounded-full text-xs font-semibold tracking-widest uppercase"
            style={{
              background: "rgba(26,60,52,0.06)",
              color: "#1A3C34",
              border: "1px solid rgba(26,60,52,0.12)",
            }}
          >
            Reconnu par
          </span>
          <h2
            className="font-bold text-balance max-w-3xl"
            style={{
              fontSize: "clamp(32px, 4vw, 52px)",
              lineHeight: "1.1",
              letterSpacing: "-0.03em",
              color: "#0A0A0A",
            }}
          >
            Une méthode validée par les médias et la recherche.
          </h2>
        </div>

        {/* Grille de reconnaissances */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {RECOGNITIONS.map(({ icon: Icon, source, quote }) => (
            <div
              key={source}
              className="flex flex-col gap-5 p-7 rounded-2xl transition-all duration-300 hover:-translate-y-1"
              style={{
                backgroundColor: "#F7F8F9",
                border: "1px solid #E2E8E4",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 16px 40px rgba(0,0,0,0.08)";
                e.currentTarget.style.borderColor = "rgba(26,60,52,0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.borderColor = "#E2E8E4";
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: "rgba(26,60,52,0.08)" }}
              >
                <Icon size={22} style={{ color: "#1A3C34" }} />
              </div>

              <div>
                <div
                  className="font-bold mb-2"
                  style={{
                    fontSize: "15px",
                    color: "#1A3C34",
                  }}
                >
                  {source}
                </div>
                <p
                  style={{
                    fontSize: "14px",
                    lineHeight: "1.6",
                    color: "#4A4A4A",
                    fontStyle: "italic",
                  }}
                >
                  « {quote} »
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
