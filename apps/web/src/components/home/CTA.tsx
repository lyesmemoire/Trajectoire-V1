"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock, ShieldCheck } from "lucide-react";

const GUARANTEES = [
  { icon: CheckCircle2, label: "Gratuit pour commencer" },
  { icon: Clock, label: "Résultats en 10 minutes" },
  { icon: ShieldCheck, label: "30 jours satisfait ou remboursé" },
];

export default function CTA() {
  return (
    <section
      className="relative py-24 lg:py-32 overflow-hidden"
      style={{ backgroundColor: "#F7F8F9" }}
    >
      <div className="max-w-[1400px] mx-auto px-8 lg:px-12">

        {/* Card CTA principale */}
        <div
          className="relative rounded-[2.5rem] overflow-hidden"
          style={{
            backgroundColor: "#1A3C34",
            color: "#FFFFFF",
          }}
        >
          {/* Backgrounds décoratifs */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 70% 60% at 80% 20%, rgba(232,80,26,0.18) 0%, transparent 60%)",
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 50% 40% at 10% 90%, rgba(232,80,26,0.08) 0%, transparent 60%)",
            }}
          />

          {/* Pattern grille subtil */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
              opacity: 0.5,
            }}
          />

          <div className="relative grid lg:grid-cols-12 gap-12 lg:gap-16 items-center p-10 lg:p-20">

            {/* ── Colonne gauche — Pitch ── */}
            <div className="lg:col-span-7 flex flex-col gap-8">

              {/* Badge */}
              <span
                className="inline-flex items-center self-start px-4 py-2 rounded-full text-xs font-semibold tracking-widest uppercase"
                style={{
                  background: "rgba(232,80,26,0.18)",
                  color: "#FFFFFF",
                  border: "1px solid rgba(232,80,26,0.3)",
                }}
              >
                Démarrez aujourd&apos;hui
              </span>

              {/* Titre */}
              <h2
                className="font-bold text-balance"
                style={{
                  fontSize: "clamp(36px, 5vw, 64px)",
                  lineHeight: "1.0",
                  letterSpacing: "-0.04em",
                }}
              >
                Votre prochaine décision de carrière mérite{" "}
                <span style={{ color: "#E8501A", fontStyle: "italic" }}>
                  mieux qu&apos;une intuition
                </span>
                .
              </h2>

              {/* Sous-titre */}
              <p
                style={{
                  fontSize: "19px",
                  lineHeight: "1.65",
                  color: "rgba(255,255,255,0.8)",
                }}
              >
                En 10 minutes, vous obtenez votre profil comportemental complet
                et un plan d&apos;action personnalisé. Sans carte bancaire,
                sans engagement.
              </p>

              {/* CTA buttons */}
              <div className="flex flex-wrap items-center gap-5 mt-2">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200"
                  style={{
                    backgroundColor: "#E8501A",
                    color: "#FFFFFF",
                    padding: "18px 36px",
                    fontSize: "17px",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#D04415";
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow =
                      "0 16px 40px rgba(232,80,26,0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#E8501A";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  Démarrer mon évaluation
                  <ArrowRight size={20} />
                </Link>

                <Link
                  href="#pricing"
                  className="inline-flex items-center gap-2 font-medium transition-all duration-200"
                  style={{
                    color: "rgba(255,255,255,0.85)",
                    fontSize: "16px",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#FFFFFF";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "rgba(255,255,255,0.85)";
                  }}
                >
                  Voir les offres
                  <ArrowRight size={18} />
                </Link>
              </div>

              {/* Garanties */}
              <div className="flex flex-wrap items-center gap-6 pt-4">
                {GUARANTEES.map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="flex items-center gap-2"
                    style={{
                      color: "rgba(255,255,255,0.8)",
                      fontSize: "14px",
                    }}
                  >
                    <Icon
                      size={16}
                      style={{ color: "#E8501A", flexShrink: 0 }}
                    />
                    {label}
                  </div>
                ))}
              </div>
            </div>

            {/* ── Colonne droite — Preuve sociale visuelle ── */}
            <div className="lg:col-span-5">
              <div className="flex flex-col gap-5">

                {/* Bloc stats */}
                <div
                  className="rounded-2xl p-6 lg:p-7"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.12)",
                  }}
                >
                  <div className="flex items-center gap-4 mb-5">
                    {/* Avatars */}
                    <div className="flex -space-x-3">
                      {[
                        "linear-gradient(135deg, #E8501A, #D04415)",
                        "linear-gradient(135deg, #1A7F4B, #1A3C34)",
                        "linear-gradient(135deg, #2D5F50, #1A3C34)",
                        "linear-gradient(135deg, #4A4A4A, #1A3C34)",
                      ].map((bg, i) => (
                        <div
                          key={i}
                          className="w-10 h-10 rounded-full border-2"
                          style={{
                            background: bg,
                            borderColor: "#1A3C34",
                          }}
                        />
                      ))}
                      <div
                        className="w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold text-xs"
                        style={{
                          backgroundColor: "rgba(255,255,255,0.15)",
                          borderColor: "#1A3C34",
                          color: "#FFFFFF",
                        }}
                      >
                        +2k
                      </div>
                    </div>
                  </div>

                  <div
                    className="font-bold mb-1"
                    style={{
                      fontSize: "24px",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    2 400+ cadres nous font confiance
                  </div>
                  <p
                    style={{
                      fontSize: "14px",
                      color: "rgba(255,255,255,0.65)",
                      lineHeight: 1.6,
                    }}
                  >
                    Promotion, mobilité, négociation, prise de poste : ils ont
                    transformé leurs moments décisifs en réussites mesurables.
                  </p>
                </div>

                {/* Bloc témoignage compact */}
                <div
                  className="rounded-2xl p-6 lg:p-7"
                  style={{
                    backgroundColor: "rgba(232,80,26,0.1)",
                    border: "1px solid rgba(232,80,26,0.25)",
                  }}
                >
                  <div
                    className="font-bold text-xs tracking-widest uppercase mb-3"
                    style={{ color: "#E8501A" }}
                  >
                    Témoignage récent
                  </div>
                  <blockquote
                    className="font-medium mb-4"
                    style={{
                      fontSize: "16px",
                      lineHeight: "1.6",
                      color: "#FFFFFF",
                    }}
                  >
                    « J&apos;y suis arrivée sans cette boule au ventre
                    habituelle. J&apos;ai obtenu le poste. »
                  </blockquote>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-xs"
                      style={{
                        background: "linear-gradient(135deg, #1A3C34, #2D5F50)",
                      }}
                    >
                      SM
                    </div>
                    <div>
                      <div
                        className="font-bold text-sm"
                        style={{ color: "#FFFFFF" }}
                      >
                        Sophie M.
                      </div>
                      <div
                        className="text-xs"
                        style={{ color: "rgba(255,255,255,0.65)" }}
                      >
                        Directrice Marketing
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
