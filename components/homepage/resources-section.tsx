"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/design-system";
import { BookOpen, Video, FileText, Download } from "lucide-react";

export function ResourcesSection() {
  const resources = [
    {
      icon: BookOpen,
      title: "Guide complet des entretiens",
      description: "Tout ce que vous devez savoir sur le processus de recrutement",
      type: "Guide",
    },
    {
      icon: Video,
      title: "Masterclass narrative",
      description: "Apprenez à construire une histoire impactante",
      type: "Vidéo",
    },
    {
      icon: FileText,
      title: "Templates de CV premium",
      description: "Modèles optimisés pour les cabinets de conseil",
      type: "Template",
    },
    {
      icon: Download,
      title: "Checklist préparation",
      description: "Liste complète pour ne rien oublier",
      type: "Checklist",
    },
  ];

  return (
    <Section variant="muted" padding="lg" id="ressources">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-semibold text-text mb-4">
            Ressources gratuites
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Commencez à vous préparer dès maintenant avec nos ressources
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {resources.map((resource, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="bg-surface rounded-lg p-6 border border-gray-200 shadow-card hover:shadow-elevated transition-shadow cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <resource.icon className="w-6 h-6 text-primary" />
              </div>
              <span className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs rounded-full mb-3">
                {resource.type}
              </span>
              <h3 className="text-lg font-semibold text-text mb-2">{resource.title}</h3>
              <p className="text-text-secondary text-sm leading-relaxed">{resource.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Blog preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-12"
        >
          <div className="bg-surface rounded-lg p-8 border border-gray-200 shadow-premium">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-text">Derniers articles</h3>
              <a href="/blog" className="text-primary font-medium hover:underline">
                Voir tout →
              </a>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: "Comment structurer votre narrative",
                  category: "Technique",
                  readTime: "5 min",
                },
                {
                  title: "Les 5 erreurs à éviter en entretien",
                  category: "Conseils",
                  readTime: "4 min",
                },
                {
                  title: "Préparer le fit interview",
                  category: "Stratégie",
                  readTime: "6 min",
                },
              ].map((article, index) => (
                <div key={index} className="group cursor-pointer">
                  <span className="text-xs text-primary font-medium">{article.category}</span>
                  <h4 className="text-text font-medium mt-2 mb-2 group-hover:text-primary transition-colors">
                    {article.title}
                  </h4>
                  <p className="text-sm text-text-muted">{article.readTime} de lecture</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </Section>
  );
}
