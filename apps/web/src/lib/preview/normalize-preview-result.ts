/**
 * Lecture tolérante du résultat d'un aperçu.
 *
 * Un aperçu arrive sous deux formes :
 * - plat, juste après l'analyse : `{ score, strengths, weakness }` ;
 * - enveloppé, quand on le relit par jeton (`/api/public/preview/[token]`) :
 *   `{ atsResult: { score, strengths, weakness }, … }`.
 *
 * Les anciennes lignes « simulées » (champ `atsScore`, pas de `score`) ne sont
 * pas exploitables : on renvoie `null` plutôt que d'afficher des valeurs fausses.
 */

export interface PreviewResultView {
  score: number
  strengths: string[]
  weakness: string | null
  /** Analyse face à une offre, ou du seul CV (offre absente / trop courte). */
  mode: "job_match" | "cv_only" | null
  /** Limites de l'analyse à afficher à l'utilisateur. */
  warnings: string[]
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

export function normalizePreviewResult(data: unknown): PreviewResultView | null {
  if (!isRecord(data)) return null

  const source = isRecord(data.atsResult) ? data.atsResult : data
  const rawScore = source.score

  if (typeof rawScore !== "number" || !Number.isFinite(rawScore)) return null

  const strengths = Array.isArray(source.strengths)
    ? source.strengths.filter(
        (item): item is string => typeof item === "string" && item.trim().length > 0,
      )
    : []

  const rawWeakness = source.weakness
  const firstWeakness = Array.isArray(rawWeakness)
    ? rawWeakness.find(
        (item): item is string => typeof item === "string" && item.trim().length > 0,
      )
    : rawWeakness
  const weakness =
    typeof firstWeakness === "string" && firstWeakness.trim().length > 0
      ? firstWeakness.trim()
      : null

  const mode = source.mode === "job_match" || source.mode === "cv_only" ? source.mode : null
  const warnings = Array.isArray(source.warnings)
    ? source.warnings.filter(
        (item): item is string => typeof item === "string" && item.trim().length > 0,
      )
    : []

  return {
    score: Math.min(100, Math.max(0, Math.round(rawScore))),
    strengths,
    weakness,
    mode,
    warnings,
  }
}
