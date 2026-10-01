import { describe, it, expect, vi, beforeEach } from "vitest"

const db = vi.hoisted(() => ({
  upsert: vi.fn(),
  transaction: vi.fn(),
  matchFindMany: vi.fn(),
  matchCreateMany: vi.fn(),
  matchUpdate: vi.fn(),
  searchUpdate: vi.fn(),
  offerUpdateMany: vi.fn(),
  offerDeleteMany: vi.fn(),
  cvFindFirst: vi.fn(),
}))

vi.mock("@/lib/prisma", () => ({
  prisma: {
    marketOffer: { upsert: db.upsert, updateMany: db.offerUpdateMany, deleteMany: db.offerDeleteMany },
    radarMatch: { findMany: db.matchFindMany, createMany: db.matchCreateMany, update: db.matchUpdate },
    radarSearch: { update: db.searchUpdate },
    cVAnalysis: { findFirst: db.cvFindFirst },
    $transaction: db.transaction,
  },
}))
vi.mock("@/lib/logger", () => ({ logger: { warn: vi.fn(), error: vi.fn(), info: vi.fn() } }))

import { getLatestCvText, refreshOfferStatuses, runRadarSearch, type SearchRecord } from "./sync"
import type { NormalizedOffer, OfferSource } from "./types"

const CV =
  "Développeur full stack avec huit ans d'expérience. Maîtrise de TypeScript, React, Node.js et PostgreSQL. " +
  "Conception d'API REST, tests automatisés, intégration continue, revue de code et mentorat d'équipes. " +
  "Missions de migration vers le cloud et d'optimisation de requêtes pour des applications à fort trafic."

const offer = (over: Partial<NormalizedOffer> = {}): NormalizedOffer => ({
  source: "FRANCE_TRAVAIL",
  externalId: "A1",
  title: "Développeur TypeScript",
  company: "Acme",
  locationLabel: "Paris",
  department: "75",
  latitude: null,
  longitude: null,
  contractType: "CDI",
  romeCode: null,
  experience: null,
  salaryLabel: null,
  description: "Développeur TypeScript, React, PostgreSQL, API REST et tests automatisés.",
  sourceUrl: "https://example.test/A1",
  applyUrl: null,
  publishedAt: null,
  ...over,
})

const search: SearchRecord = {
  id: "s1",
  userId: "u1",
  criteria: {
    keywords: "développeur",
    romeCodes: [],
    departments: [],
    latitude: null,
    longitude: null,
    radiusKm: null,
    contractTypes: [],
    sources: ["FRANCE_TRAVAIL", "LA_BONNE_ALTERNANCE"],
  },
}

const source = (id: OfferSource["id"], impl: () => Promise<NormalizedOffer[]>): OfferSource => ({ id, search: impl })

beforeEach(() => {
  vi.resetAllMocks()
  // $transaction reçoit un tableau de promesses déjà créées : on les résout.
  db.transaction.mockImplementation(async (ops: unknown[]) => Promise.all(ops))
  db.upsert.mockImplementation(async (args: { create: { source: string; externalId: string } }) => ({
    id: `id-${args.create.externalId}`,
    source: args.create.source,
    externalId: args.create.externalId,
  }))
  db.matchFindMany.mockResolvedValue([])
  db.matchCreateMany.mockResolvedValue({ count: 0 })
  db.matchUpdate.mockResolvedValue({})
  db.searchUpdate.mockResolvedValue({})
})

