"use client";

import {
  Brain,
  Zap,
  ShieldCheck,
  LineChart,
  MessageSquareQuote,
  Lock,
} from "lucide-react";

export default function BenefitsBento() {
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
              background: "rgba(26,60,52,0.06)",
              color: "#1A3C34",
              border: "1px solid rgba(26,60,52,0.12)",
            }}
          >
            Pourquoi Trajectoire
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
            Ce que vous ne trouverez{" "}
            <span style={{ color: "#E8501A", fontStyle: "italic" }}>
              nulle part ailleurs
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
            Une combinaison unique de science comportementale, IA avancée et
            méthodologie de coaching exécutif.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 auto-rows-[minmax(220px,auto)]">

          {/* Carte 1 — LARGE (2 cols) — IA Comportementale */}
          <div
            className="md:col-span-2 lg:col-span-2 lg:row-span-2 relative overflow-hidden rounded-3xl p-8 lg:p-10 flex flex-col justify-between"
            style={{
              backgroundColor: "#1A3C34",
              color: "#FFFFFF",
            }}
          >
            {/* Pattern décoratif */}
            <div
              className="absolute -top-20 -right-20 w-80 h-80 rounded-full pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, rgba(232,80,26,0.15) 0%, transparent 70%)",
              }}
            />

            <div className="relative">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                style={{ backgroundColor: "rgba(255,255,255,0.12)" }}
              >
                <Brain size={26} style={{ color: "#FFFFFF" }} />
              </div>

              <div
                className="font-bold text-xs tracking-widest uppercase mb-3"
                style={{ color: "rgba(255,255,255,0.6)" }}
              >
                Le cœur du produit
              </div>

              <h3
                className="font-bold mb-4"
                style={{
                  fontSize: "clamp(26px, 2.8vw, 36px)",
                  lineHeight: "1.1",
                  letterSpacing: "-0.025em",
                }}
              >
                Une IA comportementale entraînée sur 2 400+ profils de cadres.
              </h3>

              <p
                style={{
                  fontSize: "16px",
                  lineHeight: "1.65",
                  color: "rgba(255,255,255,0.75)",
                }}
              >
                Pas un chatbot générique. Un moteur d&apos;analyse construit
                avec des chercheurs en psychologie du travail et calibré
                sur les vrais critères d&apos;évaluation des comités de direction.
              </p>
            </div>

            <div className="relative grid grid-cols-3 gap-4 mt-8 pt-8 border-t" style={{ borderColor: "rgba(255,255,255,0.15)" }}>
              <div>
                <div className="font-bold text-2xl" style={{ color: "#E8501A" }}>
                  +127
                </div>
                <div className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.6)" }}>
                  signaux analysés
                </div>
              </div>
              <div>
                <div className="font-bold text-2xl" style={{ color: "#FFFFFF" }}>
                  94%
                </div>
                <div className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.6)" }}>
                  précision
                </div>
              </div>
              <div>
                <div className="font-bold text-2xl" style={{ color: "#FFFFFF" }}>
                  10min
                </div>
                <div className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.6)" }}>
                  pour démarrer
                </div>
              </div>
            </div>
          </div>

          {/* Carte 2 — Simulations live */}
          <div
            className="md:col-span-1 lg:col-span-2 rounded-3xl p-8 flex flex-col gap-5"
            style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #E2E8E4",
            }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: "rgba(232,80,26,0.1)" }}
            >
              <Zap size={22} style={{ color: "#E8501A" }} />
            </div>

            <div>
              <h3
                className="font-bold mb-2"
                style={{
                  fontSize: "22px",
                  lineHeight: "1.2",
                  letterSpacing: "-0.02em",
                  color: "#0A0A0A",
                }}
              >
                Simulations vidéo en temps réel
              </h3>
              <p
                style={{
                  fontSize: "15px",
                  lineHeight: "1.6",
                  color: "#4A4A4A",
                }}
              >
                Entraînez-vous sur vos vrais scénarios : entretien de promo,
                pitch board, négociation. Feedback IA immédiat sur votre posture,
                votre voix et votre clarté.
              </p>
            </div>
          </div>

          {/* Carte 3 — Confidentialité */}
          <div
            className="rounded-3xl p-8 flex flex-col gap-5"
            style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #E2E8E4",
            }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: "rgba(26,127,75,0.1)" }}
            >
              <Lock size={22} style={{ color: "#1A7F4B" }} />
            </div>

            <div>
              <h3
                className="font-bold mb-2"
                style={{
                  fontSize: "20px",
                  lineHeight: "1.2",
                  letterSpacing: "-0.02em",
                  color: "#0A0A0A",
                }}
              >
                Confidentialité absolue
              </h3>
              <p
                style={{
                  fontSize: "14px",
                  lineHeight: "1.6",
                  color: "#4A4A4A",
                }}
              >
                Hébergement français. RGPD. Vos données ne sont jamais partagées
                avec votre employeur.
              </p>
            </div>
          </div>

          {/* Carte 4 — Méthode validée */}
          <div
            className="rounded-3xl p-8 flex flex-col gap-5"
            style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #E2E8E4",
            }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: "rgba(26,60,52,0.1)" }}
            >
              <ShieldCheck size={22} style={{ color: "#1A3C34" }} />
            </div>

            <div>
              <h3
                className="font-bold mb-2"
                style={{
                  fontSize: "20px",
                  lineHeight: "1.2",
                  letterSpacing: "-0.02em",
                  color: "#0A0A0A",
                }}
              >
                Méthode validée scientifiquement
              </h3>
              <p
                style={{
                  fontSize: "14px",
                  lineHeight: "1.6",
                  color: "#4A4A4A",
                }}
              >
                Conçue en partenariat avec l&apos;ESCP et HEC. Validée sur
                2 400+ parcours réels.
              </p>
            </div>
          </div>

          {/* Carte 5 — Progression mesurable */}
          <div
            className="md:col-span-2 lg:col-span-2 rounded-3xl p-8 flex flex-col gap-5"
            style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #E2E8E4",
            }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: "rgba(26,60,52,0.1)" }}
            >
              <LineChart size={22} style={{ color: "#1A3C34" }} />
            </div>

            <div>
              <h3
                className="font-bold mb-2"
                style={{
                  fontSize: "22px",
                  lineHeight: "1.2",
                  letterSpacing: "-0.02em",
                  color: "#0A0A0A",
                }}
              >
                Une progression mesurable, semaine après semaine.
              </h3>
              <p
                style={{
                  fontSize: "15px",
                  lineHeight: "1.6",
                  color: "#4A4A4A",
                }}
              >
                Tableau de bord chiffré, jalons hebdomadaires, ré-évaluation
                automatique. Vous voyez votre courbe de confiance monter en
                temps réel. Pas de bullshit, des données.
              </p>
            </div>
          </div>

          {/* Carte 6 — Coaching IA contextuel */}
          <div
            className="md:col-span-2 lg:col-span-2 rounded-3xl p-8 flex flex-col gap-5"
            style={{
              backgroundColor: "#E8501A",
              color: "#FFFFFF",
            }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: "rgba(255,255,255,0.18)" }}
            >
              <MessageSquareQuote size={22} style={{ color: "#FFFFFF" }} />
            </div>

            <div>
              <h3
                className="font-bold mb-2"
                style={{
                  fontSize: "22px",
                  lineHeight: "1.2",
                  letterSpacing: "-0.02em",
                }}
              >
                Coaching IA contextuel, 24/7.
              </h3>
              <p
                style={{
                  fontSize: "15px",
                  lineHeight: "1.6",
                  color: "rgba(255,255,255,0.85)",
                }}
              >
                Posez vos questions à 22h la veille d&apos;un comité. Obtenez
                des réponses calibrées sur votre profil, votre contexte, votre
                enjeu. Comme un coach exécutif dans votre poche.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
