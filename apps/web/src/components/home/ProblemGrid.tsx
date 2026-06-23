"use client";

import { AlertCircle, EyeOff, Compass, Flame } from "lucide-react";

const PROBLEMS = [
  {
    icon: Compass,
    title: "Vous prenez vos décisions de carrière à l'aveugle",
    description:
      "Promotion, changement de poste, mobilité interne… vous tranchez à l'instinct, sans grille de lecture claire de vos vraies forces et de vos angles morts.",
    consequence: "Résultat : choix subis, pas choisis.",
  },
  {
    icon: EyeOff,
    title: "Vous préparez vos entretiens sans méthode",
    description:
      "Vous relisez votre CV, vous notez quelques arguments, vous croisez les doigts. Mais vous n'avez aucune visibilité sur comment vous êtes réellement perçu.",
    consequence: "Résultat : entretiens en mode survie.",
  },
  {
    icon: AlertCircle,
    title: "Vous doutez de vos vraies forces",
    description:
      "Le syndrome de l'imposteur, les retours flous de vos managers, l'absence de feedback structuré… vous ne savez plus ce qui vous différencie vraiment.",
    consequence: "Résultat : posture qui s'effrite.",
  },
  {
    icon: Flame,
    title: "Vous subissez le stress des moments à fort enjeu",
    description:
      "Comité de direction, négociation salariale, prise de poste : votre préparation mentale est laissée au hasard. Le stress prend le dessus quand l'enjeu monte.",
    consequence: "Résultat : performance en dessous de votre niveau réel.",
  },
];

export default function ProblemGrid() {
  return (
    <section
      className="relative py-24 lg:py-32"
      style={{ backgroundColor: "#F7F8F9" }}
    >
      <div className="max-w-[1400px] mx-auto px-8 lg:px-12">

        {/* Header */}
        <div className="flex flex-col items-center text-center gap-5 mb-20">
          <span
            className="inline-flex items-center px-4 py-2 rounded-full text-xs font-semibold tracking-widest uppercase"
            style={{
              background: "rgba(232,80,26,0.08)",
              color: "#E8501A",
              border: "1px solid rgba(232,80,26,0.15)",
            }}
          >
            Vous reconnaissez-vous ?
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
            Les 4 angles morts qui plafonnent{" "}
            <span style={{ color: "#1A3C34" }}>
              les carrières les plus prometteuses
            </span>
            .
          </h2>
          <p
            className="max-w-2xl"
            style={{
              fontSize: "18px",
              lineHeight: "1.65",
              color: "#4A4A4A",
            }}
          >
            Trajectoire a été conçu pour résoudre ces 4 problèmes précis,
            avec une méthode mesurable et reproductible.
          </p>
        </div>

        {/* Grille des problèmes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {PROBLEMS.map(({ icon: Icon, title, description, consequence }, i) => (
            <div
              key={title}
              className="relative flex flex-col gap-5 p-8 lg:p-10 rounded-3xl transition-all duration-300"
              style={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #E2E8E4",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 20px 48px rgba(0,0,0,0.08)";
                e.currentTarget.style.transform = "translateY(-4px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {/* Numéro discret */}
              <div
                className="absolute top-8 right-8 font-bold"
                style={{
                  fontSize: "60px",
                  color: "#E2E8E4",
                  lineHeight: 1,
                  letterSpacing: "-0.05em",
                }}
              >
                0{i + 1}
              </div>

              {/* Icône */}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: "rgba(232,80,26,0.08)" }}
              >
                <Icon size={26} style={{ color: "#E8501A" }} />
              </div>

              {/* Titre */}
              <h3
                className="font-bold text-balance max-w-md"
                style={{
                  fontSize: "22px",
                  lineHeight: "1.25",
                  letterSpacing: "-0.02em",
                  color: "#0A0A0A",
                }}
              >
                {title}
              </h3>

              {/* Description */}
              <p
                style={{
                  fontSize: "15px",
                  lineHeight: "1.65",
                  color: "#4A4A4A",
                }}
              >
                {description}
              </p>

              {/* Conséquence */}
              <div
                className="mt-2 pt-5 border-t flex items-center gap-2"
                style={{ borderColor: "#E2E8E4" }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: "#E8501A" }}
                />
                <span
                  className="font-semibold"
                  style={{
                    fontSize: "14px",
                    color: "#1A3C34",
                  }}
                >
                  {consequence}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Transition vers la suite */}
        <div className="flex flex-col items-center text-center gap-4 mt-20">
          <div
            className="w-px h-12"
            style={{ backgroundColor: "#E2E8E4" }}
          />
          <p
            className="font-medium"
            style={{
              fontSize: "16px",
              color: "#4A4A4A",
            }}
          >
            Voici comment Trajectoire transforme chacun de ces angles morts en{" "}
            <strong style={{ color: "#1A3C34" }}>levier de performance</strong>.
          </p>
        </div>
      </div>
    </section>
  );
}
