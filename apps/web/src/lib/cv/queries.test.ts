import { describe, it, expect, vi, beforeEach } from "vitest"

const mocks = vi.hoisted(() => ({ findMany: vi.fn(), findFirst: vi.fn() }))
vi.mock("@/lib/prisma", () => ({
  prisma: { cVAnalysis: { findMany: mocks.findMany, findFirst: mocks.findFirst } },
}))

import { getCVAnalyses, getCVAnalysis } from "./queries"
import { analyzeCv } from "@/lib/cv-analysis"
import { toAtsRecord } from "@/lib/cv-analysis/persistence"
import { CV_DEV, JOB_DEV } from "@/lib/cv-analysis/fixtures"

describe("lecture des analyses de CV", () => {
  beforeEach(() => vi.resetAllMocks())

  it("liste : filtrée par utilisateur, sans jamais sélectionner le texte du CV", async () => {
    mocks.findMany.mockResolvedValue([])
    await getCVAnalyses("u1")

    const args = mocks.findMany.mock.calls[0][0]
    expect(args.where).toEqual({ userId: "u1" })
    expect(args.select.originalText).toBeUndefined()
    expect(args.select.optimizedText).toBeUndefined()
    expect(args.select.cvData).toBeUndefined()
  })

  it("détail : filtré par id ET utilisateur ; null si absent", async () => {
    mocks.findFirst.mockResolvedValue(null)
    expect(await getCVAnalysis("a1", "u1")).toBeNull()
    expect(mocks.findFirst.mock.calls[0][0].where).toEqual({ id: "a1", userId: "u1" })
  })

  it("détail : relit le résultat complet et les recommandations enregistrés", async () => {
    const ats = analyzeCv(CV_DEV, JOB_DEV, { now: new Date("2026-10-01T00:00:00Z") })
    const record = toAtsRecord(ats)
    mocks.findFirst.mockResolvedValue({
      id: "a1",
      fileName: "cv.pdf",
      createdAt: new Date(),
      atsScoreBefore: null,
      atsScoreAfter: record.atsScoreAfter,
      improvements: JSON.parse(JSON.stringify(record.improvements)),
      keywords: JSON.parse(JSON.stringify(record.keywords)),
    })

    const detail = await getCVAnalysis("a1", "u1")
    expect(detail?.ats?.overall).toBe(ats.overall)
    expect(detail?.improvements).toEqual(ats.recommendations)
  })

  it("détail : ligne antérieure au moteur → ats null, recommandations d'une autre forme ignorées", async () => {
    mocks.findFirst.mockResolvedValue({
      id: "a2",
      fileName: "",
      createdAt: new Date(),
      atsScoreBefore: null,
      atsScoreAfter: 55,
      improvements: [{ title: "x" }, "", "ok"],
      keywords: { anciennes: "donnees" },
    })

    const detail = await getCVAnalysis("a2", "u1")
    expect(detail?.ats).toBeNull()
    expect(detail?.improvements).toEqual(["ok"])
    expect(detail?.atsScoreAfter).toBe(55)
  })
})