describe("runRadarSearch", () => {
  it("enregistre les offres, crée les correspondances avec leur score et journalise l'exécution", async () => {
    const res = await runRadarSearch({
      search,
      cvText: CV,
      sources: [source("FRANCE_TRAVAIL", async () => [offer()])],
      now: new Date("2026-10-10T08:00:00Z"),
    })
    expect(res).toMatchObject({ fetched: 1, upserted: 1, matched: 1, failedSources: [] })
    expect(db.upsert).toHaveBeenCalledTimes(1)
    const created = db.matchCreateMany.mock.calls[0][0].data[0]
    expect(created).toMatchObject({ userId: "u1", offerId: "id-A1", searchId: "s1" })
    expect(created.score).toBeGreaterThan(0)
    expect(db.searchUpdate.mock.calls[0][0].data.lastRunError).toBeNull()
  })

  it("une source en panne n'arrête pas les autres : exécution partielle signalée", async () => {
    const res = await runRadarSearch({
      search,
      cvText: CV,
      sources: [
        source("FRANCE_TRAVAIL", async () => {
          throw new Error("401 jeton refusé")
        }),
        source("LA_BONNE_ALTERNANCE", async () => [offer({ source: "LA_BONNE_ALTERNANCE", externalId: "L1" })]),
      ],
    })
    expect(res.matched).toBe(1)
    expect(res.failedSources).toEqual([{ source: "FRANCE_TRAVAIL", message: "401 jeton refusé" }])
    expect(db.searchUpdate.mock.calls[0][0].data.lastRunError).toContain("FRANCE_TRAVAIL")
  })

  it("n'interroge que les sources choisies dans la recherche", async () => {
    const lba = vi.fn(async () => [offer({ source: "LA_BONNE_ALTERNANCE", externalId: "L1" })])
    await runRadarSearch({
      search: { ...search, criteria: { ...search.criteria, sources: ["FRANCE_TRAVAIL"] } },
      cvText: CV,
      sources: [source("FRANCE_TRAVAIL", async () => []), { id: "LA_BONNE_ALTERNANCE", search: lba }],
    })
    expect(lba).not.toHaveBeenCalled()
  })

  it("dédoublonne une même annonce vue par deux sources", async () => {
    const res = await runRadarSearch({
      search,
      cvText: CV,
      sources: [
        source("FRANCE_TRAVAIL", async () => [offer()]),
        source("LA_BONNE_ALTERNANCE", async () => [offer({ source: "LA_BONNE_ALTERNANCE", externalId: "L1" })]),
      ],
    })
    expect(res.fetched).toBe(2)
    expect(res.upserted).toBe(1)
  })

  it("correspondance existante : l'état n'est jamais touché, seul le score est mis à jour s'il change", async () => {
    db.matchFindMany.mockResolvedValue([{ id: "m1", offerId: "id-A1", score: 1 }])
    await runRadarSearch({ search, cvText: CV, sources: [source("FRANCE_TRAVAIL", async () => [offer()])] })
    expect(db.matchCreateMany).not.toHaveBeenCalled()
    const data = db.matchUpdate.mock.calls[0][0].data
    expect(Object.keys(data).sort()).toEqual(["score", "scoreDetails"])
  })

  it("sans CV : correspondance créée avec un score null, jamais une valeur inventée", async () => {
    await runRadarSearch({ search, cvText: null, sources: [source("FRANCE_TRAVAIL", async () => [offer()])] })
    const created = db.matchCreateMany.mock.calls[0][0].data[0]
    expect(created.score).toBeNull()
    expect(created.scoreDetails.reason).toBe("cv_missing")
  })

  it("aucune offre : rien n'est écrit sauf la date d'exécution", async () => {
    await runRadarSearch({ search, cvText: CV, sources: [source("FRANCE_TRAVAIL", async () => [])] })
    expect(db.upsert).not.toHaveBeenCalled()
    expect(db.matchCreateMany).not.toHaveBeenCalled()
    expect(db.searchUpdate).toHaveBeenCalledTimes(1)
  })
})

describe("refreshOfferStatuses", () => {
  const now = new Date("2026-10-20T00:00:00Z")

  it("ferme, périme et purge avec les bons seuils ; la purge épargne les offres suivies", async () => {
    db.offerUpdateMany.mockResolvedValueOnce({ count: 2 }).mockResolvedValueOnce({ count: 3 })
    db.offerDeleteMany.mockResolvedValue({ count: 1 })
    expect(await refreshOfferStatuses(now)).toEqual({ stale: 3, closed: 2, purged: 1 })

    const closedWhere = db.offerUpdateMany.mock.calls[0][0].where
    expect(closedWhere.lastSeenAt.lt.toISOString()).toBe("2026-10-13T00:00:00.000Z")
    const staleWhere = db.offerUpdateMany.mock.calls[1][0].where
    expect(staleWhere).toMatchObject({ status: "LIVE" })
    expect(staleWhere.lastSeenAt.lt.toISOString()).toBe("2026-10-17T00:00:00.000Z")
    const purgeWhere = db.offerDeleteMany.mock.calls[0][0].where
    expect(purgeWhere.matches).toEqual({ none: {} })
    expect(purgeWhere.closedAt.lt.toISOString()).toBe("2026-09-20T00:00:00.000Z")
  })
})

describe("getLatestCvText", () => {
  it("dernier CV de l'utilisateur, null sinon", async () => {
    db.cvFindFirst.mockResolvedValueOnce({ originalText: "mon cv" })
    expect(await getLatestCvText("u1")).toBe("mon cv")
    expect(db.cvFindFirst.mock.calls[0][0].where).toEqual({ userId: "u1" })
    db.cvFindFirst.mockResolvedValueOnce(null)
    expect(await getLatestCvText("u1")).toBeNull()
  })
})
