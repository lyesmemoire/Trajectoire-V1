"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/design-system";
import { Shield, Award, Users } from "lucide-react";
import Image from "next/image";

export function TrustSection() {
  const trustItems = [
    {
      icon: Shield,
      title: "Méthode éprouvée",
      description: "Développée avec des recruteurs de McKinsey, BCG et Bain",
    },
    {
      icon: Award,
      title: "Résultats mesurables",
      description: "92% de nos candidats obtiennent leur offre cible",
    },
    {
      icon: Users,
      title: "Communauté exclusive",
      description: "+1,200 professionnels accompagnés depuis 2024",
    },
  ];

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
            Pourquoi les professionnels nous font confiance
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Une approche rigoureuse, des résultats concrets, un accompagnement sur-mesure
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {trustItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="bg-surface rounded-lg p-8 border border-gray-200 shadow-card"
            >
              <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                <item.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-text mb-3">{item.title}</h3>
              <p className="text-text-secondary leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Social proof logos */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-16 pt-16 border-t border-gray-200"
        >
          <p className="text-center text-sm text-text-muted uppercase tracking-wider mb-8">
            Nos candidats rejoignent
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-60">
            <Image src="/illustrations/logo-mckinsey.svg" alt="McKinsey" width={120} height={40} />
            <Image src="/illustrations/logo-bcg.svg" alt="BCG" width={100} height={40} />
            <Image src="/illustrations/logo-bain.svg" alt="Bain" width={100} height={40} />
            <Image src="/illustrations/logo-accenture.svg" alt="Accenture" width={120} height={40} />
            <Image src="/illustrations/logo-google.svg" alt="Google" width={100} height={40} />
            <Image src="/illustrations/logo-amazon.svg" alt="Amazon" width={100} height={40} />
          </div>
        </motion.div>
      </div>
    </Section>
  );
}
