/**
 * Analyse ATS d'un CV — types publics.
 *
 * Principe : chaque valeur renvoyée est CALCULÉE à partir du texte du CV et de
 * l'offre. Quand une dimension ne peut pas être évaluée (offre sans durée
 * d'expérience, pas d'offre du tout), elle vaut `null` et n'entre pas dans le
 * score : jamais de valeur par défaut affichée comme un résultat.
 */

export type AnalysisMode = "job_match" | "cv_only"

export type IssueSeverity = "high" | "medium" | "low"

export interface AnalysisIssue {
  code: string
  message: string
  severity: IssueSeverity
}

export interface CvAnalysisDimensions {
  /** Couverture pondérée des exigences de l'offre par le CV (0-100), `null` sans offre exploitable. */
  keywordCoverage: number | null
  /** Expérience du CV comparée à celle demandée (0-100), `null` si l'offre n'en fixe pas. */
  experienceFit: number | null
  /** Réalisations chiffrées et verbes d'action (0-100). */
  impact: number
  /** Lisibilité / complétude pour un ATS : coordonnées, sections, dates, longueur (0-100). */
  format: number
}

export interface CvAnalysisResult {
  mode: AnalysisMode
  /** Score global 0-100, moyenne pondérée des dimensions évaluées. */
  overall: number
  dimensions: CvAnalysisDimensions
  /** Poids réellement appliqués (somme = 1), pour l'explicabilité. */
  weights: Record<string, number>
  /**
   * Plafond d'adéquation appliqué au score (0-1) : un CV sans rapport avec l'offre
   * ne peut pas être « sauvé » par sa seule qualité de rédaction. `null` sans offre.
   */
  relevanceFactor: number | null
  /** Exigences de l'offre retrouvées dans le CV. */
  matchedKeywords: string[]
  /** Exigences de l'offre absentes du CV (les plus importantes d'abord). */
  missingKeywords: string[]
  experience: {
    requiredYears: number | null
    candidateYears: number | null
  }
  issues: AnalysisIssue[]
  /** Recommandations déterministes, toujours conditionnelles (« si c'est vrai »). */
  recommendations: string[]
  /** Fiabilité de l'analyse (0-1) : longueur du CV et de l'offre. */
  confidence: number
  /** Limites de l'analyse à afficher à l'utilisateur. */
  warnings: string[]
}
