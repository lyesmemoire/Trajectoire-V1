import { describe, it, expect } from "vitest"
import { analyzeCv } from "./index"
import { buildFreePreview, buildRemarks } from "./preview"
import { CV_DEV, CV_JUNIOR, CV_NURSE, JOB_DEV, JOB_MKT, JOB_NURSE } from "./fixtures"

const NOW = new Date("2026-10-01T00:00:00Z")
const preview = (cv: string, job?: string) => buildFreePreview(cv, job, { now: NOW })

describe("buildFreePreview — score + 3 remarques au plus", () => {
  it("bon match : score élevé, forces observées, pas de fausse alerte", () => {
    const p = preview(CV_DEV, JOB_DEV)
    expect(p.score).toBeGreaterThanOrEqual(80)
    expect(p.strengths.length).toBeGreaterThanOrEqual(1)
    expect(p.strengths.length).toBeLessThanOrEqual(2)
    expect(p.strengths.join(" ")).toMatch(/exigences clés de l'offre/)
  })

  it("hors sujet : score très bas et faiblesse explicite listant les exigences absentes", () => {
    const p = preview(CV_DEV, JOB_NURSE)
    expect(p.score).toBeLessThanOrEqual(30)
    expect(p.weakness).toMatch(/Peu d'exigences de l'offre apparaissent/)
    expect(p.weakness).toMatch(/infirmier|soins|diplôme/)
  })

  it("hors sujet : aucune force liée à l'offre (pas de « l'expérience atteint celle demandée »)", () => {
    const p = preview(CV_DEV, JOB_NURSE)
    expect(p.strengths.join(" ")).not.toMatch(/exigences clés|atteint celle demandée/)
  })

  it("bon match : l'expérience suffisante est bien signalée", () => {
    expect(preview(CV_DEV, JOB_DEV).strengths.join(" ")).toMatch(/atteint celle demandée/)
  })

  it("infirmière ↔ offre d'infirmier : forces citées, pas d'alerte de couverture", () => {
    const p = preview(CV_NURSE, JOB_NURSE)
    expect(p.strengths.join(" ")).toMatch(/exigences clés de l'offre/)
    expect(p.weakness ?? "").not.toMatch(/Peu d'exigences/)
  })

  it("jamais plus de 2 forces + 1 faiblesse", () => {
    for (const [cv, job] of [[CV_DEV, JOB_DEV], [CV_NURSE, JOB_NURSE], [CV_JUNIOR, JOB_MKT], [CV_DEV, JOB_NURSE]] as const) {
      const p = preview(cv, job)
      expect(p.strengths.length).toBeLessThanOrEqual(2)
      expect(typeof p.weakness === "string" || p.weakness === null).toBe(true)
    }
  })

  it("rien à dire sur les forces : liste vide, pas de remplissage", () => {
    const p = preview("Jean.", JOB_DEV)
    expect(p.strengths).toEqual([])
    expect(p.weakness).not.toBeNull()
  })

  it("sans offre : mode cv_only annoncé, aucune remarque sur l'offre", () => {
    const p = preview(CV_DEV)
    expect(p.mode).toBe("cv_only")
    expect(p.warnings.join(" ")).toMatch(/Aucune offre fournie/)
    expect([...p.strengths, p.weakness ?? ""].join(" ")).not.toMatch(/exigences/)
  })

  it("est déterministe et sans valeur inventée (score entier 0-100)", () => {
    expect(preview(CV_JUNIOR, JOB_MKT)).toEqual(preview(CV_JUNIOR, JOB_MKT))
    const { score } = preview(CV_JUNIOR, JOB_MKT)
    expect(Number.isInteger(score)).toBe(true)
    expect(score).toBeGreaterThanOrEqual(0)
    expect(score).toBeLessThanOrEqual(100)
  })
})

describe("buildRemarks — analyse complète (plus de remarques que l'aperçu)", () => {
  it("renvoie davantage de faiblesses que l'aperçu, toutes issues des mesures", () => {
    const result = analyzeCv(CV_JUNIOR, JOB_MKT, { now: NOW })
    const full = buildRemarks(result, { strengths: 4, weaknesses: 6 })
    const free = buildRemarks(result, { strengths: 2, weaknesses: 1 })

    expect(free.weaknesses).toHaveLength(1)
    expect(full.weaknesses.length).toBeGreaterThan(1)
    expect(full.weaknesses.length).toBeLessThanOrEqual(6)
    expect(full.weaknesses[0]).toBe(free.weaknesses[0])
    expect(new Set(full.weaknesses).size).toBe(full.weaknesses.length)
  })

  it("respecte les plafonds", () => {
    const result = analyzeCv(CV_DEV, JOB_DEV, { now: NOW })
    expect(buildRemarks(result, { strengths: 1, weaknesses: 1 }).strengths.length).toBeLessThanOrEqual(1)
  })
})
