import { describe, it, expect } from "vitest"
import { normalizePreviewResult } from "./normalize-preview-result"

describe("normalizePreviewResult", () => {
  it("résultat plat (juste après l'analyse)", () => {
    expect(
      normalizePreviewResult({
        previewToken: "t",
        score: 72,
        strengths: ["A", "B"],
        weakness: "C",
      }),
    ).toEqual({ score: 72, strengths: ["A", "B"], weakness: "C" })
  })

  it("aperçu relu par jeton (enveloppe atsResult)", () => {
    expect(
      normalizePreviewResult({
        token: "t",
        atsResult: { score: 64, strengths: ["A"], weakness: "C" },
        candidateData: {},
      }),
    ).toEqual({ score: 64, strengths: ["A"], weakness: "C" })
  })

  it("faiblesse historique sous forme de tableau", () => {
    expect(
      normalizePreviewResult({ atsResult: { score: 50, strengths: [], weakness: ["", "X"] } }),
    ).toEqual({ score: 50, strengths: [], weakness: "X" })
  })

  it("sans faiblesse : null, jamais une valeur inventée", () => {
    expect(normalizePreviewResult({ score: 50, strengths: ["A"] })?.weakness).toBeNull()
  })

  it("borne le score entre 0 et 100", () => {
    expect(normalizePreviewResult({ score: 140 })?.score).toBe(100)
    expect(normalizePreviewResult({ score: -3 })?.score).toBe(0)
    expect(normalizePreviewResult({ score: 71.6 })?.score).toBe(72)
  })

  it("ancienne ligne simulée (atsScore, pas de score) : inexploitable → null", () => {
    expect(
      normalizePreviewResult({
        atsResult: { atsScore: 40, strengths: ["Expérience professionnelle"] },
      }),
    ).toBeNull()
  })

  it("entrées invalides : null", () => {
    expect(normalizePreviewResult(null)).toBeNull()
    expect(normalizePreviewResult("x")).toBeNull()
    expect(normalizePreviewResult({ score: "72" })).toBeNull()
    expect(normalizePreviewResult({ score: Number.NaN })).toBeNull()
  })
})
