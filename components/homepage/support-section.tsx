"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/design-system";
import { Video, FileText, Calendar, MessageSquare } from "lucide-react";

export function SupportSection() {
  const supportItems = [
    {
      icon: Video,
      title: "Sessions vidéo enregistrées",
      description: "Reprenez chaque entraînement pour analyser votre progression en détail",
    },
    {
      icon: FileText,
      title: "Ressources exclusives",
      description: "Templates, guides et exemples de réussite utilisés par nos candidats",
    },
    {
      icon: Calendar,
      title: "Planning sur-mesure",
      description: "Calendrier adapté à votre emploi du temps avec des objectifs clairs",
    },
    {
      icon: MessageSquare,
      title: "Feedback illimité",
      description: "Échanges réguliers avec votre coach dédié, 7 jours sur 7",
    },
  ];

  return (
    <Section variant="muted" padding="lg" id="accompagnement">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-semibold text-text mb-4">
            Un accompagnement complet
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Tout ce dont vous avez besoin pour réussir, en un seul endroit
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {supportItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="bg-surface rounded-lg p-6 border border-gray-200 shadow-card hover:shadow-elevated transition-shadow"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <item.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-text mb-2">{item.title}</h3>
              <p className="text-text-secondary text-sm leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Support highlight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-12 bg-surface rounded-lg p-8 border border-gray-200 shadow-premium"
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-semibold text-text mb-4">
                Un coach expert, entièrement dédié à votre réussite
              </h3>
              <p className="text-text-secondary leading-relaxed mb-6">
                Chaque candidat est accompagné par un expert ayant recruté pour McKinsey, BCG ou Bain. Votre coach connaît exactement ce que les recruteurs recherchent et vous prépare en conséquence.
              </p>
              <ul className="space-y-3">
                {[
                  "Ancien recruteur de cabinet prestigieux",
                  "Disponibilité 7j/7 pour vos questions",
                  "Suivi personnalisé et adaptatif",
                  "Confidentialité totale garantie",
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3 text-text-secondary">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg p-8 flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <MessageSquare className="w-12 h-12 text-primary" />
                </div>
                <p className="text-text font-semibold">Échanges illimités</p>
                <p className="text-text-secondary text-sm">Avec votre coach</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </Section>
  );
}
