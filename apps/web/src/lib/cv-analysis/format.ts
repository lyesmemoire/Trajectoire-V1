/**
 * Complétude et lisibilité d'un CV pour un ATS : signaux réellement mesurés dans
 * le texte (coordonnées, sections, dates, longueur, qualité d'extraction).
 */

import type { AnalysisIssue } from "./types"
import { normalize } from "./text"

const EMAIL_RE = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i
const PHONE_RE = /(?:\+|00)?\d[\d\s().-]{7,}\d/

const SECTION_KEYWORDS: Record<"experience" | "education" | "skills", string[]> = {
  experience: ["experience", "parcours", "emploi", "work history", "employment", "carriere"],
  education: ["formation", "education", "diplome", "etudes", "cursus", "scolarite"],
  skills: ["competence", "skills", "outils", "technologies", "logiciels", "savoir-faire"],
}

const SECTION_LABELS: Record<keyof typeof SECTION_KEYWORDS, string> = {
  experience: "Expérience",
  education: "Formation",
  skills: "Compétences",
}

/** Une section est « identifiée » si une ligne courte la nomme, ou commence par son intitulé. */
function hasSection(lines: string[], keywords: string[]): boolean {
  return lines.some((line) => {
    const short = line.length <= 60
    return keywords.some((k) => (short && line.includes(k)) || line.startsWith(k))
  })
}

export interface FormatAnalysis {
  /** Score 0-100. */
  score: number
  issues: AnalysisIssue[]
}

export function analyzeFormat(cvText: string): FormatAnalysis {
  const issues: AnalysisIssue[] = []
  let score = 0

  const lines = cvText
    .split(/\r?\n/)
    .map((l) => normalize(l).trim())
    .filter(Boolean)
  const length = cvText.trim().length

  // Coordonnées (25)
  if (EMAIL_RE.test(cvText)) score += 15
  else issues.push({ code: "no_email", message: "Aucune adresse e-mail détectée.", severity: "high" })

  if (PHONE_RE.test(cvText)) score += 10
  else issues.push({ code: "no_phone", message: "Aucun numéro de téléphone détecté.", severity: "medium" })

  // Sections (45)
  for (const key of Object.keys(SECTION_KEYWORDS) as Array<keyof typeof SECTION_KEYWORDS>) {
    if (hasSection(lines, SECTION_KEYWORDS[key])) score += 15
    else
      issues.push({
        code: `no_section_${key}`,
        message: `Section « ${SECTION_LABELS[key]} » non identifiée : un titre clair aide les logiciels de tri à la retrouver.`,
        severity: key === "experience" ? "high" : "medium",
      })
  }

  // Dates (10)
  const years = normalize(cvText).match(/\b(?:19|20)\d{2}\b/g) ?? []
  if (years.length >= 2) score += 10
  else issues.push({ code: "no_dates", message: "Peu ou pas de dates : indiquez les périodes de vos postes et de vos formations.", severity: "medium" })

  // Longueur (10)
  if (length >= 800 && length <= 15_000) score += 10
  else if (length < 800)
    issues.push({ code: "too_short", message: "CV très court : il détaille peu votre parcours.", severity: "high" })
  else
    issues.push({ code: "too_long", message: "CV très long : visez 1 à 2 pages.", severity: "low" })

  // Structure (5) : assez de lignes pour être lisible
  if (lines.length >= 12) score += 5
  else issues.push({ code: "poor_structure", message: "Texte peu structuré (peu de lignes ou de puces).", severity: "low" })

  // Qualité d'extraction (5) : trop de symboles = mise en page illisible pour un ATS
  const symbols = (cvText.match(/[^\p{L}\p{N}\s]/gu) ?? []).length
  if (length < 200 || symbols / length <= 0.15) score += 5
  else issues.push({ code: "noisy_text", message: "Beaucoup de symboles : la mise en page (colonnes, icônes, tableaux) peut gêner la lecture automatique.", severity: "medium" })

  return { score, issues }
}
