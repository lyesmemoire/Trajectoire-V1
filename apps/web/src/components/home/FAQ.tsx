"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const FAQ_ITEMS = [
  {
    category: "Méthode",
    question: "Combien de temps faut-il pour voir des résultats concrets ?",
    answer:
      "L'évaluation initiale prend 10 minutes et vous donne immédiatement votre profil comportemental complet. Pour une transformation mesurable (gain de confiance, clarté décisionnelle, préparation à un moment précis), comptez 4 à 8 semaines selon votre intensité. Les premiers gains apparaissent dès la 2e semaine.",
  },
  {
    category: "Confidentialité",
    question: "Mes données sont-elles partagées avec mon employeur ?",
    answer:
      "Jamais. Trajectoire est un outil strictement personnel. Vos évaluations, simulations et insights restent confidentiels et chiffrés. Hébergement 100% français, conforme RGPD. Même si votre entreprise prend en charge votre abonnement, elle n'a aucun accès à vos données individuelles.",
  },
  {
    category: "Méthode",
    question: "Qu'est-ce qui rend votre méthode différente du coaching classique ?",
    answer:
      "Trois choses : (1) elle est mesurable — vous suivez votre progression en chiffres, pas en ressenti ; (2) elle est disponible 24/7 — coaching IA contextuel à 22h la veille d'un comité, sans réservation ; (3) elle est calibrée — nos algorithmes sont entraînés sur 2 400+ parcours réels de cadres et validés par des chercheurs ESCP/HEC.",
  },
  {
    category: "Pour qui",
    question: "Est-ce vraiment fait pour mon profil ?",
    answer:
      "Trajectoire est conçu pour les cadres, managers et professionnels expérimentés (28-55 ans) qui préparent un moment décisif : promotion, prise de direction, négociation, mobilité interne, transition. Si vous êtes en début de carrière (< 5 ans), notre offre Essentiel est adaptée. Si vous êtes dirigeant exécutif, l'offre Direction inclut un accompagnement humain.",
  },
  {
    category: "Pratique",
    question: "Combien de temps par semaine dois-je y consacrer ?",
    answer:
      "30 à 45 minutes par semaine suffisent pour suivre le programme standard. Les simulations interactives durent 10-20 minutes. Le coaching IA contextuel s'utilise à la demande (avant un événement, après un feedback). Tout est conçu pour s'intégrer dans un agenda de cadre, pas pour l'alourdir.",
  },
  {
    category: "Tarification",
    question: "Comment fonctionne l'essai gratuit ?",
    answer:
      "Vous accédez gratuitement à l'évaluation comportementale complète (10 minutes) et recevez votre profil Career DNA sans aucune carte bancaire requise. Si vous souhaitez ensuite débloquer les simulations et le coaching IA, vous choisissez l'offre adaptée. Aucun engagement de durée — vous pouvez annuler en 1 clic à tout moment.",
  },
  {
    category: "Technologie",
    question: "Comment fonctionne l'IA comportementale ?",
    answer:
      "Notre IA croise trois sources : votre auto-évaluation structurée, l'analyse de vos productions (CV, présentations, vidéos de simulation) et un référentiel de 2 400+ profils de cadres anonymisés. Elle détecte vos schémas récurrents, vos angles morts et vos zones de progression. Aucune donnée n'est utilisée pour entraîner des modèles externes.",
  },
  {
    category: "Pratique",
    question: "Que se passe-t-il si je ne suis pas satisfait ?",
    answer:
      "Garantie satisfait ou remboursé pendant 30 jours, sans justification. Si Trajectoire ne vous apporte pas la clarté annoncée, nous vous remboursons intégralement. Notre taux de satisfaction actuel est de 94% — mais nous préférons une rupture nette à un client insatisfait.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="relative py-24 lg:py-32"
      style={{ backgroundColor: "#F7F8F9" }}
    >
      <div className="max-w-[1100px] mx-auto px-8 lg:px-12">

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
            Questions fréquentes
          </span>
          <h2
            className="font-bold text-balance max-w-3xl"
            style={{
              fontSize: "clamp(32px, 4.5vw, 56px)",
              lineHeight: "1.05",
              letterSpacing: "-0.035em",
              color: "#0A0A0A",
            }}
          >
            Tout ce que vous voulez savoir{" "}
            <span style={{ color: "#1A3C34" }}>avant de vous lancer</span>.
          </h2>
        </div>

        {/* Accordion */}
        <div className="flex flex-col gap-3">
          {FAQ_ITEMS.map((item, i) => {
            const isOpen = i === openIndex;
            return (
              <div
                key={item.question}
                className="rounded-2xl overflow-hidden transition-all duration-300"
                style={{
                  backgroundColor: "#FFFFFF",
                  border: `1px solid ${isOpen ? "#1A3C34" : "#E2E8E4"}`,
                }}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-6 p-6 lg:p-7 text-left"
                >
                  <div className="flex items-center gap-5 flex-1">
                    <span
                      className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold tracking-widest uppercase flex-shrink-0"
                      style={{
                        backgroundColor: isOpen
                          ? "rgba(232,80,26,0.1)"
                          : "rgba(26,60,52,0.08)",
                        color: isOpen ? "#E8501A" : "#1A3C34",
                      }}
                    >
                      {item.category}
                    </span>
                    <h3
                      className="font-semibold"
                      style={{
                        fontSize: "17px",
                        color: "#0A0A0A",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {item.question}
                    </h3>
                  </div>

                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300"
                    style={{
                      backgroundColor: isOpen ? "#1A3C34" : "#F7F8F9",
                    }}
                  >
                    {isOpen ? (
                      <Minus size={16} style={{ color: "#FFFFFF" }} />
                    ) : (
                      <Plus size={16} style={{ color: "#1A3C34" }} />
                    )}
                  </div>
                </button>

                {/* Contenu */}
                <div
                  className="overflow-hidden transition-all duration-300"
                  style={{
                    maxHeight: isOpen ? "600px" : "0",
                    opacity: isOpen ? 1 : 0,
                  }}
                >
                  <div
                    className="px-6 lg:px-7 pb-7 pl-[88px] lg:pl-[105px]"
                    style={{
                      fontSize: "15px",
                      lineHeight: "1.7",
                      color: "#4A4A4A",
                    }}
                  >
                    {item.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bloc de contact */}
        <div
          className="mt-12 p-8 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 text-center md:text-left"
          style={{
            backgroundColor: "#1A3C34",
            color: "#FFFFFF",
          }}
        >
          <div>
            <div
              className="font-bold mb-1"
              style={{ fontSize: "18px" }}
            >
              Une autre question ?
            </div>
            <p
              style={{
                fontSize: "15px",
                color: "rgba(255,255,255,0.75)",
              }}
            >
              Notre équipe vous répond en moins de 2 heures ouvrées.
            </p>
          </div>
          <a
            href="mailto:contact@trajectoire.io"
            className="inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200"
            style={{
              backgroundColor: "#E8501A",
              color: "#FFFFFF",
              padding: "14px 28px",
              fontSize: "15px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#D04415";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#E8501A";
            }}
          >
            Contacter l&apos;équipe
          </a>
        </div>
      </div>
    </section>
  );
}
