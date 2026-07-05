"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/design-system";
import { Briefcase, GraduationCap, Zap, Target } from "lucide-react";

export function ProfilesSection() {
  const profiles = [
    {
      icon: Briefcase,
      title: "Professionnels expérimentés",
      description: "5-15 ans d'expérience, prêts pour un saut de carrière",
      examples: ["Consultants", "Managers", "Directeurs"],
    },
    {
      icon: GraduationCap,
      title: "Jeunes diplômés d'excellence",
      description: "Grandes écoles, premier poste ou stage en entreprise",
      examples: ["HEC", "Polytechnique", "ESSEC", "Centrale"],
    },
    {
      icon: Zap,
      title: "Profils en transition",
      description: "Reconversion ou changement de secteur ambitieux",
      examples: ["Tech vers Conseil", "Industrie vers Finance"],
    },
    {
      icon: Target,
      title: "Candidats à l'international",
      description: "Opportunités à l'étranger ou multinationales",
      examples: ["London", "New York", "Dubai", "Singapour"],
    },
  ];

  return (
    <Section padding="lg">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-semibold text-text mb-4">
            Des profils ambitieux, des objectifs élevés
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Notre méthode s'adapte à votre parcours et à vos ambitions
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {profiles.map((profile, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="bg-surface rounded-lg p-8 border border-gray-200 shadow-card hover:shadow-elevated transition-shadow"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <profile.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-text mb-2">{profile.title}</h3>
                  <p className="text-text-secondary leading-relaxed">{profile.description}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.examples.map((example, exampleIndex) => (
                  <span
                    key={exampleIndex}
                    className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full"
                  >
                    {example}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Personalization note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-12 text-center"
        >
          <p className="text-text-secondary max-w-2xl mx-auto">
            Chaque parcours est unique. Notre approche personnalisée s'adapte à votre histoire, vos forces et vos objectifs spécifiques.
          </p>
        </motion.div>
      </div>
    </Section>
  );
}
