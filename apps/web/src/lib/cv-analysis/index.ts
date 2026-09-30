/**
 * Analyse ATS d'un CV face à une offre — noyau déterministe (sans IA).
 *
 * Dimensions (toutes calculées, jamais de valeur par défaut) :
 * - couverture des exigences de l'offre (mots entiers, accents, pluriels) ;
 * - expérience comparée à celle demandée ;
 * - réalisations chiffrées ;
 * - complétude / lisibilité pour un ATS.
 *
 * Sans offre exploitable, l'analyse porte sur le seul CV (`mode: "cv_only"`) et
 * l'indique. Les recommandations sont conditionnelles : le moteur ne suppose
 * jamais qu'une compétence absente du CV est maîtrisée.
 */

import { analyzeFormat } from "./format"
import { analyzeImpact } from "./impact"
import { candidateYears, experienceFit, requiredYears } from "./experience"
import { extractJobTerms, keywordCoverage } from "./keywords"
import type { AnalysisIssue, CvAnalysisResult } from "./types"

export type { CvAnalysisResult, AnalysisIssue, AnalysisMode } from "./types"

const MIN_JOB_LENGTH = 80
const MIN_JOB_TERMS = 4

const WEIGHTS_JOB_MATCH = { keywordCoverage: 0.45, experienceFit: 0.2, impact: 0.15, format: 0.2 }
const WEIGHTS_CV_ONLY = { impact: 0.4, format: 0.6 }

/**
 * Plafond d'adéquation : à couverture des exigences nulle, le score est réduit à 35 % de
 * sa valeur ; il remonte linéairement jusqu'à 100 % à partir de 60 % de couverture.
 */
const RELEVANCE_FLOOR = 0.35
const RELEVANCE_FULL_AT = 60

function relevanceFactor(keywordScore: number): number {
  return RELEVANCE_FLOOR + (1 - RELEVANCE_FLOOR) * Math.min(1, keywordScore / RELEVANCE_FULL_AT)
}

const ISSUE_ACTIONS: Record<string, string> = {
  no_email: "Ajoutez une adresse e-mail en tête de CV, en texte simple.",
  no_phone: "Ajoutez un numéro de téléphone en tête de CV.",
  no_section_experience: "Ajoutez un titre « Expérience professionnelle » au-dessus de vos postes.",
  no_section_education: "Ajoutez un titre « Formation » au-dessus de vos diplômes.",
  no_section_skills: "Regroupez vos compétences sous un titre « Compétences ».",
  no_dates: "Datez chaque poste et chaque formation (mois/année).",
  too_short: "Détaillez votre parcours : missions, contexte et résultats de chaque poste.",
  too_long: "Resserrez le CV autour des expériences les plus pertinentes (1 à 2 pages).",
  noisy_text: "Simplifiez la mise en page (une colonne, pas d'icônes ni de tableaux) pour faciliter la lecture automatique.",
}

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n))
}

