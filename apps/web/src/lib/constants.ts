import type {
  TrustStat,
  ProblemCard,
  MethodStep,
  BenefitCard,
  Testimonial,
  PricingPlan,
  FAQItem,
  ResultStat,
  RadarDataPoint,
  ProgressionDataPoint,
  StressDataPoint,
} from "@/types/home";

export const SITE_NAME = "Trajectoire";
export const SITE_URL = "https://trajectoire.app";
export const SITE_TAGLINE = "Career Decision Intelligence Platform";

export const TRUST_STATS: TrustStat[] = [
  { value: "1 000+", label: "Évaluations réalisées", icon: "chart" },
  { value: "4.9/5", label: "Satisfaction utilisateur", icon: "star" },
  { value: "24h", label: "Feedback personnalisé", icon: "bolt" },
  { value: "8", label: "Dimensions analysées", icon: "brain" },
];

export const PROBLEM_CARDS: ProblemCard[] = [
  { icon: "💬", text: "Je doute de mes réponses en entretien." },
  { icon: "🧍", text: "Je me prépare seul, sans feedback." },
  { icon: "🔍", text: "Je manque de recul sur mes forces réelles." },
  { icon: "😰", text: "Je perds mes moyens sous pression." },
  { icon: "📊", text: "Je ne sais pas quoi améliorer concrètement." },
  { icon: "⏱", text: "Je veux progresser mais je manque de temps." },
];

export const METHOD_STEPS: MethodStep[] = [
  {
    number: "01",
    title: "Diagnostic",
    description:
      "Évaluation de vos compétences comportementales, de votre gestion du stress et de votre posture décisionnelle.",
    result: "Cartographie précise de vos forces et zones de progression.",
    duration: "15 min",
  },
  {
    number: "02",
    title: "Analyse",
    description:
      "Traitement de vos réponses par notre moteur d'intelligence comportementale. Comparaison avec les profils performants.",
    result: "Rapport détaillé avec scores personnalisés sur 8 dimensions.",
    duration: "Instantané",
  },
  {
    number: "03",
    title: "Simulation",
    description:
      "Mise en situation sur des scénarios adaptés à votre contexte : entretien, présentation, négociation, prise de poste.",
    result: "Feedback actionnable sur chaque compétence testée.",
    duration: "20 min",
  },
  {
    number: "04",
    title: "Plan d'action",
    description:
      "Recommandations personnalisées, axes de travail prioritaires et ressources ciblées selon votre profil.",
    result: "Feuille de route claire pour les 30 prochains jours.",
    duration: "5 min",
  },
];

