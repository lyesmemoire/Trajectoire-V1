"use client";

import { TrendingUp, Users, Award, Clock } from "lucide-react";

const HEADLINE_STATS = [
  {
    value: "94%",
    label: "se sentent prêts",
    sublabel: "avant un moment décisif",
    icon: Award,
  },
  {
    value: "+26",
    label: "points de confiance",
    sublabel: "en moyenne sur 8 semaines",
    icon: TrendingUp,
  },
  {
    value: "2 400+",
    label: "cadres accompagnés",
    sublabel: "depuis le lancement",
    icon: Users,
  },
  {
    value: "8/10",
    label: "obtiennent leur objectif",
    sublabel: "promotion, mobilité, négociation",
    icon: Clock,
  },
];

const DETAILED_RESULTS = [
  {
    metric: "Préparation aux entretiens",
    before: 42,
    after: 89,
    unit: "%",
  },
  {
    metric: "Clarté sur ses forces",
    before: 38,
    after: 92,
    unit: "%",
  },
  {
    metric: "Gestion du stress en situation",
    before: 51,
    after: 84,
    unit: "%",
  },
  {
    metric: "Cohérence CV / discours",
    before: 47,
    after: 95,
    unit: "%",
  },
];

export default function Results() {
  return (
    <section
      id="results"
      className="relative py-24 lg:py-32 overflow-hidden"
      style={{ backgroundColor: "#1A3C34", color: "#FFFFFF" }}
    >
      {/* Backgrounds décoratifs */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 80% 20%, rgba(232,80,26,0.12) 0%, transparent 60%)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 40% 40% at 20% 80%, rgba(232,80,26,0.06) 0%, transparent 60%)",
        }}
      />

      <div className="relative max-w-[1400px] mx-auto px-8 lg:px-12">

        {/* Header */}
        <div className="flex flex-col items-center text-center gap-5 mb-20">
          <span
            className="inline-flex items-center px-4 py-2 rounded-full text-xs font-semibold tracking-widest uppercase"
            style={{
              background: "rgba(255,255,255,0.08)",
              color: "#FFFFFF",
              border: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            Les résultats parlent
          </span>
          <h2
            className="font-bold text-balance max-w-4xl"
            style={{
              fontSize: "clamp(32px, 4.5vw, 56px)",
              lineHeight: "1.05",
              letterSpacing: "-0.035em",
              color: "#FFFFFF",
            }}
          >
            Ce que vivent les cadres qui utilisent{" "}
            <span style={{ color: "#E8501A", fontStyle: "italic" }}>
              Trajectoire
            </span>
            .
          </h2>
          <p
            className="max-w-2xl"
            style={{
              fontSize: "18px",
              lineHeight: "1.65",
              color: "rgba(255,255,255,0.75)",
            }}
          >
            Chiffres mesurés sur les 2 400+ parcours suivis depuis le lancement.
            Mise à jour mensuelle.
          </p>
        </div>

        {/* Headline Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {HEADLINE_STATS.map(({ value, label, sublabel, icon: Icon }) => (
            <div
              key={label}
              className="p-7 rounded-2xl transition-all duration-300"
              style={{
                backgroundColor: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  "rgba(255,255,255,0.08)";
                e.currentTarget.style.transform = "translateY(-4px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor =
                  "rgba(255,255,255,0.04)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                style={{ backgroundColor: "rgba(232,80,26,0.15)" }}
              >
                <Icon size={20} style={{ color: "#E8501A" }} />
              </div>

              <div
                className="font-bold mb-2"
                style={{
                  fontSize: "clamp(36px, 4vw, 52px)",
                  lineHeight: 1,
                  letterSpacing: "-0.03em",
                  color: "#FFFFFF",
                }}
              >
                {value}
              </div>

              <div
                className="font-semibold mb-1"
                style={{
                  fontSize: "16px",
                  color: "#FFFFFF",
                }}
              >
                {label}
              </div>

              <div
                style={{
                  fontSize: "13px",
                  color: "rgba(255,255,255,0.6)",
                  lineHeight: 1.5,
                }}
              >
                {sublabel}
              </div>
            </div>
          ))}
        </div>

        {/* Detailed Results — Avant / Après */}
        <div
          className="rounded-3xl p-8 lg:p-12"
          style={{
            backgroundColor: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.12)",
            paddingLeft: "clamp(24px, 4vw, 56px)",
            paddingRight: "clamp(24px, 4vw, 56px)",
          }}
        >
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-10">
            <div>
              <div
                className="font-bold text-xs tracking-widest uppercase mb-3"
                style={{ color: "#E8501A" }}
              >
                Avant → Après
              </div>
              <h3
                className="font-bold"
                style={{
                  fontSize: "clamp(24px, 2.8vw, 36px)",
                  lineHeight: "1.15",
                  letterSpacing: "-0.025em",
                  color: "#FFFFFF",
                }}
              >
                Progression moyenne sur 8 semaines de programme.
              </h3>
            </div>
            <div
              className="flex items-center gap-6 text-xs font-semibold tracking-wider uppercase"
              style={{ color: "rgba(255,255,255,0.6)" }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: "rgba(255,255,255,0.25)" }}
                />
                Avant
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: "#E8501A" }}
                />
                Après
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-8">
            {DETAILED_RESULTS.map(({ metric, before, after, unit }) => {
              const gain = after - before;
              return (
                <div key={metric}>
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className="font-semibold"
                      style={{
                        fontSize: "16px",
                        color: "#FFFFFF",
                      }}
                    >
                      {metric}
                    </span>
                    <span
                      className="font-bold"
                      style={{ fontSize: "14px", color: "#E8501A" }}
                    >
                      +{gain}{unit}
                    </span>
                  </div>

                  {/* Barre de progression */}
                  <div
                    className="relative h-3 rounded-full overflow-hidden"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.1)",
                      marginLeft: "0",
                      marginRight: "0",
                    }}
                  >
                    {/* Avant */}
                    <div
                      className="absolute top-0 left-0 h-full rounded-full"
                      style={{
                        width: `${before}%`,
                        backgroundColor: "rgba(255,255,255,0.3)",
                      }}
                    />
                    {/* Après */}
                    <div
                      className="absolute top-0 left-0 h-full rounded-full transition-all duration-1000"
                      style={{
                        width: `${after}%`,
                        backgroundColor: "#E8501A",
                      }}
                    />
                  </div>

                  <div
                    className="flex items-center justify-between mt-2 text-xs"
                    style={{ color: "rgba(255,255,255,0.5)" }}
                  >
                    <span>{before}{unit}</span>
                    <span style={{ color: "#FFFFFF", fontWeight: 600 }}>
                      {after}{unit}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
