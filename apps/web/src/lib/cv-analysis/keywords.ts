/**
 * Exigences d'une offre et couverture par un CV.
 *
 * Pas de dictionnaire métier figé : les exigences sont extraites de l'offre elle-même
 * (fréquence, titre, acronymes, lignes « compétences / exigé / diplôme… »), donc le
 * moteur fonctionne pour un infirmier comme pour un développeur.
 */

import { isStopword, normalize, stem, stemSet, tokenize } from "./text"

export interface JobTerm {
  /** Forme affichable, telle qu'écrite dans l'offre (accents et casse d'origine). */
  term: string
  stem: string
  weight: number
}

const MAX_TERMS = 18

/** Lignes qui introduisent une exigence : leurs termes pèsent davantage. */
const REQUIREMENT_MARKERS = [
  "competence",
  "maitris",
  "connaissance",
  "exige",
  "requis",
  "indispensable",
  "obligatoire",
  "diplome",
  "certification",
  "outil",
  "logiciel",
  "langue",
  "habilitation",
]

const ACRONYM_RE = /\b[A-Z][A-Z0-9]{1,6}\b/g

/** Mots d'origine (accents et casse conservés), sans apostrophes : « d'État » donne « d » puis « État ». */
const RAW_WORD_RE = /[\p{L}\p{N}][\p{L}\p{N}+#./-]*/gu

/** Forme affichable : minuscules pour un mot ordinaire, casse d'origine pour un sigle ou un nom composé. */
function displayForm(raw: string): string {
  const cleaned = raw.replace(/[.-]+$/, "")
  return /^\p{Lu}?[\p{Ll}\p{N}.+#/-]*$/u.test(cleaned) ? cleaned.toLowerCase() : cleaned
}

/** Extrait les exigences pondérées d'une offre (les plus importantes d'abord). */
export function extractJobTerms(jobText: string): JobTerm[] {
  const lines = jobText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)

  if (lines.length === 0) return []

  const acronyms = new Set(
    (jobText.match(ACRONYM_RE) ?? []).map((a) => stem(normalize(a))),
  )

  type Acc = { forms: Map<string, number>; count: number; bonus: number; firstIndex: number }
  const byStem = new Map<string, Acc>()
  let order = 0

  lines.forEach((line, lineIndex) => {
    const normalizedLine = normalize(line)
    const isTitle = lineIndex === 0
    const isRequirementLine = REQUIREMENT_MARKERS.some((m) => normalizedLine.includes(m))

    for (const raw of line.match(RAW_WORD_RE) ?? []) {
      const tokens = tokenize(raw)
      // « SEA/SEO » : une forme affichable par alternative.
      const parts = raw.split("/").filter(Boolean)

      tokens.forEach((token, i) => {
        if (token.length < 2 || /^\d+$/.test(token) || isStopword(token)) return
        // Verbes à la 2e personne du pluriel d'une annonce (« vous piloterez », « analysez »).
        if (token.length >= 6 && token.endsWith("ez")) return
        const s = stem(token)
        if (s.length < 2 || isStopword(s)) return

        const source = tokens.length === 1 ? raw : parts.length === tokens.length ? parts[i] : token
        const shown = displayForm(source)

        const acc =
          byStem.get(s) ??
          { forms: new Map<string, number>(), count: 0, bonus: 0, firstIndex: order }
        acc.count += 1
        acc.forms.set(shown, (acc.forms.get(shown) ?? 0) + 1)
        if (isTitle) acc.bonus = Math.max(acc.bonus, 2)
        if (isRequirementLine) acc.bonus = Math.max(acc.bonus, 1)
        byStem.set(s, acc)
        order += 1
      })
    }
  })

  const terms: JobTerm[] = []
  for (const [s, acc] of byStem) {
    const form = [...acc.forms.entries()].sort((a, b) => b[1] - a[1])[0][0]
    const weight = Math.min(3, acc.count) + acc.bonus + (acronyms.has(s) ? 1 : 0)
    terms.push({ term: form, stem: s, weight })
  }

  const firstIndex = (s: string) => byStem.get(s)?.firstIndex ?? 0
  return terms
    .sort((a, b) => b.weight - a.weight || firstIndex(a.stem) - firstIndex(b.stem))
    .slice(0, MAX_TERMS)
}

export interface KeywordCoverage {
  /** Couverture pondérée 0-100. */
  score: number
  matched: string[]
  missing: string[]
  totalTerms: number
}

/** Part pondérée des exigences de l'offre retrouvées (par mot entier) dans le CV. */
export function keywordCoverage(cvText: string, terms: JobTerm[]): KeywordCoverage {
  const cvStems = stemSet(cvText)
  const matched: JobTerm[] = []
  const missing: JobTerm[] = []

  for (const t of terms) (cvStems.has(t.stem) ? matched : missing).push(t)

  const total = terms.reduce((sum, t) => sum + t.weight, 0)
  const got = matched.reduce((sum, t) => sum + t.weight, 0)

  return {
    score: total === 0 ? 0 : Math.round((got / total) * 100),
    matched: matched.map((t) => t.term),
    missing: missing.map((t) => t.term),
    totalTerms: terms.length,
  }
}