export function analyzeCv(
  cvText: string,
  jobText?: string | null,
  options: { now?: Date } = {},
): CvAnalysisResult {
  const cv = cvText ?? ""
  const job = (jobText ?? "").trim()

  const format = analyzeFormat(cv)
  const impact = analyzeImpact(cv)

  const terms = job.length >= MIN_JOB_LENGTH ? extractJobTerms(job) : []
  const hasJob = terms.length >= MIN_JOB_TERMS

  const warnings: string[] = []
  const issues: AnalysisIssue[] = [...format.issues]
  const recommendations: string[] = []

  let coverage = { score: 0, matched: [] as string[], missing: [] as string[], totalTerms: 0 }
  let required: number | null = null
  let candidate: number | null = null
  let fit: number | null = null

  if (hasJob) {
    coverage = keywordCoverage(cv, terms)
    required = requiredYears(job)
    candidate = candidateYears(cv, options.now)
    fit = experienceFit(required, candidate)
  } else {
    candidate = candidateYears(cv, options.now)
    warnings.push(
      job.length === 0
        ? "Aucune offre fournie : l'analyse ne porte que sur la qualité du CV, pas sur son adéquation à un poste."
        : "Offre trop courte pour être exploitée : l'analyse ne porte que sur la qualité du CV, pas sur son adéquation à un poste.",
    )
  }

  // Score global : moyenne pondérée des seules dimensions évaluées.
  const raw: Array<[string, number | null, number]> = hasJob
    ? [
        ["keywordCoverage", coverage.score, WEIGHTS_JOB_MATCH.keywordCoverage],
        ["experienceFit", fit, WEIGHTS_JOB_MATCH.experienceFit],
        ["impact", impact.score, WEIGHTS_JOB_MATCH.impact],
        ["format", format.score, WEIGHTS_JOB_MATCH.format],
      ]
    : [
        ["impact", impact.score, WEIGHTS_CV_ONLY.impact],
        ["format", format.score, WEIGHTS_CV_ONLY.format],
      ]
  const active = raw.filter(([, value]) => value !== null)
  const weightSum = active.reduce((sum, [, , w]) => sum + w, 0)
  const weights: Record<string, number> = {}
  let overall = 0
  for (const [key, value, w] of active) {
    const normalized = w / weightSum
    weights[key] = Math.round(normalized * 100) / 100
    overall += (value as number) * normalized
  }

  const relevance = hasJob ? Math.round(relevanceFactor(coverage.score) * 100) / 100 : null
  if (relevance !== null) overall *= relevance
  if (hasJob && required !== null && candidate === null) {
    warnings.push("Durée d'expérience du CV non déterminable (postes non datés) : l'adéquation d'expérience n'est pas évaluée.")
  }

  // Recommandations : toujours conditionnelles, jamais d'invention.
  if (hasJob && coverage.missing.length > 0) {
    const top = coverage.missing.slice(0, 5).join(", ")
    recommendations.push(
      `L'offre cite : ${top}. Si vous maîtrisez réellement ces points, faites-les apparaître dans votre CV avec un exemple concret ; sinon, ne les ajoutez pas.`,
    )
  }
  if (hasJob && required !== null && candidate !== null && candidate < required) {
    recommendations.push(
      `L'offre demande ${required} ans d'expérience ; votre CV en démontre environ ${candidate}. Mettez en avant les missions les plus proches du poste et leurs résultats.`,
    )
  }
  if (hasJob && required !== null && candidate === null) {
    recommendations.push(
      `L'offre demande ${required} ans d'expérience : datez vos postes pour que la durée de votre parcours soit lisible.`,
    )
  }
  if (impact.score < 40) {
    recommendations.push(
      "Ajoutez des résultats chiffrés (pourcentages, montants, volumes, taille d'équipe) pour vos principales réalisations — uniquement ceux que vous pouvez justifier.",
    )
  }
  for (const issue of format.issues) {
    if (issue.severity === "low") continue
    const action = ISSUE_ACTIONS[issue.code]
    if (action) recommendations.push(action)
  }

  // Confiance : dépend de la matière analysée.
  const cvFactor = clamp01(cv.trim().length / 1500)
  const jobFactor = hasJob ? clamp01(job.length / 400) : 1
  const confidence = Math.round(Math.min(cvFactor, jobFactor) * 100) / 100
  if (cv.trim().length < 800) {
    warnings.push("CV très court : l'analyse est peu fiable.")
  }

  return {
    mode: hasJob ? "job_match" : "cv_only",
    overall: Math.round(overall),
    dimensions: {
      keywordCoverage: hasJob ? coverage.score : null,
      experienceFit: hasJob ? fit : null,
      impact: impact.score,
      format: format.score,
    },
    weights,
    relevanceFactor: relevance,
    matchedKeywords: coverage.matched,
    missingKeywords: coverage.missing,
    experience: { requiredYears: required, candidateYears: candidate },
    issues,
    recommendations,
    confidence,
    warnings,
  }
}
