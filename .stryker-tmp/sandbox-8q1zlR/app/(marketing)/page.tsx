// @ts-nocheck
"use client";

import { useState, useEffect } from "react";
import { motion, useScroll } from "framer-motion";
import {
  HeroBadge,
  HeroActions,
  Navbar,
  NavbarLogo,
  NavbarLink,
  NavbarActions,
  Section,
  Container,
  FAQ,
  Testimonial,
  LogoCloud,
  CTA,
  Footer,
  FooterColumn,
  FooterLink,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/design-system";
import {
  ArrowRight,
  Play,
  Zap,
  Target,
  TrendingUp,
  Award,
  Shield,
  X,
  Menu,
  X as Close,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    const unsubscribe = scrollY.on("change", (latest) => {
      setIsScrolled(latest > 50);
    });
    return () => unsubscribe();
  }, [scrollY]);

  const navLinks = [
    { label: "Accueil", href: "#accueil" },
    { label: "Méthode", href: "#methode" },
    { label: "Accompagnement", href: "#accompagnement" },
    { label: "Tarifs", href: "/pricing" },
    { label: "Ressources", href: "/resources" },
    { label: "À propos", href: "#apropos" },
  ];

  return (
    <main className="min-h-screen" style={{ backgroundColor: "#F8F6F3" }}>
      {/* Navigation */}
      <Navbar
        style={{
          background: isScrolled ? "rgba(248, 246, 243, 0.95)" : "rgba(248, 246, 243, 0.8)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
        className={isScrolled ? "shadow-sm" : ""}
      >
        <NavbarLogo href="/">Trajectoire</NavbarLogo>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8">
          {navLinks.map((link) => (
            <NavbarLink key={link.href} href={link.href}>
              {link.label}
            </NavbarLink>
          ))}
        </div>

        <NavbarActions>
          <div className="hidden md:flex gap-4">
            <Button variant="ghost" asChild>
              <Link href="/auth/login">Connexion</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/signup">Créer mon espace</Link>
            </Button>
          </div>
          
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <Close /> : <Menu />}
          </Button>
        </NavbarActions>
      </Navbar>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden bg-white border-b border-gray-200 py-4 px-6"
        >
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-700 hover:text-gray-900 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-2 pt-4 border-t border-gray-200">
              <Button variant="ghost" asChild className="w-full">
                <Link href="/auth/login">Connexion</Link>
              </Button>
              <Button asChild className="w-full">
                <Link href="/auth/signup">Créer mon espace</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      )}
      {/* Hero Section */}
      <Section id="accueil" className="pt-32 pb-20">
        <Container>
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <HeroBadge icon={Zap} className="mb-6">
                Nouvelle méthode 2026
              </HeroBadge>
              <h1 className="font-serif text-5xl md:text-6xl font-semibold text-gray-900 mb-6 leading-tight tracking-tight">
                Préparez vos entretiens stratégiques avec méthode.
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-xl">
                Préparez vos entretiens de management grâce à une approche structurée, des simulations réalistes et des retours personnalisés.
              </p>
              <HeroActions className="mb-8">
                <Button size="lg" asChild>
                  <Link href="/auth/signup">
                    Commencer maintenant
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="#methode">
                    Découvrir la méthode
                    <Play className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </HeroActions>
              <div className="flex flex-wrap gap-6 pt-6 border-t border-gray-200">
                {[
                  { icon: Shield, text: "Confidentialité garantie" },
                  { icon: Award, text: "Accompagnement premium" },
                  { icon: TrendingUp, text: "Résultats mesurables" },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-2">
                    <item.icon className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-gray-600 font-medium">{item.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              <div className="relative rounded-lg overflow-hidden shadow-sm">
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
        </Container>
      </Section>

      {/* Stats Section */}
      <Section className="py-20 bg-white border-y border-gray-200">
        <Container>
          <div className="grid md:grid-cols-3 gap-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-center"
            >
              <div className="text-5xl font-bold text-gray-900 mb-3">+1800</div>
              <div className="text-gray-600">cadres accompagnés</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-center"
            >
              <div className="text-5xl font-bold text-gray-900 mb-3">94%</div>
              <div className="text-gray-600">déclarent être arrivés plus confiants</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center"
            >
              <div className="text-5xl font-bold text-gray-900 mb-3">100%</div>
              <div className="text-gray-600">Préparation adaptée à tous les niveaux de management</div>
            </motion.div>
          </div>
        </Container>
      </Section>

      {/* Problem Section */}
      <Section className="py-24">
        <Container>
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <h2 className="font-serif text-3xl md:text-4xl font-semibold text-gray-900 mb-6 tracking-tight">
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
                    transition={{ delay: index * 0.1, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
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
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              <div className="relative rounded-lg overflow-hidden shadow-sm">
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
        </Container>
      </Section>

      {/* Solution Section */}
      <Section id="methode" className="py-24 bg-white">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-3xl md:text-4xl font-semibold mb-4 tracking-tight text-gray-900">
              Notre méthode en 3 étapes
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
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
                transition={{ delay: index * 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <Card className="h-full hover:border-gray-900 transition-colors">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center mb-4">
                      <step.icon className="w-6 h-6 text-gray-900" />
                    </div>
                    <CardTitle>{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600">
                      {step.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Trust Section */}
      <Section className="py-24 bg-white">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-3xl md:text-4xl font-semibold mb-4 tracking-tight text-gray-900">
              Ils nous font confiance
            </h2>
            <p className="text-xl text-gray-600">
              Des candidats placés dans les meilleures entreprises
            </p>
          </motion.div>

          <LogoCloud
            logos={[
              {
                name: "Google",
                logo: <Image src="/illustrations/logo-google.svg" alt="Google" width={120} height={40} className="h-full w-auto" />,
              },
              {
                name: "Amazon",
                logo: <Image src="/illustrations/logo-amazon.svg" alt="Amazon" width={120} height={40} className="h-full w-auto" />,
              },
              {
                name: "McKinsey",
                logo: <Image src="/illustrations/logo-mckinsey.svg" alt="McKinsey" width={120} height={40} className="h-full w-auto" />,
              },
              {
                name: "BCG",
                logo: <Image src="/illustrations/logo-bcg.svg" alt="BCG" width={120} height={40} className="h-full w-auto" />,
              },
            ]}
            columns={4}
          />
        </Container>
      </Section>

      {/* Testimonials Section */}
      <Section className="py-24 bg-gray-50">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-3xl md:text-4xl font-semibold mb-4 tracking-tight text-gray-900">
              Ce que nos candidats disent
            </h2>
            <p className="text-xl text-gray-600">
              Des histoires de réussite authentiques
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                author: "Marie Dupont",
                role: "Product Manager",
                company: "Google",
                quote: "Grâce à Trajectoire, j'ai décroché mon rêve chez Google. La préparation était impeccable et les feedbacks très pertinents.",
              },
              {
                author: "Pierre Martin",
                role: "Consultant",
                company: "McKinsey",
                quote: "L'approche structurée m'a permis de construire une narrative cohérente. J'ai eu 3 offres en 2 semaines.",
              },
              {
                author: "Sophie Bernard",
                role: "Data Scientist",
                company: "Amazon",
                quote: "Les simulations réalistes m'ont préparé à toutes les situations. Je me recommande à 100%.",
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <Testimonial
                  quote={testimonial.quote}
                  author={testimonial.author}
                  role={testimonial.role}
                  company={testimonial.company}
                />
              </motion.div>
            ))}
          </div>
        </Container>
      </Section>

      {/* CTA Section */}
      <Section className="py-24">
        <Container>
          <CTA
            title="Prêt à transformer votre carrière ?"
            description="Rejoignez les +1,200 professionnels qui ont réussi grâce à notre méthode"
            primaryCTA={{
              label: "Commencer maintenant",
              href: "/auth/signup",
            }}
            variant="primary"
          />
        </Container>
      </Section>

      {/* FAQ Section */}
      <Section id="faq" className="py-24 bg-gray-50">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-3xl md:text-4xl font-semibold mb-4 tracking-tight text-gray-900">
              Questions fréquentes
            </h2>
          </motion.div>

          <FAQ
            items={[
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
            ]}
          />
        </Container>
      </Section>

      {/* Footer */}
      <Footer className="bg-gray-900 text-white">
        <FooterColumn title="Trajectoire">
          <p className="text-gray-400 max-w-sm">
            La plateforme de référence pour la préparation d'entretiens stratégiques.
          </p>
        </FooterColumn>
        <FooterColumn title="Produit">
          <FooterLink href="#methode">Méthode</FooterLink>
          <FooterLink href="/pricing">Tarifs</FooterLink>
          <FooterLink href="/resources">Ressources</FooterLink>
        </FooterColumn>
        <FooterColumn title="Entreprise">
          <FooterLink href="#apropos">À propos</FooterLink>
          <FooterLink href="/contact">Contact</FooterLink>
          <FooterLink href="/blog">Blog</FooterLink>
        </FooterColumn>
        <FooterColumn title="Légal">
          <FooterLink href="/privacy">Confidentialité</FooterLink>
          <FooterLink href="/terms">CGU</FooterLink>
          <FooterLink href="/cookies">Cookies</FooterLink>
        </FooterColumn>
      </Footer>
    </main>
  );
}
