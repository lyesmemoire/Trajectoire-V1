"use client";

import { useState } from "react";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";

const TESTIMONIALS = [
  {
    initials: "SM",
    name: "Sophie M.",
    role: "Directrice Marketing",
    company: "Groupe CAC 40",
    context: "Promotion VP Marketing",
    quote:
      "J'ai utilisé Trajectoire 6 semaines avant mon comité de promotion. Pour la première fois, j'ai pu identifier précisément ce qui me freinait et travailler dessus avec une vraie méthode. J'ai obtenu le poste — et surtout, j'y suis arrivée sans cette boule au ventre habituelle.",
    gain: "+31 pts de confiance",
    color: "linear-gradient(135deg, #1A3C34, #2D5F50)",
  },
  {
    initials: "TL",
    name: "Thomas L.",
    role: "Directeur Commercial",
    company: "Scale-up SaaS B2B",
    context: "Négociation package x2",
    quote:
      "Les simulations de négociation salariale m'ont littéralement bluffé. L'IA repérait des micro-hésitations dans ma voix que je n'avais jamais conscientisées. Résultat : j'ai doublé mon package en arrivant chez mon nouveau employeur. Le ROI est immédiat.",
    gain: "Package x2",
    color: "linear-gradient(135deg, #E8501A, #D04415)",
  },
  {
    initials: "CB",
    name: "Camille B.",
    role: "Manager Senior",
    company: "Cabinet de conseil",
    context: "Mobilité interne stratégique",
    quote:
      "Ce qui change tout, c'est qu'on arrête de tourner en rond. Au lieu de me demander si je devais postuler ou pas, j'ai eu une vraie cartographie de mes forces réelles et de mon positionnement. Décision prise en 2 semaines au lieu de 6 mois de doute.",
    gain: "Décision en 2 semaines",
    color: "linear-gradient(135deg, #1A7F4B, #1A3C34)",
  },
  {
    initials: "AR",
    name: "Antoine R.",
    role: "Directeur Financier",
    company: "ETI industrielle",
    context: "Prise de poste COMEX",
    quote:
      "Mes 90 premiers jours en COMEX étaient à enjeu maximal. Trajectoire m'a donné un plan structuré, des simulations de présentation board et un coaching contextuel. J'ai pris mes marques 2x plus vite que mes prédécesseurs.",
    gain: "Prise de poste 2x plus rapide",
    color: "linear-gradient(135deg, #4A4A4A, #1A3C34)",
  },
];

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);

  const next = () => setActiveIndex((i) => (i + 1) % TESTIMONIALS.length);
  const prev = () =>
    setActiveIndex((i) => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);

  const testimonial = TESTIMONIALS[activeIndex];

  return (
    <section
      className="relative py-24 lg:py-32"
      style={{ backgroundColor: "#FFFFFF" }}
    >
      <div className="max-w-[1400px] mx-auto px-8 lg:px-12">

        {/* Header */}
        <div className="flex flex-col items-center text-center gap-5 mb-20">
          <span
            className="inline-flex items-center px-4 py-2 rounded-full text-xs font-semibold tracking-widest uppercase"
            style={{
              background: "rgba(26,60,52,0.06)",
              color: "#1A3C34",
              border: "1px solid rgba(26,60,52,0.12)",
            }}
          >
            Ils témoignent
          </span>
          <h2
            className="font-bold text-balance max-w-4xl"
            style={{
              fontSize: "clamp(32px, 4.5vw, 56px)",
              lineHeight: "1.05",
              letterSpacing: "-0.035em",
              color: "#0A0A0A",
            }}
          >
            Des décisions de carrière{" "}
            <span style={{ color: "#1A3C34" }}>prises avec méthode</span>.
          </h2>
          <p
            className="max-w-2xl"
            style={{
              fontSize: "18px",
              lineHeight: "1.65",
              color: "#4A4A4A",
            }}
          >
            Cadres, managers et dirigeants partagent comment Trajectoire a
            transformé leurs moments à fort enjeu.
          </p>
        </div>

        {/* Carrousel principal */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">

          {/* Carte témoignage principale */}
          <div className="lg:col-span-8">
            <div
              className="relative h-full rounded-3xl p-8 lg:p-12 flex flex-col justify-between gap-8 overflow-hidden"
              style={{
                backgroundColor: "#F7F8F9",
                border: "1px solid #E2E8E4",
                minHeight: "500px",
              }}
            >
              {/* Icône quote en fond */}
              <Quote
                size={120}
                style={{
                  position: "absolute",
                  top: 30,
                  right: 30,
                  color: "rgba(26,60,52,0.06)",
                  transform: "scaleX(-1)",
                }}
              />

              <div className="relative flex flex-col gap-8">
                {/* Contexte */}
                <div className="flex items-center gap-3 flex-wrap">
                  <span
                    className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold"
                    style={{
                      backgroundColor: "rgba(232,80,26,0.1)",
                      color: "#E8501A",
                    }}
                  >
                    {testimonial.context}
                  </span>
                  <span
                    className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold"
                    style={{
                      backgroundColor: "rgba(26,127,75,0.12)",
                      color: "#1A7F4B",
                    }}
                  >
                    ✓ {testimonial.gain}
                  </span>
                </div>

                {/* Quote */}
                <blockquote
                  className="font-medium text-balance"
                  style={{
                    fontSize: "clamp(20px, 2vw, 26px)",
                    lineHeight: "1.45",
                    letterSpacing: "-0.015em",
                    color: "#0A0A0A",
                  }}
                >
                  « {testimonial.quote} »
                </blockquote>
              </div>

              {/* Footer auteur + navigation */}
              <div className="relative flex items-center justify-between gap-6 pt-8 border-t" style={{ borderColor: "#E2E8E4" }}>
                <div className="flex items-center gap-4">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-white flex-shrink-0"
                    style={{
                      background: testimonial.color,
                      fontSize: "16px",
                    }}
                  >
                    {testimonial.initials}
                  </div>
                  <div>
                    <div
                      className="font-bold"
                      style={{
                        fontSize: "17px",
                        color: "#0A0A0A",
                      }}
                    >
                      {testimonial.name}
                    </div>
                    <div
                      style={{
                        fontSize: "14px",
                        color: "#4A4A4A",
                      }}
                    >
                      {testimonial.role} · {testimonial.company}
                    </div>
                  </div>
                </div>

                {/* Boutons navigation */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={prev}
                    className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200"
                    style={{
                      backgroundColor: "#FFFFFF",
                      border: "1px solid #E2E8E4",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#1A3C34";
                      e.currentTarget.style.borderColor = "#1A3C34";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#FFFFFF";
                      e.currentTarget.style.borderColor = "#E2E8E4";
                    }}
                    aria-label="Précédent"
                  >
                    <ChevronLeft
                      size={18}
                      style={{ color: "#1A3C34" }}
                    />
                  </button>
                  <button
                    onClick={next}
                    className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200"
                    style={{
                      backgroundColor: "#1A3C34",
                      border: "1px solid #1A3C34",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#142E28";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#1A3C34";
                    }}
                    aria-label="Suivant"
                  >
                    <ChevronRight
                      size={18}
                      style={{ color: "#FFFFFF" }}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Vignettes des autres témoignages */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            {TESTIMONIALS.map((t, i) => {
              const isActive = i === activeIndex;
              return (
                <button
                  key={t.name}
                  onClick={() => setActiveIndex(i)}
                  className="text-left p-5 rounded-2xl transition-all duration-300"
                  style={{
                    backgroundColor: isActive ? "#1A3C34" : "#F7F8F9",
                    border: `1px solid ${isActive ? "#1A3C34" : "#E2E8E4"}`,
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-white flex-shrink-0"
                      style={{
                        background: t.color,
                        fontSize: "13px",
                      }}
                    >
                      {t.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div
                        className="font-bold truncate"
                        style={{
                          fontSize: "14px",
                          color: isActive ? "#FFFFFF" : "#0A0A0A",
                        }}
                      >
                        {t.name}
                      </div>
                      <div
                        className="truncate"
                        style={{
                          fontSize: "12px",
                          color: isActive
                            ? "rgba(255,255,255,0.7)"
                            : "#4A4A4A",
                        }}
                      >
                        {t.role}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
