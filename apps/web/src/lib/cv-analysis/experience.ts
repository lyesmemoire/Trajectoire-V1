/**
 * Années d'expérience : exigées par l'offre et démontrées par le CV.
 */

import { normalize } from "./text"

const MAX_YEARS = 50

/**
 * Années d'expérience exigées par l'offre (« 8 ans d'expérience minimum »,
 * « 5+ years of experience »…). `null` si l'offre n'en fixe pas.
 */
export function requiredYears(jobText: string): number | null {
  const text = normalize(jobText)
  const values: number[] = []

  // « 8 ans d'expérience », « 5+ years experience », « minimum 3 ans »
  const patterns = [
    /(\d{1,2})\s*\+?\s*(?:ans?|annees?|years?)\s*(?:d'|de\s+|of\s+)?(?:experience|exp)/g,
    /(?:experience|minimum|au moins|at least)[^.\n]{0,25}?(\d{1,2})\s*\+?\s*(?:ans?|annees?|years?)/g,
  ]

  for (const re of patterns) {
    for (const m of text.matchAll(re)) {
      const n = Number.parseInt(m[1], 10)
      if (Number.isFinite(n) && n > 0 && n <= MAX_YEARS) values.push(n)
    }
  }

  return values.length > 0 ? Math.max(...values) : null
}

const CURRENT_WORDS = "present|aujourd'hui|actuel|actuellement|now|current|ce jour"

/**
 * Années d'expérience du candidat : durée cumulée des périodes datées (fusionnées
 * si elles se chevauchent), à défaut la mention explicite la plus élevée.
 */
export function candidateYears(cvText: string, now: Date = new Date()): number | null {
  const text = normalize(cvText)
  const currentYear = now.getFullYear()

  const ranges: Array<[number, number]> = []
  const rangeRe = new RegExp(
    `\\b((?:19|20)\\d{2})\\s*(?:-|–|—|a|au|to)\\s*((?:19|20)\\d{2}|${CURRENT_WORDS})`,
    "g",
  )
  for (const m of text.matchAll(rangeRe)) {
    const start = Number.parseInt(m[1], 10)
    const end = /^\d/.test(m[2]) ? Number.parseInt(m[2], 10) : currentYear
    if (start <= end && start >= 1970 && end <= currentYear + 1) ranges.push([start, end])
  }

  if (ranges.length > 0) {
    ranges.sort((a, b) => a[0] - b[0])
    let total = 0
    let [curStart, curEnd] = ranges[0]
    for (const [s, e] of ranges.slice(1)) {
      if (s <= curEnd) curEnd = Math.max(curEnd, e)
      else {
        total += curEnd - curStart
        ;[curStart, curEnd] = [s, e]
      }
    }
    total += curEnd - curStart
    return Math.min(total, MAX_YEARS)
  }

  const explicit = [
    ...text.matchAll(/(\d{1,2})\s*\+?\s*(?:ans?|annees?|years?)\s*(?:d'|de\s+|of\s+)?(?:experience|exp)/g),
  ]
    .map((m) => Number.parseInt(m[1], 10))
    .filter((n) => Number.isFinite(n) && n > 0 && n <= MAX_YEARS)

  return explicit.length > 0 ? Math.max(...explicit) : null
}

/**
 * Adéquation 0-100 : 100 si le candidat atteint la durée exigée, proportionnelle sinon.
 * `null` (non évalué) si l'offre ne fixe pas de durée ou si celle du CV est inconnue.
 */
export function experienceFit(required: number | null, candidate: number | null): number | null {
  if (required === null || candidate === null) return null
  return Math.max(0, Math.min(100, Math.round((candidate / required) * 100)))
}
