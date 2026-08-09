// apps/web/src/types/conversion.ts
//
// Types pour le funnel de conversion
// MVP-009 — Conversion Funnel

/**
 * Avantage de la création de compte
 */
export interface Benefit {
  /** Titre de l'avantage */
  title: string
  /** Description détaillée */
  description: string
  /** Icône (lucide icon name) */
  icon: string
}

/**
 * Élément de confiance (témoignage, statistique, etc.)
 */
export interface TrustElement {
  /** Type d'élément */
  type: 'statistic' | 'testimonial' | 'logo' | 'badge'
  /** Contenu principal */
  content: string
  /** Sous-titre ou description */
  subtitle?: string
  /** Valeur numérique (pour les statistiques) */
  value?: number
}

/**
 * Élément de sécurité
 */
export interface SecurityElement {
  /** Titre de l'élément de sécurité */
  title: string
  /** Description */
  description: string
  /** Icône */
  icon: string
}

/**
 * Étape de progression
 */
export interface ProgressStep {
  /** Numéro de l'étape */
  step: number
  /** Titre de l'étape */
  title: string
  /** Description */
  description: string
  /** Statut (completed, current, pending) */
  status: 'completed' | 'current' | 'pending'
}

/**
 * Question FAQ
 */
export interface FAQItem {
  /** Question */
  question: string
  /** Réponse */
  answer: string
  /** Catégorie (account, features, pricing, security) */
  category: string
}

/**
 * Méthode d'authentification
 */
export type AuthMethod = 'google' | 'github' | 'email' | 'magic-link'

/**
 * Props pour ConversionPanel
 */
export interface ConversionPanelProps {
  /** Score ATS obtenu (pour personnalisation) */
  atsScore?: number
  /** Fonction de callback pour Google Sign In */
  onGoogleSignIn?: () => void
  /** Fonction de callback pour Github Sign In */
  onGithubSignIn?: () => void
  /** Fonction de callback pour Email Signup */
  onEmailSignup?: () => void
  /** Fonction de callback pour passer directement au dashboard (si déjà connecté) */
  onContinue?: () => void
  /** Mode (conversion, signup, login) */
  mode?: 'conversion' | 'signup' | 'login'
}
