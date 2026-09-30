/**
 * Aperçu gratuit : score + 3 remarques au plus (2 forces, 1 faiblesse).
 *
 * Tout est déduit de l'analyse déterministe (`analyzeCv`) : aucune IA, aucun coût,
 * résultat reproductible. Une remarque n'est écrite que si les chiffres la justifient ;
 * s'il n'y a rien à dire, il y a moins de remarques (jamais de remplissage).
 */

import { analyzeCv, type AnalysisMode, type CvAnalysisResult } from "./index"

export interface FreePreview {
  score: number
  /** 0 à 2 forces réellement observées. */
  strengths: string[]
  /** Le point le plus important à corriger, ou `null` s'il n'y en a pas. */
  weakness: string | null
  mode: AnalysisMode
  confidence: number
  /** Limites de l'analyse (offre absente ou trop courte, CV très court…). */
  warnings: string[]
}

interface Candidate {
  weight: number
  text: string
}

function joinTerms(terms: string[], max: number): string {
  return terms.slice(0, max).join(", ")
}

function pickStrengths(r: CvAnalysisResult, max: number): string[] {
  const candidates: Candidate[] = []
  const { keywordCoverage, impact, format } = r.dimensions

  if (r.mode === "job_match" && keywordCoverage !== null && keywordCoverage >= 50) {
    const sample = joinTerms(r.matchedKeywords, 3)
    candidates.push({
      weight: 100, // forces liées à l'offre en premier
      text: `Votre CV couvre ${keywordCoverage} % des exigences clés de l'offre${sample ? ` (par exemple : ${sample})` : ""}.`,
    })
  }

  // L'expérience n'est une force « pour ce poste » que si le CV correspond un minimum à l'offre.
  const relevantToJob = r.mode === "job_match" && keywordCoverage !== null && keywordCoverage >= 40
  const { requiredYears, candidateYears } = r.experience
  if (relevantToJob && requiredYears !== null && candidateYears !== null && candidateYears >= requiredYears) {
    candidates.push({
      weight: 95,
      text: `Votre expérience (environ ${candidateYears} ans) atteint celle demandée (${requiredYears} ans).`,
    })
  }

  if (impact >= 45) {
    candidates.push({ weight: Math.min(impact, 90), text: "Votre CV met en avant des réalisations chiffrées." })
  }

  if (format >= 75) {
    candidates.push({
      weight: Math.min(format, 90),
      text: "Votre CV est bien structuré : coordonnées, sections et dates sont identifiables.",
    })
  }

  return candidates
    .sort((a, b) => b.weight - a.weight)
    .slice(0, max)
    .map((c) => c.text)
}

function pickWeaknesses(r: CvAnalysisResult, max: number): string[] {
  const out: string[] = []
  const push = (text: string | null) => {
    if (text && !out.includes(text)) out.push(text)
  }
  const first = pickTopWeakness(r)
  push(first)
  if (max > 1) {
    for (const issue of r.issues) {
      if (issue.severity !== "low") push(issue.message)
    }
    const { requiredYears, candidateYears } = r.experience
    if (requiredYears !== null && candidateYears !== null && candidateYears < requiredYears) {
      push(`Votre expérience (environ ${candidateYears} ans) est inférieure à celle demandée (${requiredYears} ans).`)
    }
    if (r.dimensions.impact < 40) push("Peu de réalisations chiffrées.")
  }
  return out.slice(0, max)
}

function pickTopWeakness(r: CvAnalysisResult): string | null {
  const { keywordCoverage, impact } = r.dimensions

  if (r.mode === "job_match" && keywordCoverage !== null && keywordCoverage < 40) {
    const missing = joinTerms(r.missingKeywords, 4)
    return `Peu d'exigences de l'offre apparaissent dans votre CV (${keywordCoverage} % de couverture)${missing ? ` : ${missing}, notamment, n'y figurent pas` : ""}.`
  }

  const high = r.issues.find((i) => i.severity === "high")
  if (high) return high.message

  const { requiredYears, candidateYears } = r.experience
  if (requiredYears !== null && candidateYears !== null && candidateYears < requiredYears) {
    return `Votre expérience (environ ${candidateYears} ans) est inférieure à celle demandée (${requiredYears} ans) : mettez en avant les missions les plus proches du poste.`
  }

  if (impact < 40) {
    return "Peu de réalisations chiffrées : ajoutez des résultats mesurables (pourcentages, montants, volumes) que vous pouvez justifier."
  }

  const medium = r.issues.find((i) => i.severity === "medium")
  if (medium) return medium.message

  if (r.mode === "job_match" && keywordCoverage !== null && keywordCoverage < 70 && r.missingKeywords.length > 0) {
    return `Certaines exigences de l'offre n'apparaissent pas dans votre CV : ${joinTerms(r.missingKeywords, 4)}.`
  }

  return null
}

/** Remarques déduites d'une analyse, avec un plafond (aperçu : 2 + 1 ; analyse complète : davantage). */
export function buildRemarks(
  result: CvAnalysisResult,
  limits: { strengths: number; weaknesses: number },
): { strengths: string[]; weaknesses: string[] } {
  return {
    strengths: pickStrengths(result, limits.strengths),
    weaknesses: pickWeaknesses(result, limits.weaknesses),
  }
}

export function buildFreePreview(
  cvText: string,
  jobText?: string | null,
  options: { now?: Date } = {},
): FreePreview {
  const result = analyzeCv(cvText, jobText, options)

  const remarks = buildRemarks(result, { strengths: 2, weaknesses: 1 })

  return {
    score: result.overall,
    strengths: remarks.strengths,
    weakness: remarks.weaknesses[0] ?? null,
    mode: result.mode,
    confidence: result.confidence,
    warnings: result.warnings,
  }
}
