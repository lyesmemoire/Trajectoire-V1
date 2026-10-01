import { describe, it, expect, vi, beforeEach } from "vitest"
import { NextRequest } from "next/server"

const m = vi.hoisted(() => ({
  getUser: vi.fn(),
  searchCount: vi.fn(),
  searchCreate: vi.fn(),
  searchFindFirst: vi.fn(),
  searchUpdateMany: vi.fn(),
  searchDeleteMany: vi.fn(),
  matchFindMany: vi.fn(),
  matchUpdateMany: vi.fn(),
  txMatchFindFirst: vi.fn(),
  txMatchUpdate: vi.fn(),
  txOppCreate: vi.fn(),
  sources: vi.fn(),
  run: vi.fn(),
  cv: vi.fn(),
}))

vi.mock("@/lib/auth/verified-user", () => ({ getVerifiedUserWithRetry: m.getUser }))
vi.mock("@/lib/logger", () => ({ logger: { warn: vi.fn(), error: vi.fn(), info: vi.fn() } }))
vi.mock("@/lib/rate-limiting/rate-limit.middleware", () => ({ rateLimit: (_t: unknown, h: unknown) => h }))
vi.mock("@/lib/rate-limiting/centralized-rate-limit.service", () => ({ RouteType: { AI: "ai" }, RateLimitScope: { USER: "user" } }))
vi.mock("@/lib/radar/sources", () => ({ getConfiguredSources: m.sources }))
vi.mock("@/lib/radar/sync", () => ({ runRadarSearch: m.run, getLatestCvText: m.cv }))
vi.mock("@/lib/prisma", () => ({
  prisma: {
    radarSearch: {
      findMany: vi.fn().mockResolvedValue([]),
      count: m.searchCount,
      create: m.searchCreate,
      findFirst: m.searchFindFirst,
      updateMany: m.searchUpdateMany,
      deleteMany: m.searchDeleteMany,
    },
    radarMatch: { findMany: m.matchFindMany, updateMany: m.matchUpdateMany },
    $transaction: async (fn: (tx: unknown) => unknown) =>
      fn({
        radarMatch: { findFirst: m.txMatchFindFirst, update: m.txMatchUpdate },
        opportunity: { create: m.txOppCreate },
      }),
  },
}))

import { POST as searchesPOST } from "./searches/route"
import { PATCH as searchPATCH, DELETE as searchDELETE } from "./searches/[id]/route"
import { POST as runPOST } from "./searches/[id]/run/route"
import { GET as matchesGET } from "./matches/route"
import { PATCH as matchPATCH } from "./matches/[id]/route"
import { POST as trackPOST } from "./matches/[id]/track/route"

const req = (url: string, method: string, body?: unknown) =>
  new NextRequest(`http://localhost${url}`, {
    method,
    headers: { "content-type": "application/json" },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  })
const ctx = (id = "x1") => ({ params: Promise.resolve({ id }) })
const VALID = { name: "Dev Paris", keywords: "développeur typescript" }

beforeEach(() => {
  vi.resetAllMocks()
  m.getUser.mockResolvedValue({ user: { id: "u1" } })
})

describe("authentification", () => {
  it("toutes les routes refusent un visiteur non connecté (401)", async () => {
    m.getUser.mockResolvedValue({ user: null })
    const answers = await Promise.all([
      searchesPOST(req("/api/radar/searches", "POST", VALID)),
      searchPATCH(req("/x", "PATCH", { enabled: false }), ctx()),
      searchDELETE(req("/x", "DELETE"), ctx()),
      runPOST(req("/x", "POST"), ctx()),
      matchesGET(req("/api/radar/matches", "GET")),
      matchPATCH(req("/x", "PATCH", { state: "SAVED" }), ctx()),
      trackPOST(req("/x", "POST"), ctx()),
    ])
    expect(answers.map(a => a.status)).toEqual(Array(7).fill(401))
  })
})

