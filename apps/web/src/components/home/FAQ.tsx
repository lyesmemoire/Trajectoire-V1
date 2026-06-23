"use client";

import { useState } from "react";
import { Plus, Minus, Mail } from "lucide-react";
import posthog from "posthog-js";
import { Container, SectionHeader, Card, LinkButton, Badge } from "@/components/ui";

// ── Constantes d'analytics ────────────────────────────────────────
// Centralise les events PostHog pour : (1) éviter les fautes de frappe,
// (2) faciliter la recherche/remplacement, (3) permettre un typage strict.
const ANALYTICS_EVENTS = {
  FAQ_OPENED: "faq_opened",
} as const;

const FAQ_ITEMS = [
  {
    id: "faq-1",
    category: "Méthode",
    question: "Combien de temps faut-il pour voir des résultats concrets ?",
    answer:
      "L'évaluation initiale prend 10 minutes et vous donne immédiatement votre profil comportemental complet. Pour une transformation mesurable (gain de confiance, clarté décisionnelle, préparation à un moment précis), comptez 4 à 8 semaines selon votre intensité. Les premiers gains apparaissent dès la 2e semaine.",
  },
  {
    id: "faq-2",
    category: "Confidentialité",
    question: "Mes données sont-elles partagées avec mon employeur ?",
    answer:
      "Jamais. Trajectoire est un outil strictement personnel. Vos évaluations, simulations et insights restent confidentiels et chiffrés. Hébergement 100% français, conforme RGPD. Même si votre entreprise prend en charge votre abonnement, elle n'a aucun accès à vos données individuelles.",
  },
  {
    id: "faq-3",
    category: "Méthode",
    question: "Qu'est-ce qui rend votre méthode différente du coaching classique ?",
    answer:
      "Trois choses : (1) elle est mesurable — vous suivez votre progression en chiffres, pas en ressenti ; (2) elle est disponible 24/7 — coaching IA contextuel à 22h la veille d'un comité, sans réservation ; (3) elle est calibrée — nos algorithmes sont entraînés sur 2 400+ parcours réels de cadres et validés par des chercheurs ESCP/HEC.",
  },
  {
    id: "faq-4",
    category: "Pour qui",
    question: "Est-ce vraiment fait pour mon profil ?",
    answer:
      "Trajectoire est conçu pour les cadres, managers et professionnels expérimentés (28-55 ans) qui préparent un moment décisif : promotion, prise de direction, négociation, mobilité interne, transition. Si vous êtes en début de carrière (< 5 ans), notre offre Essentiel est adaptée. Si vous êtes dirigeant exécutif, l'offre Direction inclut un accompagnement humain.",
  },
  {
    id: "faq-5",
    category: "Pratique",
    question: "Combien de temps par semaine dois-je y consacrer ?",
    answer:
      "30 à 45 minutes par semaine suffisent pour suivre le programme standard. Les simulations interactives durent 10-20 minutes. Le coaching IA contextuel s'utilise à la demande (avant un événement, après un feedback). Tout est conçu pour s'intégrer dans un agenda de cadre, pas pour l'alourdir.",
  },
  {
    id: "faq-6",
    category: "Tarification",
    question: "Comment fonctionne l'essai gratuit ?",
    answer:
      "Vous accédez gratuitement à l'évaluation comportementale complète (10 minutes) et recevez votre profil Career DNA sans aucune carte bancaire requise. Si vous souhaitez ensuite débloquer les simulations et le coaching IA, vous choisissez l'offre adaptée. Aucun engagement de durée — vous pouvez annuler en 1 clic à tout moment.",
  },
  {
    id: "faq-7",
    category: "Technologie",
    question: "Comment fonctionne l'IA comportementale ?",
    answer:
      "Notre IA croise trois sources : votre auto-évaluation structurée, l'analyse de vos productions (CV, présentations, vidéos de simulation) et un référentiel de 2 400+ profils de cadres anonymisés. Elle détecte vos schémas récurrents, vos angles morts et vos zones de progression. Aucune donnée n'est utilisée pour entraîner des modèles externes.",
  },
  {
    id: "faq-8",
    category: "Pratique",
    question: "Que se passe-t-il si je ne suis pas satisfait ?",
    answer:
      "Garantie satisfait ou remboursé pendant 30 jours, sans justification. Si Trajectoire ne vous apporte pas la clarté annoncée, nous vous remboursons intégralement. Notre taux de satisfaction actuel est de 94% — mais nous préférons une rupture nette à un client insatisfait.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 lg:py-32 bg-surface-muted">
      <Container>
        <SectionHeader
          badge="Questions fréquentes"
          badgeVariant="neutral"
          title={<>Tout ce que vous voulez savoir <span className="text-brand-primary">avant de vous lancer</span>.</>}
          className="mb-16"
        />

        {/* Accordion */}
        <div className="max-w-4xl mx-auto flex flex-col gap-3">
          {FAQ_ITEMS.map((item, i) => {
            const isOpen = i === openIndex;
            const buttonId = `${item.id}-button`;
            const panelId = `${item.id}-panel`;
            return (
              <Card
                key={item.id}
                variant="default"
                padding="none"
                className={`overflow-hidden transition-all duration-200 border ${
                  isOpen
                    ? "border-brand-primary shadow-soft"
                    : "border-border hover:border-brand-primary/50"
                }`}
              >
                <button
                  id={buttonId}
                  onClick={() => {
                    const willOpen = !isOpen;
                    setOpenIndex(willOpen ? i : null);
                    if (willOpen) {
                      posthog.capture(ANALYTICS_EVENTS.FAQ_OPENED, {
                        question: item.question,
                        category: item.category,
                      });
                    }
                  }}
                  className="w-full flex items-center justify-between gap-6 p-6 lg:p-7 text-left bg-transparent border-none outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-inset"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                >
                  <div className="flex items-center gap-4 lg:gap-5 flex-1">
                    <Badge
                      variant={isOpen ? "warning" : "neutral"}
                      className="hidden sm:inline-flex"
                    >
                      {item.category}
                    </Badge>
                    <h3 className="text-body font-bold text-ink flex-1">
                      {item.question}
                    </h3>
                  </div>

                  <div
                    className={[
                      "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                      "transition-all duration-200",
                      isOpen
                        ? "bg-brand-primary text-[var(--color-on-brand)]"
                        : "bg-surface-muted text-ink-muted group-hover:bg-brand-primary/10 group-hover:text-brand-primary",
                    ].join(" ")}
                    aria-hidden="true"
                  >
                    {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                  </div>
                </button>

                {/* Contenu */}
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className={`grid transition-all duration-200 ease-in-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-6 lg:px-7 pb-7 sm:pl-[104px]">
                      <p className="text-body text-ink-muted leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Bloc de contact */}
        <div className="max-w-4xl mx-auto mt-12">
          <Card
            variant="dark"
            padding="lg"
            className="flex flex-col md:flex-row md:items-center justify-between gap-6 text-center md:text-left"
          >
            <div>
              <div className="text-body font-bold text-white mb-2">
                Une autre question ?
              </div>
              <p className="text-body-sm text-white/75">
                Notre équipe vous répond en moins de 2 heures ouvrées.
              </p>
            </div>
            <LinkButton
              href="mailto:contact@trajectoire.io"
              external
              variant="accent"
              size="lg"
              className="shrink-0 w-full md:w-auto"
            >
              <Mail className="mr-2 h-5 w-5" />
              Contacter l'équipe
            </LinkButton>
          </Card>
        </div>
      </Container>
    </section>
  );
}
