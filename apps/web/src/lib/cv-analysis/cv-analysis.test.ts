import { describe, it, expect } from "vitest"
import { analyzeCv } from "./index"
import { CV_DEV, CV_JUNIOR, CV_NURSE, JOB_DEV, JOB_MKT, JOB_NURSE } from "./fixtures"

const NOW = new Date("2026-10-01T00:00:00Z")
const run = (cv: string, job?: string) => analyzeCv(cv, job, { now: NOW })

describe("analyzeCv — le score discrimine les métiers (régression du premium-orchestrator)", () => {
  it("dev senior ↔ offre dev : score élevé", () => {
    const r = run(CV_DEV, JOB_DEV)
    expect(r.mode).toBe("job_match")
    expect(r.overall).toBeGreaterThanOrEqual(80)
    expect(r.relevanceFactor).toBe(1)
    expect(r.matchedKeywords).toEqual(expect.arrayContaining(["react", "typescript", "nodejs", "postgresql"]))
  })

  it("dev senior ↔ offre d'infirmier : score très bas (l'ancien moteur donnait 86)", () => {
    const good = run(CV_DEV, JOB_DEV)
    const bad = run(CV_DEV, JOB_NURSE)
    expect(bad.overall).toBeLessThanOrEqual(30)
    expect(good.overall - bad.overall).toBeGreaterThanOrEqual(50)
    expect(bad.dimensions.keywordCoverage).toBeLessThanOrEqual(15)
    expect(bad.missingKeywords).toEqual(expect.arrayContaining(["infirmier", "soins", "diplome"]))
  })

  it("infirmière ↔ offre d'infirmier (métier non technique) : bon score", () => {
    const r = run(CV_NURSE, JOB_NURSE)
    expect(r.dimensions.keywordCoverage).toBeGreaterThanOrEqual(80)
    expect(r.overall).toBeGreaterThanOrEqual(60)
    expect(r.matchedKeywords).toEqual(expect.arrayContaining(["infirmier", "soins", "afgsu", "surveillance"]))
  })

  it("infirmière ↔ offre dev : très bas, dans l'autre sens aussi", () => {
    expect(run(CV_NURSE, JOB_DEV).overall).toBeLessThanOrEqual(30)
  })

  it("assistante junior ↔ responsable marketing : score bas", () => {
    const r = run(CV_JUNIOR, JOB_MKT)
    expect(r.overall).toBeLessThanOrEqual(25)
    expect(r.matchedKeywords).toEqual(expect.arrayContaining(["marketing", "excel"]))
  })

  it("classement cohérent : bon match > match partiel > hors sujet", () => {
    const scores = [run(CV_DEV, JOB_DEV), run(CV_JUNIOR, JOB_MKT), run(CV_DEV, JOB_NURSE)].map((r) => r.overall)
    expect(scores[0]).toBeGreaterThan(scores[1])
    expect(scores[0]).toBeGreaterThan(scores[2])
  })
})

describe("analyzeCv — pas de faux positifs par sous-chaîne", () => {
  it("« go » et « git » ne sont pas trouvés dans « Google » ni « digital »", () => {
    const r = run(CV_JUNIOR, JOB_MKT)
    expect(r.missingKeywords).not.toContain("go")
    expect(r.missingKeywords).not.toContain("git")
    expect(r.matchedKeywords).not.toContain("go")
  })

  it("les alternatives « SEA/SEO » sont séparées", () => {
    const r = run(CV_JUNIOR, JOB_MKT)
    expect([...r.missingKeywords, ...r.matchedKeywords]).toEqual(expect.arrayContaining(["sea", "seo"]))
  })
})

