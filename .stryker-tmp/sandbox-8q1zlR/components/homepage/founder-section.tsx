// @ts-nocheck
"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/design-system";
import { Link2 } from "lucide-react";
import Image from "next/image";

export function FounderSection() {
  return (
    <Section padding="lg" id="fondatrice">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-2 gap-12 items-center"
        >
          {/* Founder image */}
          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 shadow-premium">
              <Image
                src="/illustrations/founder-portrait.svg"
                alt="Camille Martin - Fondatrice de Trajectoire"
                width={400}
                height={400}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Founder content */}
          <div className="space-y-6">
            <div>
              <p className="text-sm font-medium text-primary uppercase tracking-wider mb-2">
                La Fondatrice
              </p>
              <h2 className="text-3xl md:text-4xl font-semibold text-text mb-4">
                Camille Martin
              </h2>
              <p className="text-text-secondary leading-relaxed">
                Ancienne recruteuse chez McKinsey, j'ai accompagné plus de 500 candidats vers les cabinets les plus prestigieux. J'ai créé Trajectoire pour démocratiser l'accès à une préparation de haut niveau.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-text">
                Mon parcours
              </h3>
              <ul className="space-y-3">
                {[
                  "10 ans d'expérience en recrutement stratégique",
                  "McKinsey & Company - Directrice Associée",
                  "HEC Paris - Diplômée 2012",
                  "Formatrice certifiée en coaching de carrière",
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3 text-text-secondary">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-2" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-text">
                Ma vision
              </h3>
              <p className="text-text-secondary leading-relaxed">
                Chaque candidat mérite une préparation d'excellence, quelle que soit son origine. Trajectoire rend accessible les méthodes des cabinets de conseil à tous les professionnels ambitieux.
              </p>
            </div>

            {/* Social links */}
            <div className="flex items-center gap-4 pt-4">
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors"
                aria-label="LinkedIn"
              >
                <Link2 className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors"
                aria-label="Twitter"
              >
                <Link2 className="w-5 h-5" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </Section>
  );
}
