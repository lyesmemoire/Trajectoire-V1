"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/design-system";
import { Quote } from "lucide-react";

export function TestimonialsSection() {
  const testimonials = [
    {
      quote: "J'ai passé 6 entretiens sans succès avant Trajectoire. En 3 mois d'accompagnement, j'ai non seulement obtenu l'offre chez McKinsey, mais j'ai aussi négocié un salaire 35% au-dessus de ma demande initiale. Le retour sur investissement est incroyable.",
      author: "Marie Dubois",
      role: "Consultante Senior",
      company: "McKinsey & Company",
      avatar: "MD",
    },
    {
      quote: "Ce qui différencie Trajectoire, c'est que les coaches savent exactement ce que les recruteurs recherchent. Ils m'ont corrigé des détails que je n'aurais jamais remarqués seul. Offre chez BCG obtenue au premier entretien final.",
      author: "Thomas Laurent",
      role: "Manager",
      company: "Boston Consulting Group",
      avatar: "TL",
    },
    {
      quote: "Je sortais d'une grande école mais je n'avais aucune expérience en entretien de conseil. L'accompagnement m'a donné une structure claire et une confiance totale. Aujourd'hui consultante chez Bain, je recommande Trajectoire à tous mes camarades.",
      author: "Sophie Martin",
      role: "Consultante",
      company: "Bain & Company",
      avatar: "SM",
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
            Ce que disent nos candidats
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Des histoires de réussite, des parcours inspirants
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="bg-surface rounded-lg p-8 border border-gray-200 shadow-card hover:shadow-elevated transition-shadow"
            >
              <Quote className="w-8 h-8 text-primary/20 mb-4" />
              <p className="text-text leading-relaxed mb-6">{testimonial.quote}</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-semibold text-text">{testimonial.author}</p>
                  <p className="text-sm text-text-secondary">
                    {testimonial.role} • {testimonial.company}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional testimonial highlight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-12 bg-primary/5 rounded-lg p-8 border border-primary/10"
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-lg text-text leading-relaxed mb-4">
                "La rigueur de l'approche et la qualité du feedback m'ont permis de progresser rapidement. Chaque session était ciblée et constructive. Je recommande vivement."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                  PL
                </div>
                <div>
                  <p className="font-semibold text-text">Pierre Leroy</p>
                  <p className="text-sm text-text-secondary">
                    Directeur • Accenture
                  </p>
                </div>
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-4xl font-bold text-primary mb-2">+1,200</p>
              <p className="text-text-secondary">Professionnels accompagnés</p>
            </div>
          </div>
        </motion.div>
      </div>
    </Section>
  );
}
