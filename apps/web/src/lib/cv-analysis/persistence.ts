/**
 * Enregistrement d'une analyse ATS dans `CVAnalysis` (colonnes déjà lues par le
 * tableau de bord : `atsScoreAfter`, `improvements`, `keywords`).
 *
 * - `atsScoreAfter` : score global de l'analyse ;
 * - `atsScoreBefore` : non applicable (aucune optimisation appliquée) → `null` ;
 * - `improvements` : recommandations (liste de textes) ;
 * - `keywords` : le résultat complet, pour pouvoir le réafficher tel quel.
 */

import type { CvAnalysisResult } from "./types"

export interface AtsRecord {
  atsScoreBefore: number | null
  atsScoreAfter: number
  improvements: string[]
  keywords: CvAnalysisResult
}

export function toAtsRecord(ats: CvAnalysisResult): AtsRecord {
  return {
    atsScoreBefore: null,
    atsScoreAfter: ats.overall,
    improvements: ats.recommendations,
    keywords: ats,
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

/**
 * Relit une analyse enregistrée. Renvoie `null` pour une ligne antérieure au moteur
 * (colonne vide ou d'une autre forme) : on n'invente rien.
 */
export function readStoredAts(keywords: unknown): CvAnalysisResult | null {
  if (!isRecord(keywords)) return null
  if (typeof keywords.overall !== "number" || !Number.isFinite(keywords.overall)) return null
  if (!isRecord(keywords.dimensions)) return null
  if (keywords.mode !== "job_match" && keywords.mode !== "cv_only") return null

  return keywords as unknown as CvAnalysisResult
}
