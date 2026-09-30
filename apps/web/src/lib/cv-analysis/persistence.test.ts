import { describe, it, expect } from "vitest"
import { analyzeCv } from "./index"
import { readStoredAts, toAtsRecord } from "./persistence"
import { CV_DEV, JOB_DEV } from "./fixtures"

const NOW = new Date("2026-10-01T00:00:00Z")

describe("persistence de l'analyse ATS", () => {
  it("toAtsRecord : score, recommandations et résultat complet", () => {
    const ats = analyzeCv(CV_DEV, JOB_DEV, { now: NOW })
    const record = toAtsRecord(ats)

    expect(record.atsScoreAfter).toBe(ats.overall)
    expect(record.atsScoreBefore).toBeNull()
    expect(record.improvements).toEqual(ats.recommendations)
    expect(record.keywords).toBe(ats)
  })

  it("relit exactement ce qui a été enregistré (aller-retour JSON)", () => {
    const ats = analyzeCv(CV_DEV, JOB_DEV, { now: NOW })
    const stored = JSON.parse(JSON.stringify(toAtsRecord(ats).keywords))

    expect(readStoredAts(stored)).toEqual(ats)
  })

  it("ligne antérieure au moteur ou invalide : null, rien d'inventé", () => {
    expect(readStoredAts(null)).toBeNull()
    expect(readStoredAts([])).toBeNull()
    expect(readStoredAts({ score: 40 })).toBeNull()
    expect(readStoredAts({ overall: "80", dimensions: {}, mode: "job_match" })).toBeNull()
    expect(readStoredAts({ overall: 80, dimensions: {}, mode: "autre" })).toBeNull()
  })
})