export const BENEFIT_CARDS: BenefitCard[] = [
  {
    id: "perception",
    span: 6,
    colSpan: "md:col-span-6",
    title: "Comprenez comment vous êtes perçu.",
    description:
      "Analyse de vos réponses comportementales avec scoring détaillé sur 8 dimensions. Voyez ce que vos interlocuteurs voient.",
    visual: "radar",
  },
  {
    id: "progression",
    span: 3,
    colSpan: "md:col-span-3",
    title: "Identifiez vos zones de progression.",
    description:
      "Les 3 axes prioritaires pour maximiser votre impact lors des moments décisifs.",
    visual: "list",
  },
  {
    id: "confidence",
    span: 3,
    colSpan: "md:col-span-3",
    title: "Gagnez en assurance.",
    description:
      "Score de confiance basé sur votre préparation réelle, pas sur votre ressenti.",
    visual: "progress",
  },
  {
    id: "simulation",
    span: 4,
    colSpan: "md:col-span-4",
    title: "Simulez avant d'agir.",
    description:
      "Entraînez-vous sur des scénarios réalistes adaptés à votre contexte professionnel.",
    visual: "play",
  },
  {
    id: "feedback",
    span: 4,
    colSpan: "md:col-span-4",
    title: "Recevez un feedback objectif.",
    description:
      "Pas de jugement. Des données, des insights, des recommandations actionnables.",
    visual: "feedback",
  },
  {
    id: "plan",
    span: 4,
    colSpan: "md:col-span-4",
    title: "Progressez en 30 jours.",
    description:
      "Plan d'action personnalisé avec milestones mesurables et suivi de progression.",
    visual: "bar",
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "sophie",
    name: "Sophie M.",
    role: "Directrice Marketing",
    company: "Secteur technologique",
    quote:
      "J'ai passé mon entretien de direction avec une clarté que je n'avais jamais eue. Trajectoire m'a montré exactement ce que je devais travailler.",
    result: "Promue 3 semaines après",
    initials: "SM",
    color: "#1A3C34",
  },
  {
    id: "thomas",
    name: "Thomas R.",
    role: "Manager Senior",
    company: "Cabinet de conseil",
    quote:
      "Je me préparais seul depuis des années. En une session, j'ai compris ce qui me manquait. Le feedback comportemental est d'une précision rare.",
    result: "Score de confiance +35%",
    initials: "TR",
    color: "#E8501A",
  },
  {
    id: "marie",
    name: "Marie L.",
    role: "Cadre en transition",
    company: "Industrie",
    quote:
      "Trajectoire m'a donné le recul objectif dont j'avais besoin. J'ai arrêté de douter et j'ai agi. Le plan d'action est concret et réaliste.",
    result: "Nouvelle position en 6 semaines",
    initials: "ML",
    color: "#2D5F50",
  },
];

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "free",
    name: "Free",
    label: "Découvrir",
    price: "0€",
    features: [
      { text: "1 évaluation complète", included: true },
      { text: "Rapport de base", included: true },
      { text: "3 dimensions analysées", included: true },
      { text: "Recommandations générales", included: true },
      { text: "Simulations personnalisées", included: false },
      { text: "Plan d'action 30 jours", included: false },
      { text: "Suivi de progression", included: false },
      { text: "Feedback prioritaire", included: false },
    ],
    cta: "Commencer gratuitement",
    href: "/register",
    featured: false,
  },
  {
    id: "pro",
    name: "Pro",
    label: "Progresser",
    price: "19€",
    period: "/mois",
    badge: "Recommandé",
    features: [
      { text: "Évaluations illimitées", included: true },
      { text: "Rapport complet (8 dimensions)", included: true },
      { text: "3 dimensions analysées", included: true },
      { text: "Recommandations personnalisées", included: true },
      { text: "Simulations personnalisées", included: true },
      { text: "Plan d'action 30 jours", included: true },
      { text: "Suivi de progression", included: true },
      { text: "Feedback prioritaire", included: true },
    ],
    cta: "Démarrer l'essai Pro",
    href: "/register?plan=pro",
    featured: true,
  },
];

