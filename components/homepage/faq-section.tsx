"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/design-system";
import { FAQ } from "@/components/design-system";

export function FAQSection() {
  const faqItems = [
    {
      question: "Comment fonctionne l'accompagnement ?",
      answer: "Notre accompagnement commence par un diagnostic approfondi de votre profil, forces et objectifs. Nous construisons ensuite une narrative personnalisée, puis nous procédons à des entraînements intensifs avec feedback de recruteurs expérimentés. Chaque session est enregistrée pour analyse et progression.",
    },
    {
      question: "Combien de temps dure le programme ?",
      answer: "La durée moyenne est de 6 semaines, mais elle s'adapte à votre emploi du temps et à vos échéances d'entretiens. Certains candidats réussissent en 4 semaines, d'autres préfèrent un accompagnement plus étalé sur 8-10 semaines. Nous nous adaptons à vous.",
    },
    {
      question: "Les coaches sont-ils vraiment des recruteurs ?",
      answer: "Oui, tous nos coaches ont recruté pour McKinsey, BCG, Bain ou des cabinets équivalents. Ils connaissent exactement ce que les recruteurs recherchent et vous préparent en conséquence. Pas de théorie, que de la pratique basée sur l'expérience réelle.",
    },
    {
      question: "Quels sont les tarifs ?",
      answer: "Nos tarifs commencent à 2,490€ pour le programme standard. C'est un investissement qui se rentabilise généralement dès votre première augmentation salariale (moyenne +40% chez nos candidats). Contactez-nous pour un devis personnalisé selon votre profil.",
    },
    {
      question: "Proposez-vous une garantie ?",
      answer: "Oui, nous offrons une garantie satisfaction : si vous n'êtes pas satisfait de votre progression après 3 sessions, nous vous remboursons intégralement. Sans condition. Notre objectif est votre réussite, pas votre argent.",
    },
    {
      question: "Puis-je commencer à tout moment ?",
      answer: "Oui, nos programmes démarrent tout au long de l'année. Nous adaptons le planning à votre disponibilité et à vos échéances d'entretiens. La plupart de nos candidats commencent 2-3 mois avant leur première échéance importante.",
    },
    {
      question: "Est-ce confidentiel ?",
      answer: "Absolument. Tout ce que vous partagez avec votre coach reste strictement confidentiel. Nous ne partageons aucune information avec des tiers, y compris votre employeur actuel ou potentiel.",
    },
    {
      question: "Et si je n'ai pas d'expérience en conseil ?",
      answer: "C'est précisément notre spécialité. Nous accompagnons autant de profils en transition que de consultants expérimentés. Notre méthode s'adapte à votre parcours et met en valeur vos transferts de compétences.",
    },
  ];

  return (
    <Section variant="muted" padding="lg">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-semibold text-text mb-4">
            Questions fréquentes
          </h2>
          <p className="text-lg text-text-secondary">
            Tout ce que vous devez savoir sur notre accompagnement
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <FAQ items={faqItems} />
        </motion.div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-12 text-center"
        >
          <p className="text-text-secondary mb-4">
            Vous avez d'autres questions ?
          </p>
          <a
            href="/contact"
            className="text-primary font-medium hover:underline"
          >
            Contactez-nous →
          </a>
        </motion.div>
      </div>
    </Section>
  );
}
