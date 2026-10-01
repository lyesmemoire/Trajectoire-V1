import { extractJobTerms, keywordCoverage } from "@/lib/cv-analysis/keywords"
import type { NormalizedOffer } from "./types"

/**
 * Score d'une offre pour un utilisateur : couverture pondérée des exigences de l'offre par son CV, avec le
 * moteur déterministe du module CV (`lib/cv-analysis`). Aucun modèle, aucune valeur inventée :
 * - sans CV exploitable ou sans exigence repérable dans l'offre, le score est `null` (affiché « non évalué ») ;
 * - le détail (mots retrouvés et manquants) est celui qui justifie le score.
 */

/** Longueur minimale de CV (caractères) en dessous de laquelle on n'évalue pas. */
export const MIN_CV_CHARS = 200
/** Nombre minimal d'exigences repérées dans l'offre pour qu'un score ait un sens. */
export const MIN_OFFER_TERMS = 3
/** Longueur maximale de texte d'offre analysée (borne le coût). */
const MAX_OFFER_CHARS = 8000

export type OfferScore = {
  score: number | null
  details: {
    method: "keyword_coverage"
    matched: string[]
    missing: string[]
    totalTerms: number
    /** Raison de l'absence de score, sinon null. */
    reason: "cv_missing" | "offer_too_vague" | null
  }
}

export function scoreOffer(cvText: string | null | undefined, offer: Pick<NormalizedOffer, "title" | "description">): OfferScore {
  const empty = (reason: "cv_missing" | "offer_too_vague", totalTerms = 0): OfferScore => ({
    score: null,
    details: { method: "keyword_coverage", matched: [], missing: [], totalTerms, reason },
  })

  const cv = (cvText ?? "").trim()
  if (cv.length < MIN_CV_CHARS) return empty("cv_missing")

  // Le titre est répété en tête pour peser dans l'extraction des exigences.
  const text = `${offer.title}\n${offer.description}`.slice(0, MAX_OFFER_CHARS)
  const terms = extractJobTerms(text)
  if (terms.length < MIN_OFFER_TERMS) return empty("offer_too_vague", terms.length)

  const coverage = keywordCoverage(cv, terms)
  return {
    score: coverage.score,
    details: {
      method: "keyword_coverage",
      matched: coverage.matched,
      missing: coverage.missing,
      totalTerms: coverage.totalTerms,
      reason: null,
    },
  }
}
