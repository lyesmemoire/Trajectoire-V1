// apps/web/src/types/events.ts
//
// Types pour le système de tracking d'événements
// Définit les événements à tracer et leurs payloads

/**
 * Types d'événements à tracer dans l'application
 */
export enum EventType {
  /** Inscription d'un nouvel utilisateur */
  SIGNUP = 'signup',
  /** Connexion d'un utilisateur */
  LOGIN = 'login',
  /** Confirmation de l'email */
  EMAIL_CONFIRMED = 'email_confirmed',
  /** Premier upload de CV */
  FIRST_CV_UPLOAD = 'first_cv_upload',
  /** Premier upload de fiche de poste */
  FIRST_JOB_UPLOAD = 'first_job_upload',
  /** Premier matching effectué */
  FIRST_MATCHING = 'first_matching',
  /** Première utilisation du Copilot */
  FIRST_COPILOT = 'first_copilot',
  /** Première recherche effectuée */
  FIRST_SEARCH = 'first_search',
  /** Clic sur Premium */
  PREMIUM_CLICKED = 'premium_clicked',
  /** Début du processus d'upgrade */
  UPGRADE_STARTED = 'upgrade_started',
  /** Upgrade complété avec succès */
  UPGRADE_COMPLETED = 'upgrade_completed',
}

/**
 * Payload de base pour tous les événements
 */
export interface BaseEventPayload {
  /** ID de l'utilisateur */
  userId: string
  /** Timestamp de l'événement */
  timestamp: Date
  /** Métadonnées additionnelles */
  metadata?: Record<string, unknown>
}

/**
 * Payload pour l'événement SIGNUP
 */
export interface SignupPayload extends BaseEventPayload {
  type: EventType.SIGNUP
  email: string
  referralCode?: string
}

/**
 * Payload pour l'événement LOGIN
 */
export interface LoginPayload extends BaseEventPayload {
  type: EventType.LOGIN
  method?: 'email' | 'google' | 'github'
}

/**
 * Payload pour l'événement EMAIL_CONFIRMED
 */
export interface EmailConfirmedPayload extends BaseEventPayload {
  type: EventType.EMAIL_CONFIRMED
}

/**
 * Payload pour l'événement FIRST_CV_UPLOAD
 */
export interface FirstCVUploadPayload extends BaseEventPayload {
  type: EventType.FIRST_CV_UPLOAD
  fileName: string
  fileSize: number
  fileType: string
}

/**
 * Payload pour l'événement FIRST_JOB_UPLOAD
 */
export interface FirstJobUploadPayload extends BaseEventPayload {
  type: EventType.FIRST_JOB_UPLOAD
  fileName: string
  fileSize: number
  fileType: string
}

/**
 * Payload pour l'événement FIRST_MATCHING
 */
export interface FirstMatchingPayload extends BaseEventPayload {
  type: EventType.FIRST_MATCHING
  score: number
  jobTitle?: string
}

/**
 * Payload pour l'événement FIRST_COPILOT
 */
export interface FirstCopilotPayload extends BaseEventPayload {
  type: EventType.FIRST_COPILOT
  query: string
  persona?: string
}

/**
 * Payload pour l'événement FIRST_SEARCH
 */
export interface FirstSearchPayload extends BaseEventPayload {
  type: EventType.FIRST_SEARCH
  query: string
  resultsCount: number
}

/**
 * Payload pour l'événement PREMIUM_CLICKED
 */
export interface PremiumClickedPayload extends BaseEventPayload {
  type: EventType.PREMIUM_CLICKED
  source: 'modal' | 'dashboard' | 'pricing_page' | 'cta'
  feature?: string
}

/**
 * Payload pour l'événement UPGRADE_STARTED
 */
export interface UpgradeStartedPayload extends BaseEventPayload {
  type: EventType.UPGRADE_STARTED
  plan: string
  source: string
}

/**
 * Payload pour l'événement UPGRADE_COMPLETED
 */
export interface UpgradeCompletedPayload extends BaseEventPayload {
  type: EventType.UPGRADE_COMPLETED
  plan: string
  amount: number
  currency: string
}

/**
 * Union de tous les payloads d'événements
 */
export type EventPayload =
  | SignupPayload
  | LoginPayload
  | EmailConfirmedPayload
  | FirstCVUploadPayload
  | FirstJobUploadPayload
  | FirstMatchingPayload
  | FirstCopilotPayload
  | FirstSearchPayload
  | PremiumClickedPayload
  | UpgradeStartedPayload
  | UpgradeCompletedPayload

/**
 * Événement complet avec payload
 */
export interface TrackedEvent {
  id: string
  type: EventType
  payload: EventPayload
  createdAt: Date
}

/**
 * Statistiques de conversion
 */
export interface ConversionStats {
  /** Nombre total d'inscriptions */
  totalSignups: number
  /** Nombre d'emails confirmés */
  emailConfirmed: number
  /** Nombre d'utilisateurs ayant uploadé un CV */
  cvUploaded: number
  /** Nombre d'utilisateurs ayant uploadé une fiche de poste */
  jobUploaded: number
  /** Nombre d'utilisateurs ayant effectué un matching */
  matchingDone: number
  /** Nombre d'utilisateurs ayant utilisé le Copilot */
  copilotUsed: number
  /** Nombre d'utilisateurs ayant effectué une recherche */
  searchDone: number
  /** Nombre de clics sur Premium */
  premiumClicked: number
  /** Nombre d'upgrades commencés */
  upgradeStarted: number
  /** Nombre d'upgrades complétés */
  upgradeCompleted: number
  /** Taux de conversion signup → email confirmed */
  signupToEmailConfirmed: number
  /** Taux de conversion email confirmed → CV upload */
  emailConfirmedToCVUpload: number
  /** Taux de conversion CV upload → Premium clicked */
  cvUploadToPremiumClicked: number
  /** Taux de conversion Premium clicked → Upgrade completed */
  premiumClickedToUpgradeCompleted: number
}

/**
 * Données de funnel
 */
export interface FunnelData {
  /** Nom de l'étape */
  step: string
  /** Nombre d'utilisateurs à cette étape */
  count: number
  /** Pourcentage par rapport à l'étape précédente */
  percentage: number
  /** Pourcentage cumulé par rapport au début du funnel */
  cumulativePercentage: number
}