describe("POST /api/radar/searches", () => {
  it("crée une recherche pour l'utilisateur de la session, jamais pour un id fourni par le client", async () => {
    m.searchCount.mockResolvedValue(0)
    m.searchCreate.mockResolvedValue({ id: "s1" })
    expect((await searchesPOST(req("/api/radar/searches", "POST", { ...VALID, userId: "autre" }))).status).toBe(400)
    const res = await searchesPOST(req("/api/radar/searches", "POST", VALID))
    expect(res.status).toBe(201)
    expect(m.searchCreate.mock.calls[0][0].data.userId).toBe("u1")
  })

  it("refuse au-delà du plafond (409) et les données invalides (400)", async () => {
    m.searchCount.mockResolvedValue(5)
    expect((await searchesPOST(req("/api/radar/searches", "POST", VALID))).status).toBe(409)
    expect(m.searchCreate).not.toHaveBeenCalled()
    expect((await searchesPOST(req("/api/radar/searches", "POST", { name: "", keywords: "x" }))).status).toBe(400)
  })
})

describe("PATCH / DELETE /api/radar/searches/[id]", () => {
  it("filtré sur l'utilisateur : la recherche d'autrui répond 404", async () => {
    m.searchUpdateMany.mockResolvedValue({ count: 0 })
    m.searchDeleteMany.mockResolvedValue({ count: 0 })
    expect((await searchPATCH(req("/x", "PATCH", { enabled: false }), ctx("s9"))).status).toBe(404)
    expect((await searchDELETE(req("/x", "DELETE"), ctx("s9"))).status).toBe(404)
    expect(m.searchUpdateMany.mock.calls[0][0].where).toEqual({ id: "s9", userId: "u1" })
    expect(m.searchDeleteMany.mock.calls[0][0].where).toEqual({ id: "s9", userId: "u1" })
  })

  it("refuse une modification vide ou avec un champ inconnu", async () => {
    expect((await searchPATCH(req("/x", "PATCH", {}), ctx())).status).toBe(400)
    expect((await searchPATCH(req("/x", "PATCH", { userId: "x" }), ctx())).status).toBe(400)
  })
})

describe("POST /api/radar/searches/[id]/run", () => {
  const search = { id: "s1", userId: "u1", keywords: "dev", romeCodes: [], departments: [], latitude: null, longitude: null, radiusKm: null, contractTypes: [], sources: ["FRANCE_TRAVAIL"], lastRunAt: null }

  it("recherche d'autrui : 404 ; aucune source configurée : 503 sans exécution", async () => {
    m.searchFindFirst.mockResolvedValueOnce(null)
    expect((await runPOST(req("/x", "POST"), ctx())).status).toBe(404)
    m.searchFindFirst.mockResolvedValue(search)
    m.sources.mockReturnValue([])
    const res = await runPOST(req("/x", "POST"), ctx())
    expect(res.status).toBe(503)
    expect((await res.json()).error).toBe("SOURCES_NOT_CONFIGURED")
    expect(m.run).not.toHaveBeenCalled()
  })

  it("exécutée il y a moins de 10 minutes : 429 ; sinon exécution avec le CV de l'utilisateur", async () => {
    m.sources.mockReturnValue([{ id: "FRANCE_TRAVAIL" }])
    m.searchFindFirst.mockResolvedValue({ ...search, lastRunAt: new Date(Date.now() - 60_000) })
    expect((await runPOST(req("/x", "POST"), ctx())).status).toBe(429)
    expect(m.run).not.toHaveBeenCalled()

    m.searchFindFirst.mockResolvedValue({ ...search, lastRunAt: new Date(Date.now() - 3_600_000) })
    m.cv.mockResolvedValue("texte du cv")
    m.run.mockResolvedValue({ searchId: "s1", fetched: 0, upserted: 0, matched: 0, failedSources: [] })
    expect((await runPOST(req("/x", "POST"), ctx())).status).toBe(200)
    expect(m.cv).toHaveBeenCalledWith("u1")
    expect(m.run.mock.calls[0][0].search.userId).toBe("u1")
  })
})