export const FAQ_ITEMS: FAQItem[] = [
  {
    id: "what",
    question: "Qu'est-ce que Trajectoire ?",
    answer:
      "Trajectoire est une plateforme d'intelligence décisionnelle pour la carrière. Elle évalue vos compétences comportementales, analyse votre profil sur 8 dimensions, et vous prépare aux moments professionnels à fort enjeu : entretiens, promotions, prises de poste, mobilités internes. Le résultat est un feedback objectif et un plan d'action personnalisé.",
  },
  {
    id: "who",
    question: "À qui s'adresse Trajectoire ?",
    answer:
      "Trajectoire est conçu pour les cadres supérieurs, managers et professionnels expérimentés (28–55 ans) qui préparent un moment décisif de leur carrière. Que vous anticipiez une promotion, un entretien interne, une prise de direction ou une transition professionnelle, Trajectoire vous offre le cadre structuré qui manque à la préparation solitaire.",
  },
  {
    id: "how",
    question: "Comment fonctionne l'évaluation comportementale ?",
    answer:
      "L'évaluation repose sur des scénarios de mise en situation et des questionnaires comportementaux calibrés. Vos réponses sont analysées sur 8 dimensions : clarté décisionnelle, gestion du stress, posture de leadership, communication, assertivité, adaptabilité, intelligence émotionnelle et vision stratégique. Le système compare votre profil aux patterns des professionnels performants dans des contextes similaires.",
  },
  {
    id: "time",
    question: "Combien de temps faut-il pour obtenir des résultats ?",
    answer:
      "Le diagnostic initial dure 15 minutes. L'analyse est instantanée. Vous recevez votre rapport complet avec scores, insights et recommandations immédiatement après. Une session de simulation dure 20 minutes supplémentaires. En moins d'une heure, vous disposez d'une vision claire de votre profil et d'un plan d'action concret.",
  },
  {
    id: "coach",
    question: "Trajectoire remplace-t-il un coach de carrière ?",
    answer:
      "Trajectoire ne remplace pas un coach, il le complète et le précède. La plateforme vous fournit une base objective, des données et un diagnostic structuré avant toute démarche de coaching. Nombreux sont nos utilisateurs qui utilisent leur rapport Trajectoire comme point de départ d'un accompagnement avec un coach. D'autres n'en ont simplement plus besoin.",
  },
  {
    id: "data",
    question: "Mes données sont-elles confidentielles ?",
    answer:
      "Vos données sont strictement confidentielles. Elles ne sont jamais partagées avec des tiers, des employeurs ou des recruteurs. Trajectoire est conforme au RGPD. Vos évaluations et rapports sont uniquement accessibles depuis votre compte personnel. Vous pouvez demander la suppression complète de vos données à tout moment depuis vos paramètres.",
  },
  {
    id: "diff",
    question: "Quelle est la différence entre l'offre gratuite et l'offre Pro ?",
    answer:
      "L'offre gratuite vous donne accès à une évaluation complète avec analyse sur 3 dimensions et recommandations générales — suffisant pour découvrir votre profil. L'offre Pro (19€/mois) débloque les évaluations illimitées, l'analyse complète sur 8 dimensions, les simulations personnalisées, le plan d'action 30 jours et le suivi de progression dans le temps.",
  },
  {
    id: "specific",
    question: "Puis-je utiliser Trajectoire pour préparer un entretien spécifique ?",
    answer:
      "Oui, c'est l'un des cas d'usage les plus fréquents. Lors de votre diagnostic, vous renseignez le contexte de votre entretien (poste visé, secteur, niveau de responsabilité). Le moteur adapte les scénarios de simulation à ce contexte précis. Vous obtenez un feedback ciblé sur les compétences que votre interlocuteur évaluera.",
  },
];

export const RESULT_STATS: ResultStat[] = [
  {
    value: "+42%",
    label: "Confiance en entretien",
    detail: "Mesuré après 2 sessions de simulation",
  },
  {
    value: "89%",
    label: "Taux de satisfaction",
    detail: "Sur les 6 derniers mois",
  },
  {
    value: "3x",
    label: "Plus de chances de réussir",
    detail: "Comparé à une préparation non structurée",
  },
];

export const RADAR_DATA: RadarDataPoint[] = [
  { subject: "Leadership", value: 82, fullMark: 100 },
  { subject: "Communication", value: 75, fullMark: 100 },
  { subject: "Décision", value: 88, fullMark: 100 },
  { subject: "Stress", value: 68, fullMark: 100 },
  { subject: "Assertivité", value: 79, fullMark: 100 },
  { subject: "Adaptabilité", value: 91, fullMark: 100 },
  { subject: "Émotion", value: 73, fullMark: 100 },
  { subject: "Vision", value: 85, fullMark: 100 },
];

export const PROGRESSION_DATA: ProgressionDataPoint[] = [
  { week: "S1", confidence: 52, preparedness: 48 },
  { week: "S2", confidence: 58, preparedness: 55 },
  { week: "S3", confidence: 61, preparedness: 62 },
  { week: "S4", confidence: 67, preparedness: 68 },
  { week: "S5", confidence: 70, preparedness: 72 },
  { week: "S6", confidence: 74, preparedness: 77 },
  { week: "S7", confidence: 76, preparedness: 81 },
  { week: "S8", confidence: 78, preparedness: 85 },
];

