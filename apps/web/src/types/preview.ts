// apps/web/src/types/preview.ts
//
// Types pour le système de persistance temporaire des analyses ATS preview
// MVP-007 — ATS Preview Persistence

/**
 * Données du candidat extraites du CV
 */
export interface CandidateData {
  /** Nom complet du candidat */
  fullName?: string
  /** Email du candidat */
  email?: string
  /** Téléphone du candidat */
  phone?: string
  /** Adresse du candidat */
  address?: string
  /** Expériences professionnelles */
  experiences?: Array<{
    company: string
    position: string
    startDate: string
    endDate?: string
    description?: string
  }>
  /** Formation */
  education?: Array<{
    institution: string
    degree: string
    field: string
    startDate: string
    endDate?: string
  }>
  /** Compétences */
  skills?: string[]
  /** Langues */
  languages?: Array<{
    language: string
    level: string
  }>
}

/**
 * Données de l'annonce de poste
 */
export interface JobData {
  /** Titre du poste */
  title?: string
  /** Nom de l'entreprise */
  company?: string
  /** Description du poste */
  description?: string
  /** Lieu */
  location?: string
  /** Type de contrat */
  contractType?: string
  /** Salaire */
  salary?: string
  /** Compétences requises */
  requiredSkills?: string[]
}

/**
 * Résultat de l'analyse ATS
 */
export interface ATSResult {
  /** Score global (0-100) */
  score: number
  /** Écart vers le score optimal */
  gapToOptimal: number
  /** Percentile (0-100) */
  percentile: number
  /** Forces du CV */
  strengths: string[]
  /** Faiblesses du CV */
  weakness: string[]
  /** Dimensions pour le graphique radar */
  radarDimensions: {
    structure: number
    keywords: number
    impact: number
    clarity: number
    relevance: number
  }
  /** Message personnalisé */
  message: string
}

/**
 * Analyse preview complète
 */
export interface PreviewAnalysis {
  /** ID unique */
  id: string
  /** Token UUID pour accéder à l'analyse */
  token: string
  /** Date de création */
  createdAt: Date
  /** Date d'expiration */
  expiresAt: Date
  /** Hash de l'IP pour rate limiting */
  ipHash: string
  /** Fingerprint du navigateur pour sécurité */
  fingerprint: string
  /** Résultat de l'analyse ATS */
  atsResult: ATSResult
  /** Données du candidat */
  candidateData: CandidateData
  /** Données de l'annonce */
  jobData: JobData
  /** Si l'analyse a été consommée (claimée) */
  consumed: boolean
  /** Date de consommation */
  consumedAt?: Date
  /** ID de l'utilisateur qui a claimé l'analyse */
  claimedBy?: string
}

/**
 * Payload pour sauvegarder une analyse preview
 */
export interface SavePreviewPayload {
  /** Résultat de l'analyse ATS */
  atsResult: ATSResult
  /** Données du candidat */
  candidateData: CandidateData
  /** Données de l'annonce */
  jobData: JobData
}

/**
 * Réponse après sauvegarde d'une preview
 */
export interface SavePreviewResponse {
  /** Token pour accéder à l'analyse */
  token: string
  /** Date d'expiration */
  expiresAt: Date
}

/**
 * Payload pour claimer une analyse preview
 */
export interface ClaimPreviewPayload {
  /** Token de l'analyse */
  token: string
  /** ID de l'utilisateur qui claim */
  userId: string
}

/**
 * Réponse après claim d'une preview
 */
export interface ClaimPreviewResponse {
  /** Si le claim a réussi */
  success: boolean
  /** ID de l'analyse créée dans le compte utilisateur */
  analysisId?: string
  /** Message d'erreur si échec */
  error?: string
}
