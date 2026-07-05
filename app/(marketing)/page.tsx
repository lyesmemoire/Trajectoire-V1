"use client";

import { motion } from "framer-motion";
import { Hero, HeroBadge, HeroActions } from "@/components/design-system";
import { Button } from "@/components/design-system";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/design-system";
import { StatCard } from "@/components/design-system";
import { Testimonial } from "@/components/design-system";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/design-system";
import { ArrowRight, Play, Check, Star, Zap, Target, TrendingUp, Users, Award, Shield, Clock, Globe, X } from "lucide-react";
import Image from "next/image";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <Hero
        variant="default"
        align="left"
        subtitle="Nouvelle méthode 2026"
        title="Enfin une préparation qui change vraiment la donne."
        description="Arrêtez de préparer vos entretiens au hasard. Développez une narrative irrésistible, maîtrisez chaque interaction, et obtenez l'offre que vous méritez."
        badge={<HeroBadge icon={Zap}>Nouvelle méthode 2026</HeroBadge>}
        actions={
          <HeroActions>
            <Button size="lg" asChild>
              <a href="/auth/signup">
                Réserver mon accompagnement
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href="#methode">
                Voir comment ça marche
                <Play className="ml-2 h-5 w-5" />
              </a>
            </Button>
          </HeroActions>
        }
      />

      {/* Stats Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <StatCard
              title="Professionnels accompagnés"
              value="+1,200"
              change={{ value: 25, period: "Depuis 2024" }}
              icon={Users}
            />
            <StatCard
              title="Taux de réussite"
              value="92%"
              change={{ value: 5, period: "Offres obtenues" }}
              icon={TrendingUp}
            />
            <StatCard
              title="Satisfaction client"
              value="4.9/5"
              change={{ value: 0.2, period: "Avis vérifiés" }}
              icon={Star}
            />
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Pourquoi 90% des candidats échouent ?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                La plupart des candidats se contentent de préparer des réponses génériques. Ils ignorent que chaque entreprise a sa propre culture, ses propres valeurs, et ses propres attentes.
              </p>
              <div className="space-y-4">
                {[
                  "Réponses mémorisées sans personnalisation",
                  "Manque de compréhension de l'entreprise",
                  "Narrative incohérente et peu convaincante",
                  "Absence de préparation aux questions pièges",
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-1">
                      <X className="w-4 h-4 text-red-600" />
                    </div>
                    <p className="text-gray-700">{item}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/illustrations/hero-manager.svg"
                  alt="Candidat en entretien"
                  width={600}
                  height={400}
                  className="w-full"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-24 bg-gray-900 text-white" id="methode">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Notre méthode en 3 étapes
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Une approche structurée et personnalisée pour maximiser vos chances de succès
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                title: "Diagnostic personnalisé",
                description: "Analyse approfondie de votre parcours, de vos forces et de vos axes d'amélioration.",
              },
              {
                icon: Zap,
                title: "Narrative sur-mesure",
                description: "Construction d'une histoire cohérente et authentique qui vous différencie.",
              },
              {
                icon: Award,
                title: "Entraînement intensif",
                description: "Simulations réalistes avec feedback détaillé pour perfectionner chaque réponse.",
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
              >
                <Card className="bg-gray-800 border-gray-700 text-white h-full">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center mb-4">
                      <step.icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-white">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-300">
                      {step.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ils nous font confiance
            </h2>
            <p className="text-xl text-gray-600">
              Des candidats placés dans les meilleures entreprises
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
            {[
              { src: "/illustrations/logo-google.svg", alt: "Google" },
              { src: "/illustrations/logo-amazon.svg", alt: "Amazon" },
              { src: "/illustrations/logo-mckinsey.svg", alt: "McKinsey" },
              { src: "/illustrations/logo-bcg.svg", alt: "BCG" },
            ].map((logo, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                className="h-12 opacity-60 hover:opacity-100 transition-opacity"
              >
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={120}
                  height={40}
                  className="h-full w-auto"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ce que nos candidats disent
            </h2>
            <p className="text-xl text-gray-600">
              Des histoires de réussite authentiques
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Marie Dupont",
                role: "Product Manager",
                company: "Google",
                content: "Grâce à Trajectoire, j'ai décroché mon rêve chez Google. La préparation était impeccable et les feedbacks très pertinents.",
                avatar: "MD",
              },
              {
                name: "Pierre Martin",
                role: "Consultant",
                company: "McKinsey",
                content: "L'approche structurée m'a permis de construire une narrative cohérente. J'ai eu 3 offres en 2 semaines.",
                avatar: "PM",
              },
              {
                name: "Sophie Bernard",
                role: "Data Scientist",
                company: "Amazon",
                content: "Les simulations réalistes m'ont préparé à toutes les situations. Je me recommande à 100%.",
                avatar: "SB",
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
              >
                <Card className="h-full">
                  <CardContent className="pt-6">
                    <div className="flex gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-700 mb-6">{testimonial.content}</p>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-blue-600 text-white">
                          {testimonial.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-gray-900">{testimonial.name}</p>
                        <p className="text-sm text-gray-600">{testimonial.role} chez {testimonial.company}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-blue-600 to-violet-600 rounded-2xl p-12 text-center text-white"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Prêt à transformer votre carrière ?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Rejoignez les +1,200 professionnels qui ont réussi grâce à notre méthode
            </p>
            <Button size="lg" variant="secondary" asChild>
              <a href="/auth/signup">
                Commencer maintenant
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-3xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Questions fréquentes
            </h2>
          </motion.div>

          <div className="space-y-4">
            {[
              {
                question: "Combien de temps dure l'accompagnement ?",
                answer: "Notre programme intensif dure 2 semaines avec des sessions quotidiennes et un suivi personnalisé.",
              },
              {
                question: "L'accompagnement est-il adapté à mon secteur ?",
                answer: "Oui, nous adaptons notre méthode à tous les secteurs : tech, conseil, finance, industrie, etc.",
              },
              {
                question: "Quelle est votre garantie de réussite ?",
                answer: "Nous offrons une satisfaction à 100%. Si vous n'obtenez pas d'offre après 3 mois, nous vous remboursons intégralement.",
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{faq.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{faq.answer}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
