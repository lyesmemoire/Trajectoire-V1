// apps/web/src/types/onboarding.ts
//
// Types pour l'onboarding adaptatif
// MVP-010 — Adaptive Onboarding

/**
 * Étape d'onboarding
 */
export interface OnboardingStep {
  /** Identifiant unique de l'étape */
  id: string
  /** Titre de l'étape */
  title: string
  /** Description de l'étape */
  description: string
  /** Ordre de l'étape */
  order: number
  /** Étape requise avant celle-ci */
  requiredSteps?: string[]
  /** Étape optionnelle */
  optional?: boolean
  /** Étape skippable */
  skippable?: boolean
}

/**
 * Type de parcours utilisateur
 */
export type JourneyType = 'full' | 'ats-first' | 'minimal'

/**
 * État utilisateur pour l'onboarding
 */
export interface UserOnboardingState {
  /** ID de l'utilisateur */
  userId: string
  /** L'utilisateur a complété l'onboarding */
  onboardingCompleted: boolean
  /** L'utilisateur a un CV uploadé */
  hasCV: boolean
  /** L'utilisateur a une analyse ATS */
  hasATSAnalysis: boolean
  /** L'utilisateur a uploadé un job */
  hasJob: boolean
  /** L'utilisateur a fait un matching initial */
  hasInitialMatching: boolean
  /** L'utilisateur a découvert le Copilot */
  hasDiscoveredCopilot: boolean
  /** L'utilisateur a fait un entretien IA */
  hasDoneInterview: boolean
  /** Étapes complétées */
  completedSteps: string[]
  /** Étape courante */
  currentStep: string | null
  /** Type de parcours */
  journeyType: JourneyType
  /** Date de début d'onboarding */
  startedAt?: Date
  /** Date de fin d'onboarding */
  completedAt?: Date
}

/**
 * Résolution de parcours
 */
export interface JourneyResolution {
  /** Type de parcours déterminé */
  journeyType: JourneyType
  /** Étapes à suivre */
  steps: OnboardingStep[]
  /** Étape de départ */
  startingStep: string
  /** Raison de la résolution */
  reason: string
}

/**
 * Configuration d'onboarding
 */
export interface OnboardingConfig {
  /** Étapes pour le parcours complet */
  fullJourney: OnboardingStep[]
  /** Étapes pour le parcours ATS-first */
  atsFirstJourney: OnboardingStep[]
  /** Étapes pour le parcours minimal */
  minimalJourney: OnboardingStep[]
}

/**
 * État de progression
 */
export interface ProgressState {
  /** Étape courante */
  currentStep: string
  /** Étapes complétées */
  completedSteps: string[]
  /** Étapes restantes */
  remainingSteps: string[]
  /** Pourcentage de progression */
  progressPercentage: number
  /** Estimation du temps restant (en minutes) */
  estimatedTimeRemaining?: number
}

/**
 * Configuration de flow
 */
export interface FlowConfig {
  /** Activer l'onboarding adaptatif */
  adaptiveEnabled: boolean
  /** Permettre de sauter des étapes */
  allowSkip: boolean
  /** Permettre de revenir en arrière */
  allowBack: boolean
  /** Afficher la progression */
  showProgress: boolean
  /** Temps estimé par étape (en minutes) */
  estimatedTimePerStep: Record<string, number>
}