export const STRESS_DATA: StressDataPoint[] = [
  { category: "Prise de parole", value: 72 },
  { category: "Négociation", value: 58 },
  { category: "Décision rapide", value: 81 },
  { category: "Feedback difficile", value: 65 },
];

// ─────────────────────────────────────────────────────────
// Dashboard — Notifications
// ─────────────────────────────────────────────────────────
export const DASHBOARD_NOTIFICATIONS = [
  {
    id: "1",
    type: "success" as const,
    title: "Simulation complétée",
    body: "Votre score de confiance a progressé de +8 pts.",
    time: "Il y a 2h",
    read: false,
  },
  {
    id: "2",
    type: "info" as const,
    title: "Nouveau module disponible",
    body: "Prise de parole en public — 12 exercices ciblés.",
    time: "Il y a 5h",
    read: false,
  },
  {
    id: "3",
    type: "warning" as const,
    title: "Action recommandée",
    body: "Complétez votre profil pour débloquer le plan d'action.",
    time: "Hier",
    read: true,
  },
] satisfies {
  id: string;
  type: "success" | "info" | "warning";
  title: string;
  body: string;
  time: string;
  read: boolean;
}[];

// ─────────────────────────────────────────────────────────
// Dashboard — Action items
// ─────────────────────────────────────────────────────────
export const DASHBOARD_ACTIONS = [
  {
    id: "a1",
    label: "Compléter le module Assertivité",
    done: true,
    priority: "high" as const,
  },
  {
    id: "a2",
    label: "Simuler un entretien de promotion",
    done: false,
    priority: "high" as const,
  },
  {
    id: "a3",
    label: "Lire le feedback sur votre communication",
    done: false,
    priority: "medium" as const,
  },
  {
    id: "a4",
    label: "Valider les axes de progression S3",
    done: false,
    priority: "low" as const,
  },
] satisfies {
  id: string;
  label: string;
  done: boolean;
  priority: "high" | "medium" | "low";
}[];

// ─────────────────────────────────────────────────────────
// Dashboard — Competency scores
// ─────────────────────────────────────────────────────────
export const COMPETENCY_SCORES = [
  { name: "Leadership",   score: 82, prev: 76, color: "#1A3C34" },
  { name: "Communication",score: 75, prev: 68, color: "#E8501A"  },
  { name: "Décision",     score: 91, prev: 88, color: "#1A7F4B" },
  { name: "Stress",       score: 68, prev: 60, color: "#D97706" },
  { name: "Assertivité",  score: 79, prev: 74, color: "#1A3C34" },
  { name: "Adaptabilité", score: 91, prev: 85, color: "#1A7F4B" },
  { name: "Émotion",      score: 73, prev: 70, color: "#E8501A"  },
  { name: "Vision",       score: 85, prev: 80, color: "#1A3C34" },
] satisfies {
  name: string;
  score: number;
  prev: number;
  color: string;
}[];

// ─────────────────────────────────────────────────────────
// Dashboard — Plan milestones
// ─────────────────────────────────────────────────────────
export const PLAN_MILESTONES = [
  { week: "S1–S2",  title: "Diagnostic comportemental",    done: true,  current: false },
  { week: "S3–S4",  title: "Simulation entretien initial",  done: true,  current: false },
  { week: "S5–S6",  title: "Module Communication avancée", done: false, current: true  },
  { week: "S7–S8",  title: "Simulation de promotion",      done: false, current: false },
  { week: "S9–S10", title: "Révision du plan d'action",    done: false, current: false },
] satisfies {
  week: string;
  title: string;
  done: boolean;
  current: boolean;
}[];

