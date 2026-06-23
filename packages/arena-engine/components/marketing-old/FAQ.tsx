"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "Comment fonctionne le système de crédits ?",
    answer:
      "1 crédit = 1 analyse de CV OU 1 simulation d'entretien. Les crédits n'expirent pas et peuvent être utilisés quand vous le souhaitez. Si vous n'êtes pas satisfait, nous remboursons intégralement sous 30 jours.",
  },
  {
    question: "Mes données sont-elles sécurisées ?",
    answer:
      "Absolument. Nous utilisons un chiffrement de niveau bancaire (AES-256), nos servers sont hébergés en Europe (conformité RGPD stricte), et nous ne revendons JAMAIS vos données. Vous pouvez supprimer votre compte et toutes vos données à tout moment.",
  },
  {
    question: "L'IA remplace-t-elle vraiment un coach carrière ?",
    answer:
      "Notre IA est entraînée sur des milliers d'entretiens réels et des critères ATS validés par des recruteurs. Elle fournit un feedback structuré et exploitable instantanément. Pour des besoins très spécifiques (négociation salariale, stratégie long-terme), un coach humain reste pertinent, mais pour l'optimisation CV et la préparation entretien standard, notre IA est aussi efficace pour une fraction du coût.",
  },
  {
    question: "Quels formats de CV sont acceptés ?",
    answer:
      "Nous acceptons uniquement les PDF pour l'instant (limitation de taille : 5 MB). Notre moteur d'extraction fonctionne même avec des CV complexes (colonnes, graphiques). Si vous avez un Word, convertissez-le en PDF avant upload.",
  },
  {
    question: "Puis-je utiliser le service pour plusieurs postes ?",
    answer:
      "Oui ! Chaque analyse est spécifique à un couple (CV + Offre d'emploi). Si vous postulez à 10 postes différents, vous pouvez générer 10 analyses personnalisées. C'est justement l'intérêt du système de crédits vs un abonnement mensuel.",
  },
  {
    question: "Y a-t-il une garantie de résultat ?",
    answer:
      "Nous garantissons une amélioration de votre score ATS, mais nous ne pouvons pas garantir l'embauche (qui dépend de nombreux facteurs hors de notre contrôle). Cependant, nos utilisateurs constatent en moyenne +127% de réponses positives après optimisation. Si vous n'êtes pas satisfait de l'analyse, nous remboursons le crédit utilisé.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="bg-gradient-to-b from-black to-red-950/20 py-24">
      <div className="container mx-auto px-4">
        {/* Titre */}
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold text-white md:text-5xl">
            Questions Fréquentes
          </h2>
          <p className="text-xl text-gray-400">
            Tout ce que vous devez savoir avant de commencer
          </p>
        </div>

        {/* Liste FAQ */}
        <div className="mx-auto max-w-3xl space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="rounded-lg border border-red-900/30 bg-black/50 backdrop-blur transition-all hover:border-red-700/50"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="flex w-full items-center justify-between p-6 text-left"
              >
                <span className="text-lg font-semibold text-white">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`h-5 w-5 text-red-400 transition-transform ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="border-t border-red-900/30 p-6 pt-4">
                  <p className="text-gray-300">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
