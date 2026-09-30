import { describe, it, expect, vi, beforeEach } from "vitest"
import { NextResponse } from "next/server"

const mocks = vi.hoisted(() => ({
  getUser: vi.fn(),
  requireFullCvAnalysis: vi.fn(),
  opportunityFindFirst: vi.fn(),
  cvFindFirst: vi.fn(),
  analyzeOpportunity: vi.fn(),
  protection: { type: "" as string, options: undefined as unknown },
}))

vi.mock("@/lib/rate-limiting/rate-limit.middleware", () => ({
  rateLimit: (type: string, handler: unknown, options: unknown) => {
    mocks.protection.type = type
    mocks.protection.options = options
    return handler
  },
}))
vi.mock("@/lib/rate-limiting/centralized-rate-limit.service", () => ({
  RouteType: { AI: "ai" },
  RateLimitScope: { USER: "user", IP: "ip" },
}))
vi.mock("@/lib/supabase/server", () => ({
  createClient: async () => ({ auth: { getUser: mocks.getUser } }),
}))
vi.mock("@/lib/quota/plan-access", () => ({
  requireFullCvAnalysis: mocks.requireFullCvAnalysis,
}))
vi.mock("@/lib/prisma", () => ({
  prisma: {
    opportunity: { findFirst: mocks.opportunityFindFirst, update: vi.fn() },
    cVAnalysis: { findFirst: mocks.cvFindFirst },
  },
}))
vi.mock("@/lib/opportunities/analyzeOpportunity", () => ({
  analyzeOpportunity: mocks.analyzeOpportunity,
}))

import { POST } from "./route"

const call = () =>
  (POST as unknown as (r: Request, c: { params: Promise<{ id: string }> }) => Promise<Response>)(
    new Request("http://localhost/api/opportunities/o1/analyze", { method: "POST" }),
    { params: Promise.resolve({ id: "o1" }) },
  )

describe("POST /api/opportunities/[id]/analyze — analyse par IA réservée aux offres payantes", () => {
  it("est protégée par une limite de débit d'IA, par utilisateur et par IP", () => {
    expect(mocks.protection.type).toBe("ai")
    expect(mocks.protection.options).toEqual({ scopes: ["user", "ip"] })
  })

  beforeEach(() => {
    vi.resetAllMocks()
    mocks.getUser.mockResolvedValue({ data: { user: { id: "u1" } } })
    mocks.requireFullCvAnalysis.mockResolvedValue(null)
  })

  it("non authentifié : 401, plan non vérifié, aucun appel IA", async () => {
    mocks.getUser.mockResolvedValue({ data: { user: null } })

    expect((await call()).status).toBe(401)
    expect(mocks.requireFullCvAnalysis).not.toHaveBeenCalled()
    expect(mocks.analyzeOpportunity).not.toHaveBeenCalled()
  })

  it("plan gratuit : 403 avant toute lecture de données et tout appel IA", async () => {
    mocks.requireFullCvAnalysis.mockResolvedValue(
      NextResponse.json({ error: "PLAN_REQUIRED" }, { status: 403 }),
    )

    const res = await call()

    expect(res.status).toBe(403)
    expect(mocks.requireFullCvAnalysis).toHaveBeenCalledWith("u1")
    expect(mocks.opportunityFindFirst).not.toHaveBeenCalled()
    expect(mocks.cvFindFirst).not.toHaveBeenCalled()
    expect(mocks.analyzeOpportunity).not.toHaveBeenCalled()
  })

  it("plan autorisé mais opportunité d'un autre utilisateur : 404, aucun appel IA", async () => {
    mocks.opportunityFindFirst.mockResolvedValue(null)

    const res = await call()

    expect(res.status).toBe(404)
    expect(mocks.opportunityFindFirst.mock.calls[0][0].where).toEqual({ id: "o1", userId: "u1" })
    expect(mocks.analyzeOpportunity).not.toHaveBeenCalled()
  })
})