// ─────────────────────────────────────────────────────────
// Dashboard — Navigation tabs
// ─────────────────────────────────────────────────────────
export const DASHBOARD_TABS = [
  { id: "overview",    label: "Vue d'ensemble" },
  { id: "competences", label: "Compétences"    },
  { id: "progression", label: "Progression"    },
  { id: "plan",        label: "Plan d'action"  },
] as const;

export type DashboardTab = typeof DASHBOARD_TABS[number]["id"];

// ─────────────────────────────────────────────────────────
// Dashboard — Sidebar nav
// ─────────────────────────────────────────────────────────
export const SIDEBAR_NAV = [
  { label: "Tableau de bord", href: "/dashboard"            },
  { label: "Évaluation",      href: "/dashboard/evaluation" },
  { label: "Simulations",     href: "/dashboard/simulation" },
  { label: "Mon rapport",     href: "/dashboard/rapport"    },
  { label: "Plan d'action",   href: "/dashboard/plan"       },
] satisfies { label: string; href: string }[];

// ─────────────────────────────────────────────────────────
// Dashboard — KPI cards
// ─────────────────────────────────────────────────────────
export const DASHBOARD_KPIS = [
  { label: "Confiance",   value: 78, unit: "/100", delta: "↑ +12 ce mois", color: "#1A3C34" },
  { label: "Préparation", value: 85, unit: "/100", delta: "↑ +8 ce mois",  color: "#1A7F4B" },
  { label: "Décision",    value: 91, unit: "/100", delta: "↑ +3 ce mois",  color: "#D97706" },
  { label: "Stress",      value: 32, unit: "%",    delta: "↓ Maîtrisé",    color: "#E8501A"  },
] satisfies {
  label: string;
  value: number;
  unit: string;
  delta: string;
  color: string;
}[];

// ─────────────────────────────────────────────────────────
// Dashboard — Progression delta cards
// ─────────────────────────────────────────────────────────
export const PROGRESSION_DELTAS = [
  { label: "Gain de confiance",   value: "+26 pts", detail: "Sur 8 semaines",          color: "#1A3C34" },
  { label: "Gain de préparation", value: "+37 pts", detail: "Sur 8 semaines",          color: "#1A7F4B" },
  { label: "Sessions complétées", value: "6 / 8",   detail: "2 restantes ce mois",     color: "#D97706" },
  { label: "Temps investi",       value: "4h 20",   detail: "Ce mois",                 color: "#1A3C34" },
  { label: "Simulations",         value: "3",       detail: "Entretiens simulés",       color: "#E8501A"  },
  { label: "Objectif 30 jours",   value: "74%",     detail: "De progression atteinte", color: "#1A7F4B" },
] satisfies {
  label: string;
  value: string;
  detail: string;
  color: string;
}[];

// ─────────────────────────────────────────────────────────
// Dashboard — Recommendations
// ─────────────────────────────────────────────────────────
export const DASHBOARD_RECOMMENDATIONS = [
  {
    title: "Travaillez le silence en négociation",
    body:  "Votre score d'assertivité montre une tendance à combler les silences. 3 exercices ciblés sont disponibles.",
    tag:   "Assertivité",
    color: "#1A3C34",
  },
  {
    title: "Simulez un entretien de promotion",
    body:  "Vous êtes prêt à passer à la simulation avancée. Votre confiance et votre préparation sont au niveau requis.",
    tag:   "Simulation",
    color: "#1A7F4B",
  },
  {
    title: "Renforcez votre gestion du stress",
    body:  "Votre score stress sous pression (feedback difficile) est votre point de progression prioritaire ce mois.",
    tag:   "Stress",
    color: "#D97706",
  },
] satisfies {
  title: string;
  body: string;
  tag: string;
  color: string;
}[];

// ─────────────────────────────────────────────────────────
// Dashboard — User mock
// ─────────────────────────────────────────────────────────
export const DASHBOARD_USER = {
  firstName: "Sophie",
  lastName:  "M.",
  initials:  "SM",
  role:      "Directrice Marketing",
  plan:      "free" as "free" | "pro",
} as const;

