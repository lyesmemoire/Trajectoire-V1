"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/design-system";
import { Target, MessageSquare, TrendingUp, CheckCircle } from "lucide-react";

export function MethodSection() {
  const steps = [
    {
      icon: Target,
      title: "Diagnostic précis",
      description: "Analyse approfondie de votre profil, forces, faiblesses et objectifs de carrière",
    },
    {
      icon: MessageSquare,
      title: "Narrative structurée",
      description: "Construction d'une histoire mémorable qui vous différencie des autres candidats",
    },
    {
      icon: TrendingUp,
      title: "Entraînement intensif",
      description: "Simulations réalistes avec feedback immédiat de recruteurs expérimentés",
    },
    {
      icon: CheckCircle,
      title: "Validation finale",
      description: "Préparation complète jusqu'à la maîtrise totale et la confiance absolue",
    },
  ];

  return (
    <Section padding="lg" id="methode">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-semibold text-text mb-4">
            Une méthode en 4 étapes
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Chaque étape est conçue pour maximiser votre impact et votre confiance
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="relative"
            >
              <div className="bg-surface rounded-lg p-8 border border-gray-200 shadow-card h-full">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <step.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-sm font-medium text-primary">
                        Étape {index + 1}
                      </span>
                      <h3 className="text-xl font-semibold text-text">{step.title}</h3>
                    </div>
                    <p className="text-text-secondary leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 border-t-2 border-dashed border-gray-300" />
              )}
            </motion.div>
          ))}
        </div>

        {/* Key differentiators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-16 bg-primary/5 rounded-lg p-8 border border-primary/10"
        >
          <h3 className="text-xl font-semibold text-text mb-6 text-center">
            Ce qui nous différencie
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              "Approche basée sur la psychologie comportementale",
              "Feedback de recruteurs actuels",
              "Suivi personnalisé tout au long du parcours",
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                <p className="text-text-secondary">{item}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </Section>
  );
}
