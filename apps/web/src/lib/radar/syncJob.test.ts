import { describe, it, expect, vi, beforeEach } from "vitest"

const m = vi.hoisted(() => ({
  runCreate: vi.fn(),
  runUpdate: vi.fn(),
  searchFindMany: vi.fn(),
  refresh: vi.fn(),
  run: vi.fn(),
  cv: vi.fn(),
}))

vi.mock("@/lib/prisma", () => ({
  prisma: {
    radarSyncRun: { create: m.runCreate, update: m.runUpdate },
    radarSearch: { findMany: m.searchFindMany },
  },
}))
vi.mock("@/lib/logger", () => ({ logger: { warn: vi.fn(), error: vi.fn(), info: vi.fn() } }))
vi.mock("./sync", () => ({ refreshOfferStatuses: m.refresh, runRadarSearch: m.run, getLatestCvText: m.cv }))
vi.mock("./sources", () => ({ getConfiguredSources: () => [] }))

import { MAX_SEARCHES_PER_JOB, SEARCH_REFRESH_HOURS, radarSyncJob } from "./syncJob"
import type { OfferSource } from "./types"

const source: OfferSource = { id: "FRANCE_TRAVAIL", search: async () => [] }
const searchRow = (id: string, userId: string) => ({
  id, userId, keywords: "dev", romeCodes: [], departments: [], latitude: null, longitude: null, radiusKm: null, contractTypes: [], sources: ["FRANCE_TRAVAIL"],
})

beforeEach(() => {
  vi.resetAllMocks()
  m.runCreate.mockResolvedValue({ id: "run1" })
  m.runUpdate.mockResolvedValue({})
  m.refresh.mockResolvedValue({ stale: 1, closed: 2, purged: 3 })
  m.cv.mockResolvedValue("cv")
})

describe("radarSyncJob", () => {
  it("sans source configurée : seul le vieillissement du catalogue est effectué, journal « NONE »", async () => {
    const res = await radarSyncJob({ now: new Date("2026-10-10T04:30:00Z") })
    expect(res).toMatchObject({ success: true, sources: 0, searchesRun: 0, statuses: { stale: 1, closed: 2, purged: 3 } })
    expect(m.searchFindMany).not.toHaveBeenCalled()
    expect(m.runCreate.mock.calls[0][0].data.source).toBe("NONE")
    expect(m.runUpdate.mock.calls[0][0].data.status).toBe("OK")
  })

  it("avec des sources : relance les recherches actives échues, plus anciennes d'abord, plafonnées", async () => {
    m.searchFindMany.mockResolvedValue([searchRow("s1", "u1"), searchRow("s2", "u1")])
    m.run.mockResolvedValue({ searchId: "x", fetched: 3, upserted: 3, matched: 3, failedSources: [] })
    const now = new Date("2026-10-10T04:30:00Z")
    const res = await radarSyncJob({ now, sources: [source] })
    const args = m.searchFindMany.mock.calls[0][0]
    expect(args.where.enabled).toBe(true)
    expect(args.where.OR[1].lastRunAt.lt.getTime()).toBe(now.getTime() - SEARCH_REFRESH_HOURS * 3_600_000)
    expect(args.take).toBe(MAX_SEARCHES_PER_JOB)
    expect(res).toMatchObject({ searchesRun: 2, offersUpserted: 6, searchesFailed: 0 })
    expect(m.cv).toHaveBeenCalledTimes(1) // CV lu une seule fois par utilisateur
  })

  it("une recherche en échec n'arrête pas les autres : journal « PARTIAL »", async () => {
    m.searchFindMany.mockResolvedValue([searchRow("s1", "u1"), searchRow("s2", "u2")])
    m.run.mockRejectedValueOnce(new Error("boom")).mockResolvedValueOnce({ searchId: "s2", fetched: 1, upserted: 1, matched: 1, failedSources: [] })
    const res = await radarSyncJob({ sources: [source] })
    expect(res).toMatchObject({ success: true, searchesRun: 1, searchesFailed: 1 })
    expect(m.runUpdate.mock.calls[0][0].data.status).toBe("PARTIAL")
  })

  it("échec du vieillissement : journal « FAILED », résultat en échec", async () => {
    m.refresh.mockRejectedValue(new Error("db down"))
    const res = await radarSyncJob({ sources: [source] })
    expect(res.success).toBe(false)
    expect(m.runUpdate.mock.calls[0][0].data).toMatchObject({ status: "FAILED", error: "db down" })
  })
})
