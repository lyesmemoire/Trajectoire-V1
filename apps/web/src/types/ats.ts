// apps/web/src/types/ats.ts
//
// Types pour le rapport ATS complet
// MVP-008 — ATS Experience

/**
 * Dimensions pour le graphique radar
 */
export interface RadarDimensions {
  /** Structure du CV */
  structure: number
  /** Mots-clés */
  keywords: number
  /** Impact */
  impact: number
  /** Clarté */
  clarity: number
  /** Pertinence */
  relevance: number
}

/**
 * Compétence détectée
 */
export interface DetectedSkill {
  /** Nom de la compétence */
  name: string
  /** Niveau de maîtrise (0-100) */
  level: number
  /** Catégorie (technique, soft skill, etc.) */
  category: string
}

/**
 * Expérience détectée
 */
export interface DetectedExperience {
  /** Entreprise */
  company: string
  /** Poste */
  position: string
  /** Durée (en mois) */
  duration: number
  /** Pertinence pour le poste (0-100) */
  relevance: number
}

/**
 * Formation détectée
 */
export interface DetectedEducation {
  /** Institution */
  institution: string
  /** Diplôme */
  degree: string
  /** Domaine */
  field: string
  /** Année d'obtention */
  year: number
}

/**
 * Langue détectée
 */
export interface DetectedLanguage {
  /** Langue */
  language: string
  /** Niveau (A1-C2) */
  level: string
}

/**
 * Force du CV
 */
export interface Strength {
  /** Description de la force */
  description: string
  /** Impact sur le score (0-100) */
  impact: number
  /** Catégorie */
  category: string
}

/**
  * Faiblesse du CV
 */
export interface Weakness {
  /** Description de la faiblesse */
  description: string
  /** Impact sur le score (0-100) */
  impact: number
  /** Priorité (low, medium, high) */
  priority: 'low' | 'medium' | 'high'
}

/**
 * Recommandation IA
 */
export interface Recommendation {
  /** Titre de la recommandation */
  title: string
  /** Description détaillée */
  description: string
  /** Type d'action (add, improve, remove) */
  actionType: 'add' | 'improve' | 'remove'
  /** Priorité (low, medium, high) */
  priority: 'low' | 'medium' | 'high'
  /** Impact estimé sur ATS (0-100) */
  estimatedImpact: number
}

/**
 * Quick Win (action rapide)
 */
export interface QuickWin {
  /** Titre de l'action */
  title: string
  /** Description */
  description: string
  /** Temps estimé (en minutes) */
  estimatedTime: number
  /** Impact sur le score (0-100) */
  impact: number
}

/**
 * Résumé pour recruteur
 */
export interface RecruiterSummary {
  /** Score global */
  score: number
  /** Percentile */
  percentile: number
  /** Points forts principaux */
  keyStrengths: string[]
  /** Points d'attention */
  attentionPoints: string[]
  /** Recommandation finale (hire, consider, reject) */
  recommendation: 'hire' | 'consider' | 'reject'
}

/**
 * Données complètes du rapport ATS
 */
export interface ATSReportData {
  /** Score global (0-100) */
  score: number
  /** Écart vers le score optimal */
  gapToOptimal: number
  /** Percentile (0-100) */
  percentile: number
  /** Dimensions radar */
  radarDimensions: RadarDimensions
  /** Forces */
  strengths: Strength[]
  /** Faiblesses */
  weaknesses: Weakness[]
  /** Compétences détectées */
  detectedSkills: DetectedSkill[]
  /** Compétences manquantes */
  missingSkills: string[]
  /** Expériences détectées */
  experiences: DetectedExperience[]
  /** Formations */
  education: DetectedEducation[]
  /** Langues */
  languages: DetectedLanguage[]
  /** Recommandations IA */
  recommendations: Recommendation[]
  /** Quick wins */
  quickWins: QuickWin[]
  /** Résumé recruteur */
  recruiterSummary: RecruiterSummary
  /** Message personnalisé */
  message: string
  /** Nom du fichier CV */
  fileName?: string
  /** Date de l'analyse */
  analyzedAt?: Date
}

/**
 * Props pour le composant ATSReport
 */
export interface ATSReportProps {
  /** Données du rapport ATS */
  data: ATSReportData
  /** Mode (preview pour visiteur, full pour utilisateur connecté) */
  mode?: 'preview' | 'full'
  /** Fonction de callback pour télécharger PDF (optionnel) */
  onDownloadPDF?: () => void
  /** Fonction de callback pour sauvegarder (optionnel) */
  onSave?: () => void
  /** Fonction de callback pour nouvelle analyse (optionnel) */
  onNewAnalysis?: () => void
}