describe("GET /api/radar/matches", () => {
  it("filtre sur l'utilisateur, exclut les offres écartées par défaut, pagine par curseur", async () => {
    const offer = { description: "d".repeat(1000), publishedAt: null, lastSeenAt: new Date() }
    const row = (id: string) => ({ id, score: 50, scoreDetails: null, state: "NEW", matchedAt: new Date(), opportunityId: null, offer })
    m.matchFindMany.mockResolvedValue([row("a"), row("b"), row("c")])
    const res = await matchesGET(req("/api/radar/matches?limit=2", "GET"))
    const body = await res.json()
    expect(body.matches).toHaveLength(2)
    expect(body.nextCursor).toBe("b")
    expect(body.matches[0].offer.description.length).toBe(600)
    const args = m.matchFindMany.mock.calls[0][0]
    expect(args.where).toEqual({ userId: "u1", state: { not: "DISMISSED" } })
    expect(args.orderBy[0]).toEqual({ score: { sort: "desc", nulls: "last" } })
  })

  it("état explicite, paramètres invalides refusés", async () => {
    m.matchFindMany.mockResolvedValue([])
    await matchesGET(req("/api/radar/matches?state=SAVED", "GET"))
    expect(m.matchFindMany.mock.calls[0][0].where).toEqual({ userId: "u1", state: "SAVED" })
    expect((await matchesGET(req("/api/radar/matches?state=ALL", "GET"))).status).toBe(400)
    expect((await matchesGET(req("/api/radar/matches?limit=9999", "GET"))).status).toBe(400)
  })
})

describe("PATCH /api/radar/matches/[id]", () => {
  it("change l'état de sa propre correspondance ; celle d'autrui répond 404 ; « NEW » refusé", async () => {
    m.matchUpdateMany.mockResolvedValueOnce({ count: 1 }).mockResolvedValueOnce({ count: 0 })
    expect((await matchPATCH(req("/x", "PATCH", { state: "DISMISSED" }), ctx("m1"))).status).toBe(200)
    expect(m.matchUpdateMany.mock.calls[0][0].where).toEqual({ id: "m1", userId: "u1" })
    expect((await matchPATCH(req("/x", "PATCH", { state: "SAVED" }), ctx("m2"))).status).toBe(404)
    expect((await matchPATCH(req("/x", "PATCH", { state: "NEW" }), ctx("m1"))).status).toBe(400)
  })
})

describe("POST /api/radar/matches/[id]/track", () => {
  const offer = { title: "Dev", company: "Acme", locationLabel: "Paris", contractType: "ALTERNANCE", sourceUrl: "https://example.test/1", source: "FRANCE_TRAVAIL", description: "desc" }

  it("crée l'opportunité, lie la correspondance et la marque enregistrée", async () => {
    m.txMatchFindFirst.mockResolvedValue({ opportunityId: null, offer })
    m.txOppCreate.mockResolvedValue({ id: "o1" })
    const res = await trackPOST(req("/x", "POST"), ctx("m1"))
    expect(res.status).toBe(201)
    expect(m.txMatchFindFirst.mock.calls[0][0].where).toEqual({ id: "m1", userId: "u1" })
    expect(m.txOppCreate.mock.calls[0][0].data).toMatchObject({ userId: "u1", title: "Dev", source: "radar:FRANCE_TRAVAIL", metadata: { contractType: "ALTERNANCE" } })
    expect(m.txMatchUpdate.mock.calls[0][0].data).toEqual({ opportunityId: "o1", state: "SAVED" })
  })

  it("idempotent : déjà suivie, renvoie l'opportunité existante sans en créer une autre", async () => {
    m.txMatchFindFirst.mockResolvedValue({ opportunityId: "o9", offer })
    const res = await trackPOST(req("/x", "POST"), ctx("m1"))
    expect(res.status).toBe(200)
    expect((await res.json()).opportunityId).toBe("o9")
    expect(m.txOppCreate).not.toHaveBeenCalled()
  })

  it("correspondance d'un autre utilisateur : 404", async () => {
    m.txMatchFindFirst.mockResolvedValue(null)
    expect((await trackPOST(req("/x", "POST"), ctx("m1"))).status).toBe(404)
    expect(m.txOppCreate).not.toHaveBeenCalled()
  })
})
