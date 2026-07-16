// @ts-nocheck
"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/design-system";
import { TrendingUp, Award, Target, Clock } from "lucide-react";

export function ResultsSection() {
  const stats = [
    {
      icon: TrendingUp,
      value: "92%",
      label: "Taux de réussite",
      description: "Candidats ayant obtenu leur offre cible",
    },
    {
      icon: Award,
      value: "4.9/5",
      label: "Satisfaction",
      description: "Note moyenne donnée par nos candidats",
    },
    {
      icon: Target,
      value: "+40%",
      label: "Augmentation salariale",
      description: "Moyenne observée chez nos réussites",
    },
    {
      icon: Clock,
      value: "6 sem",
      label: "Durée moyenne",
      description: "Entre le diagnostic et l'offre finale",
    },
  ];

  return (
    <Section variant="muted" padding="lg" id="resultats">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-semibold text-text mb-4">
            Des résultats qui parlent d'eux-mêmes
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Notre engagement : des résultats mesurables et tangibles
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="bg-surface rounded-lg p-6 border border-gray-200 shadow-card text-center"
            >
              <div className="w-12 h-12 mx-auto rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <stat.icon className="w-6 h-6 text-primary" />
              </div>
              <div className="text-3xl font-bold text-text mb-2">{stat.value}</div>
              <div className="text-sm font-medium text-text-secondary mb-2">{stat.label}</div>
              <p className="text-xs text-text-muted">{stat.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Success stories preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-12 bg-surface rounded-lg p-8 border border-gray-200 shadow-premium"
        >
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Marie D.",
                role: "Consultante Senior",
                company: "McKinsey",
                result: "Offre obtenue en 3 mois",
              },
              {
                name: "Thomas L.",
                role: "Manager",
                company: "BCG",
                result: "Augmentation de 40%",
              },
              {
                name: "Sophie M.",
                role: "Directrice",
                company: "Accenture",
                result: "Transition réussie vers le conseil",
              },
            ].map((story, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <span className="text-xl font-semibold text-primary">
                    {story.name.split(" ").map(n => n[0]).join("")}
                  </span>
                </div>
                <p className="font-semibold text-text mb-1">{story.name}</p>
                <p className="text-sm text-text-secondary mb-2">
                  {story.role} • {story.company}
                </p>
                <p className="text-sm text-success font-medium">{story.result}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </Section>
  );
}
