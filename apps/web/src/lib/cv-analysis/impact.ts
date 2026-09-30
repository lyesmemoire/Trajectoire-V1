/**
 * Réalisations chiffrées et verbes d'action.
 */

import { normalize } from "./text"

const UNITS =
  "jours?|heures?|mois|semaines?|clients?|utilisateurs?|projets?|personnes?|collaborateurs?|" +
  "developpeurs?|patients?|etudiants?|eleves?|ventes?|contrats?|equipes?|sites?|pays|agences?|magasins?|millions?|milliards?"

/** Un chiffre suivi d'une unité parlante (les années d'expérience ne comptent pas). */
const QUANTIFIED_RE = new RegExp(
  [
    String.raw`\d+(?:[.,]\d+)?\s?%`, // 40%, 12,5 %
    String.raw`\d+(?:[.,]\d+)?\s?(?:k|m)?\s?€`, // 120 k€, 45 000 €
    String.raw`\d+(?:[.,]\d+)?\s?(?:k|m)?\s?euros?\b`,
    String.raw`\d+(?:[.,]\d+)?\s?(?:k|m)\b`,
    String.raw`\b\d+(?:[.,]\d+)?\s+(?:${UNITS})\b`, // 3 projets, 4 étudiants
    String.raw`\b(?:equipe|team)\s+de\s+\d+`, // équipe de 6
  ].join("|"),
  "g",
)

const ACTION_VERBS = new RegExp(
  String.raw`\b(?:augment|reduit|reduction|diminu|ameliore|optimis|economi|accelere|croissance|genere|lance|` +
    String.raw`migr|pilot|deploy|automatis|negoci|encadr|dirig|cree|concu|developpe|mis en place|restructur)\w*`,
  "g",
)

export interface ImpactAnalysis {
  /** Score 0-100. */
  score: number
  /** Nombre de réalisations chiffrées détectées. */
  quantified: number
  /** Nombre de verbes d'action distincts. */
  actionVerbs: number
}

export function analyzeImpact(cvText: string): ImpactAnalysis {
  const text = normalize(cvText)

  const quantified = new Set((text.match(QUANTIFIED_RE) ?? []).map((m) => m.replace(/\s+/g, "")))
  const verbs = new Set(text.match(ACTION_VERBS) ?? [])

  const score = Math.min(100, quantified.size * 15 + Math.min(verbs.size, 5) * 5)

  return { score, quantified: quantified.size, actionVerbs: verbs.size }
}
