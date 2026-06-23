"use client";

import Link from "next/link";
import {
  ArrowRight,
  Target,
  Brain,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";

const BADGES = [
  "Évaluation Comportementale",
  "Préparation Stratégique",
  "Données, pas intuition",
];

const PROGRESSION_DATA = [
  { week: "S1", value: 45 },
  { week: "S2", value: 52 },
  { week: "S3", value: 58 },
  { week: "S4", value: 67 },
  { week: "S5", value: 74 },
  { week: "S6", value: 82 },
  { week: "S7", value: 88 },
  { week: "S8", value: 94 },
];

const INSIGHTS = [
  { label: "Posture exécutive renforcée", status: "success" },
  { label: "Gestion du stress maîtrisée", status: "success" },
  { label: "Cohérence CV / discours validée", status: "success" },
];

export default function Hero() {
  const maxValue = Math.max(...PROGRESSION_DATA.map((d) => d.value));

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden pt-24 pb-16"
      style={{ backgroundColor: "#FFFFFF" }}
    >
      {/* Backgrounds décoratifs */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 70% 40%, rgba(26,60,52,0.05) 0%, transparent 60%)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 40% 30% at 30% 70%, rgba(232,80,26,0.03) 0%, transparent 60%)",
        }}
      />

      <div className="relative w-full max-w-[1400px] mx-auto px-8 lg:px-12">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">

          {/* ── Colonne gauche ── */}
          <div className="flex flex-col gap-8">

            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              {BADGES.map((badge) => (
                <span
                  key={badge}
                  className="inline-flex items-center px-4 py-2 rounded-full text-xs font-semibold tracking-widest uppercase"
                  style={{
                    background: "rgba(26,60,52,0.06)",
                    color: "#1A3C34",
                    border: "1px solid rgba(26,60,52,0.12)",
                  }}
                >
                  {badge}
                </span>
              ))}
            </div>

            {/* Titre */}
            <h1
              className="font-bold text-balance"
              style={{
                fontSize: "clamp(40px, 4.5vw, 64px)",
                lineHeight: "1.05",
                letterSpacing: "-0.04em",
                color: "#0A0A0A",
              }}
            >
              Préparez vos{" "}
              <span style={{ color: "#1A3C34" }}>décisions de carrière</span>{" "}
              avec une{" "}
              <span
                style={{
                  color: "#E8501A",
                  fontStyle: "italic",
                }}
              >
                confiance absolue
              </span>
              .
            </h1>

            {/* Sous-titre */}
            <p
              style={{
                fontSize: "20px",
                lineHeight: "1.6",
                color: "#4A4A4A",
              }}
            >
              Cadres, managers et professionnels expérimentés utilisent
              Trajectoire pour évaluer leurs forces comportementales, simuler
              les moments à fort enjeu et prendre leurs décisions de carrière
              avec clarté et méthode. <strong style={{ color: "#0A0A0A" }}>Pas d&apos;intuition. Des données.</strong>
            </p>

            {/* CTA */}
            <div className="flex flex-wrap items-center gap-5 mt-2">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200"
                style={{
                  backgroundColor: "#E8501A",
                  color: "white",
                  padding: "18px 36px",
                  fontSize: "17px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#D04415";
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 12px 32px rgba(232,80,26,0.35)";
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
                href="#method"
                className="inline-flex items-center gap-2 font-medium transition-all duration-200"
                style={{ color: "#1A3C34", fontSize: "16px" }}
              >
                Découvrir la méthode
                <ArrowRight size={18} />
              </Link>
            </div>

            {/* Garanties */}
            <div className="flex flex-wrap items-center gap-6 mt-2">
              {[
                "Gratuit pour commencer",
                "Aucune carte bancaire",
                "Résultats en 10 minutes",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2"
                  style={{ color: "#4A4A4A", fontSize: "14px" }}
                >
                  <CheckCircle2 size={16} style={{ color: "#1A7F4B" }} />
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* ── Colonne droite — Dashboard ── */}
          <div className="w-full">
            <div
              className="relative rounded-3xl overflow-hidden w-full"
              style={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #E2E8E4",
                boxShadow: "0 32px 80px rgba(0,0,0,0.12)",
              }}
            >
              {/* Header dashboard */}
              <div
                className="flex items-center justify-between px-7 py-5 border-b"
                style={{
                  borderColor: "#E2E8E4",
                  backgroundColor: "#F7F8F9",
                }}
              >
                <div>
                  <div
                    className="text-[10px] font-bold uppercase tracking-widest"
                    style={{ color: "#4A4A4A" }}
                  >
                    Tableau de bord
                  </div>
                  <div
                    className="text-sm font-semibold mt-0.5"
                    style={{ color: "#0A0A0A" }}
                  >
                    Sophie M. — Directrice Marketing
                  </div>
                </div>
                <div
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full"
                  style={{ backgroundColor: "rgba(26,127,75,0.1)" }}
                >
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span
                    className="text-xs font-semibold"
                    style={{ color: "#1A7F4B" }}
                  >
                    PRÊTE
                  </span>
                </div>
              </div>

              {/* Body dashboard */}
              <div className="p-7 flex flex-col gap-7">

                {/* KPIs comportementaux */}
                <div className="grid grid-cols-3 gap-4">
                  <div
                    className="p-5 rounded-2xl"
                    style={{ backgroundColor: "#F7F8F9" }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Target size={16} style={{ color: "#1A3C34" }} />
                      <span
                        className="text-xs font-semibold uppercase tracking-wider"
                        style={{ color: "#4A4A4A" }}
                      >
                        Confiance
                      </span>
                    </div>
                    <div
                      className="font-bold"
                      style={{ fontSize: "28px", color: "#0A0A0A", lineHeight: 1 }}
                    >
                      94%
                    </div>
                    <div className="text-xs mt-2" style={{ color: "#1A7F4B" }}>
                      ↑ +26 pts en 8 sem.
                    </div>
                  </div>

                  <div
                    className="p-5 rounded-2xl"
                    style={{ backgroundColor: "#F7F8F9" }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Brain size={16} style={{ color: "#E8501A" }} />
                      <span
                        className="text-xs font-semibold uppercase tracking-wider"
                        style={{ color: "#4A4A4A" }}
                      >
                        Clarté
                      </span>
                    </div>
                    <div
                      className="font-bold"
                      style={{ fontSize: "28px", color: "#0A0A0A", lineHeight: 1 }}
                    >
                      Élevée
                    </div>
                    <div className="text-xs mt-2" style={{ color: "#4A4A4A" }}>
                      Score 8.9/10
                    </div>
                  </div>

                  <div
                    className="p-5 rounded-2xl"
                    style={{ backgroundColor: "#F7F8F9" }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp size={16} style={{ color: "#1A7F4B" }} />
                      <span
                        className="text-xs font-semibold uppercase tracking-wider"
                        style={{ color: "#4A4A4A" }}
                      >
                        Préparation
                      </span>
                    </div>
                    <div
                      className="font-bold"
                      style={{ fontSize: "28px", color: "#0A0A0A", lineHeight: 1 }}
                    >
                      85%
                    </div>
                    <div className="text-xs mt-2" style={{ color: "#4A4A4A" }}>
                      12 simulations
                    </div>
                  </div>
                </div>

                {/* Graphique de progression */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className="text-xs font-semibold uppercase tracking-wider"
                      style={{ color: "#4A4A4A" }}
                    >
                      Progression sur 8 semaines
                    </span>
                    <span
                      className="text-xs font-semibold"
                      style={{ color: "#1A7F4B" }}
                    >
                      +49 pts
                    </span>
                  </div>
                  <div
                    className="flex items-end gap-2 p-4 rounded-2xl"
                    style={{ 
                      backgroundColor: "#F7F8F9",
                      height: "176px",
                    }}
                  >
                    {PROGRESSION_DATA.map((d, i) => (
                      <div
                        key={d.week}
                        className="flex-1 flex flex-col items-center gap-2"
                      >
                        <div
                          className="w-full rounded-t-lg transition-all duration-500"
                          style={{
                            height: `${(d.value / maxValue) * 100}%`,
                            minHeight: "20px",
                            backgroundColor:
                              i === PROGRESSION_DATA.length - 1
                                ? "#E8501A"
                                : "#1A3C34",
                            opacity:
                              i === PROGRESSION_DATA.length - 1 ? 1 : 0.6 + i * 0.05,
                          }}
                        />
                        <span
                          className="text-[10px] font-medium"
                          style={{ color: "#4A4A4A" }}
                        >
                          {d.week}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Insights IA */}
                <div className="flex flex-col gap-2.5">
                  <span
                    className="text-xs font-semibold uppercase tracking-wider mb-1"
                    style={{ color: "#4A4A4A" }}
                  >
                    Insights comportementaux
                  </span>
                  {INSIGHTS.map((insight) => (
                    <div
                      key={insight.label}
                      className="flex items-center gap-3 p-4 rounded-xl"
                      style={{ backgroundColor: "#F7F8F9" }}
                    >
                      <CheckCircle2
                        size={18}
                        style={{ color: "#1A7F4B", flexShrink: 0 }}
                      />
                      <span
                        className="text-sm font-medium"
                        style={{ color: "#0A0A0A" }}
                      >
                        {insight.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