describe("analyzeCv — expérience", () => {
  it("compare la durée du CV (périodes datées) à celle exigée", () => {
    const r = run(CV_DEV, JOB_DEV)
    expect(r.experience).toEqual({ requiredYears: 8, candidateYears: 11 })
    expect(r.dimensions.experienceFit).toBe(100)
  })

  it("expérience insuffisante : adéquation proportionnelle et recommandation", () => {
    const r = run(CV_NURSE, JOB_DEV) // 5 ans déclarés pour 8 exigés
    expect(r.dimensions.experienceFit).toBe(63)
    expect(r.recommendations.join(" ")).toMatch(/8 ans d'expérience/)
  })

  it("durée du CV inconnue : dimension non évaluée (null) et avertissement, pas de 0 inventé", () => {
    const r = run(CV_JUNIOR, JOB_MKT)
    expect(r.dimensions.experienceFit).toBeNull()
    expect(r.weights).not.toHaveProperty("experienceFit")
    expect(r.warnings.join(" ")).toMatch(/non déterminable/)
  })

  it("offre sans durée exigée : dimension non évaluée", () => {
    const job =
      "Développeur React\nNous recherchons un développeur pour construire notre application React avec TypeScript, Node.js et PostgreSQL au sein d'une équipe produit."
    expect(run(CV_DEV, job).dimensions.experienceFit).toBeNull()
  })
})

describe("analyzeCv — sans offre exploitable", () => {
  it("sans offre : analyse du seul CV, annoncée comme telle", () => {
    const r = run(CV_DEV)
    expect(r.mode).toBe("cv_only")
    expect(r.dimensions.keywordCoverage).toBeNull()
    expect(r.dimensions.experienceFit).toBeNull()
    expect(r.relevanceFactor).toBeNull()
    expect(r.warnings.join(" ")).toMatch(/Aucune offre fournie/)
    expect(Object.values(r.weights).reduce((a, b) => a + b, 0)).toBeCloseTo(1, 1)
  })

  it("offre trop courte : traitée comme absente", () => {
    const r = run(CV_DEV, "Développeur React")
    expect(r.mode).toBe("cv_only")
    expect(r.warnings.join(" ")).toMatch(/trop courte/)
  })
})

describe("analyzeCv — qualité du CV", () => {
  it("détecte l'absence de coordonnées et de sections, avec recommandations", () => {
    const r = run(CV_JUNIOR, JOB_MKT)
    const codes = r.issues.map((i) => i.code)
    expect(codes).toEqual(
      expect.arrayContaining(["no_email", "no_phone", "no_section_experience", "no_dates", "too_short"]),
    )
    expect(r.recommendations.join(" ")).toMatch(/adresse e-mail/)
  })

  it("CV quasi vide : score nul ou presque, confiance nulle", () => {
    const r = run("Jean.", JOB_DEV)
    expect(r.overall).toBeLessThanOrEqual(5)
    expect(r.confidence).toBe(0)
    expect(r.warnings.join(" ")).toMatch(/très court/)
  })

  it("compte les pourcentages et les euros (regex corrigée)", () => {
    const r = run("Chef de projet. Réduction des coûts de 12,5 % et économie de 45 000 € sur 2 sites, équipe de 8.")
    expect(r.dimensions.impact).toBeGreaterThanOrEqual(45)
  })
})

describe("analyzeCv — honnêteté des recommandations", () => {
  it("ne suppose jamais qu'une compétence manquante est maîtrisée", () => {
    const r = run(CV_DEV, JOB_NURSE)
    const advice = r.recommendations.find((x) => x.startsWith("L'offre cite"))
    expect(advice).toBeDefined()
    expect(advice).toMatch(/Si vous maîtrisez réellement/)
    expect(advice).toMatch(/sinon, ne les ajoutez pas/)
  })

  it("le score est toujours entre 0 et 100 et les poids somment à 1", () => {
    const cases: Array<[string, string]> = [
      [CV_DEV, JOB_DEV],
      [CV_NURSE, JOB_NURSE],
      [CV_JUNIOR, JOB_MKT],
      ["x", JOB_DEV],
    ]
    for (const [cv, job] of cases) {
      const r = run(cv, job)
      expect(r.overall).toBeGreaterThanOrEqual(0)
      expect(r.overall).toBeLessThanOrEqual(100)
      expect(Object.values(r.weights).reduce((a, b) => a + b, 0)).toBeCloseTo(1, 1)
    }
  })

  it("est déterministe", () => {
    expect(run(CV_DEV, JOB_DEV)).toEqual(run(CV_DEV, JOB_DEV))
  })
})
