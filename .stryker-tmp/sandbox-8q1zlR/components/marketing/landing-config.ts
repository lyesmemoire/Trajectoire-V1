// @ts-nocheck
export const signupHref = "/auth/signup";
export const loginHref = "/auth/login";

export interface StatItem {
  value: string;
  label: string;
}

export interface FeatureItem {
  id: string;
  title: string;
  description: string;
  bullets: string[];
}

export interface StepItem {
  number: string;
  title: string;
  description: string;
}

export interface TestimonialItem {
  stars: number;
  quote: string;
  author: string;
  role: string;
  initials: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export const stats: StatItem[] = [
  { value: "94%", label: "Passage des filtres ATS" },
  { value: "3x", label: "Plus d'entretiens" },
  { value: "<30s", label: "Analyse complète" },
  { value: "1 200+", label: "Candidats accompagnés" },
];

export const features: FeatureItem[] = [
  {
    id: "01",
    title: "Diagnostic ATS instantané",
    description:
      "Importe ton CV et compare-le à une offre cible. L'IA identifie les mots-clés manquants, les faiblesses de structure et les signaux qui bloquent les ATS.",
    bullets: [
      "Score de compatibilité en temps réel",
      "Audit mots-clés et lisibilité machine",
      "Alertes sur les erreurs de format",
    ],
  },
  {
    id: "02",
    title: "Optimisation par IA",
    description:
      "Transforme tes expériences en preuves d'impact avec des formulations inspirées de la méthode Google XYZ, adaptées au poste que tu vises.",
    bullets: [
      "Reformulations orientées résultats",
      "Alignement sémantique avec l'offre",
      "Templates CV ATS-friendly premium",
    ],
  },
  {
    id: "03",
    title: "Simulation d'Entretien IA",
    description:
      "Entraîne-toi face à des recruteurs virtuels exigeants : RH corporatif, fondateur stressant, lead technique direct ou senior tech Big Tech.",
    bullets: [
      "Niveaux Normal, Difficile et Élite",
      "Questions techniques & comportementales",
      "Débriefing sur 5 axes de performance",
    ],
  },
];

export const steps: StepItem[] = [
  {
    number: "1",
    title: "Importe ton CV",
    description:
      "Ajoute ton CV en PDF ou colle ton texte brut. La plateforme détecte automatiquement les sections, compétences et expériences.",
  },
  {
    number: "2",
    title: "Colle l'offre cible",
    description:
      "Copie l'annonce du poste visé. L'IA compare ton profil avec les attentes réelles du recruteur et de l'ATS.",
  },
  {
    number: "3",
    title: "Applique le plan",
    description:
      "Reçois les corrections prioritaires, choisis un template propre et lance une simulation d'entretien adaptée au poste.",
  },
];

export const testimonials: TestimonialItem[] = [
  {
    stars: 5,
    quote:
      "“Je pensais que mon CV était solide. L'analyse ATS m'a montré que je passais à côté de mots-clés essentiels. Deux semaines après optimisation, j'ai obtenu 4 entretiens.”",
    author: "Marion L.",
    role: "Product Manager · Scale-up SaaS",
    initials: "ML",
  },
  {
    stars: 5,
    quote:
      "“Le recruteur IA niveau Élite m'a mis en difficulté exactement comme en entretien final. Le débrief sur la structure de mes réponses a été décisif.”",
    author: "Adam K.",
    role: "Software Engineer · Big Tech",
    initials: "AK",
  },
  {
    stars: 5,
    quote:
      "“J'ai utilisé le template Executive Navy et les reformulations XYZ. Mon CV est devenu plus clair, plus mesurable et beaucoup plus convaincant.”",
    author: "Sofia D.",
    role: "Marketing Lead · FinTech",
    initials: "SD",
  },
];

export const faqs: FAQItem[] = [
  {
    question: "Ai-je besoin d'une carte bancaire pour tester ?",
    answer:
      "Non. L'inscription inclut 1 crédit gratuit sans carte bancaire. Tu peux analyser ton CV et découvrir la valeur de la plateforme avant d'acheter un pack.",
  },
  {
    question: "Le score ATS garantit-il un entretien ?",
    answer:
      "Aucun outil ne peut garantir une réponse recruteur. En revanche, un CV mieux structuré, plus aligné avec l'offre et plus lisible par les ATS augmente fortement tes chances de passer la première sélection.",
  },
  {
    question: "Quels formats de CV sont acceptés ?",
    answer:
      "Tu peux importer un CV en PDF ou coller ton contenu en texte brut. Les modèles proposés sont conçus pour rester propres, lisibles et compatibles avec les systèmes ATS.",
  },
  {
    question: "Les simulations d'entretien sont-elles personnalisées ?",
    answer:
      "Oui. Les questions peuvent être adaptées à ton CV, à l'offre cible, au type de recruteur et au niveau de difficulté choisi : Normal, Difficile ou Élite.",
  },
  {
    question: "Mes données sont-elles protégées ?",
    answer:
      "Tes données sont cryptées et utilisées uniquement pour générer tes analyses. Nous ne revendons jamais tes informations à des tiers.",
  },
];

export interface AboutBulletItem {
  text: string;
}

export interface PerformanceMetricItem {
  label: string;
  score: string;
}

export interface PricingPlanItem {
  name: string;
  description: string;
  price: string;
  priceSuffix: string;
  bullets: string[];
  ctaText: string;
  popular?: boolean;
}

export interface FooterLinkItem {
  label: string;
  href: string;
}

export interface FooterGroup {
  title: string;
  links: FooterLinkItem[];
}

export const aboutBullets: AboutBulletItem[] = [
  { text: "Conçu pour les candidats en recherche active" },
  { text: "Accès gratuit pour tester les fonctionnalités" },
  { text: "Recommandations concrètes, pas des conseils génériques" },
];

export const performanceMetrics: PerformanceMetricItem[] = [
  { label: "Technique", score: "4.3/5" },
  { label: "Cohérence du parcours", score: "4.6/5" },
  { label: "Communication", score: "4.1/5" },
  { label: "Confiance & gestion du stress", score: "3.8/5" },
];

export const pricingPlans: PricingPlanItem[] = [
  {
    name: "Starter",
    description:
      "Idéal pour optimiser une candidature importante et préparer les premières questions d'entretien.",
    price: "7€",
    priceSuffix: "/ pack unique",
    bullets: [
      "5 crédits inclus",
      "Score ATS détaillé",
      "Simulation d'entretien",
      "Templates CV ATS-friendly",
    ],
    ctaText: "Choisir Starter",
    popular: false,
  },
  {
    name: "Pro",
    description:
      "Pour les candidats en recherche active qui veulent adapter leur CV à plusieurs postes et s'entraîner sérieusement.",
    price: "15€",
    priceSuffix: "/ pack unique",
    bullets: [
      "15 crédits inclus",
      "Tout le plan Starter",
      "Simulations d'entretiens illimitées (durant le pack)",
      "Analyse multi-postes",
      "Support prioritaire",
    ],
    ctaText: "Passer en Pro",
    popular: true,
  },
];

export const footerLinks: FooterGroup[] = [
  {
    title: "Produit",
    links: [
      { label: "Fonctionnalités", href: "#features" },
      { label: "Tarifs", href: "#pricing" },
      { label: "Témoignages", href: "#testimonials" },
    ],
  },
  {
    title: "Ressources",
    links: [
      { label: "FAQ", href: "#faq" },
      { label: "Confidentialité", href: "/privacy" },
      { label: "Conditions", href: "/terms" },
    ],
  },
];
