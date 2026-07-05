"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/design-system";
import { X, Check } from "lucide-react";

export function ComparisonSection() {
  return (
    <Section variant="muted" padding="lg">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-semibold text-text mb-4">
            Avant vs Après
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            La différence entre préparer seul et être accompagné par des experts
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Before */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="bg-surface rounded-lg p-8 border border-gray-200 shadow-card"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-error/10 flex items-center justify-center">
                <X className="w-6 h-6 text-error" />
              </div>
              <h3 className="text-2xl font-semibold text-text">Seul</h3>
            </div>
            <ul className="space-y-4">
              {[
                "Préparation improvisée et aléatoire",
                "Pas de feedback objectif sur votre performance",
                "Narrative confuse et peu impactante",
                "Stress et incertitude le jour J",
                "Taux de réussite inférieur à 30%",
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3 text-text-secondary">
                  <X className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* After */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="bg-surface rounded-lg p-8 border-2 border-primary shadow-premium relative"
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="bg-primary text-white text-sm font-medium px-4 py-1 rounded-full">
                Recommandé
              </span>
            </div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
                <Check className="w-6 h-6 text-success" />
              </div>
              <h3 className="text-2xl font-semibold text-text">Accompagné</h3>
            </div>
            <ul className="space-y-4">
              {[
                "Méthode éprouvée par +1,200 professionnels",
                "Feedback précis de recruteurs expérimentés",
                "Narrative structurée et mémorable",
                "Confiance totale et maîtrise le jour J",
                "92% de taux de réussite",
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3 text-text">
                  <Check className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  <span className="font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Guarantee highlight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-12 bg-primary/5 rounded-lg p-8 border border-primary/10"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-text mb-2">Garantie satisfaction</h3>
              <p className="text-text-secondary">
                Si vous n'êtes pas satisfait de votre progression après 3 sessions, nous vous remboursons intégralement. Sans condition.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </Section>
  );
}
