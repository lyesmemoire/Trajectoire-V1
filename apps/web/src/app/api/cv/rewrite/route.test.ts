import { describe, it, expect, vi, beforeEach } from "vitest"
import { NextRequest, NextResponse } from "next/server"

const mocks = vi.hoisted(() => ({
  getUser: vi.fn(),
  requireFullCvAnalysis: vi.fn(),
  rewriteSummary: vi.fn(),
  improveExperience: vi.fn(),
  generateImpactMetrics: vi.fn(),
  tailorCVForOpportunity: vi.fn(),
  cvRewriteCreate: vi.fn(),
  analysisFindFirst: vi.fn(),
  protection: { csrf: 0, rateLimitType: "" as string, rateLimitOptions: undefined as unknown },
}))

// Enveloppes de protection neutralisées, mais leur configuration est enregistrée.
vi.mock("@/lib/security/csrf-middleware", () => ({
  csrfProtect: (handler: unknown) => {
    mocks.protection.csrf += 1
    return handler
  },
}))
vi.mock("@/lib/rate-limiting/rate-limit.middleware", () => ({
  rateLimit: (type: string, handler: unknown, options: unknown) => {
    mocks.protection.rateLimitType = type
    mocks.protection.rateLimitOptions = options
    return handler
  },
}))
vi.mock("@/lib/rate-limiting/centralized-rate-limit.service", () => ({
  RouteType: { UPLOAD: "upload" },
  RateLimitScope: { USER: "user", IP: "ip" },
}))

vi.mock("@/lib/supabase/server", () => ({
  createClient: async () => ({ auth: { getUser: mocks.getUser } }),
}))
vi.mock("@/lib/quota/plan-access", () => ({
  requireFullCvAnalysis: mocks.requireFullCvAnalysis,
}))
vi.mock("@/lib/ai/cv-rewriter", () => ({
  rewriteSummary: mocks.rewriteSummary,
  improveExperience: mocks.improveExperience,
  generateImpactMetrics: mocks.generateImpactMetrics,
  tailorCVForOpportunity: mocks.tailorCVForOpportunity,
}))
vi.mock("@/lib/prisma", () => ({
  prisma: {
    cvRewrite: { create: mocks.cvRewriteCreate, findUnique: vi.fn() },
    cVAnalysis: { findFirst: mocks.analysisFindFirst },
  },
}))
vi.mock("@/lib/db/billing.service", () => ({ BillingService: {} }))
vi.mock("@/lib/logger", () => ({ logger: { error: vi.fn(), info: vi.fn(), warn: vi.fn() } }))
vi.mock("@/core/idempotency/IdempotencyService", () => ({
  IdempotencyService: class {
    async execute(_key: string, _user: string, _op: string, _payload: unknown, run: () => Promise<{ data: unknown }>) {
      return (await run()).data
    }
  },
}))

import { POST } from "./route"

function request(body: unknown) {
  return new NextRequest("http://localhost/api/cv/rewrite", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  })
}

describe("POST /api/cv/rewrite — protection", () => {
  it("est protégée par CSRF et par une limite de débit utilisateur + IP", () => {
    expect(mocks.protection.csrf).toBe(1)
    expect(mocks.protection.rateLimitType).toBe("upload")
    expect(mocks.protection.rateLimitOptions).toEqual({ scopes: ["user", "ip"] })
  })
})

describe("POST /api/cv/rewrite — réservé au Pack Entretien et à Pro", () => {
  beforeEach(() => {
    vi.resetAllMocks()
    mocks.getUser.mockResolvedValue({ data: { user: { id: "u1" } }, error: null })
    mocks.requireFullCvAnalysis.mockResolvedValue(null)
  })

  it("non authentifié : 401, sans même vérifier le plan", async () => {
    mocks.getUser.mockResolvedValue({ data: { user: null }, error: new Error("no") })

    const res = await POST(request({ action: "rewrite_summary", content: "x" }))

    expect(res.status).toBe(401)
    expect(mocks.requireFullCvAnalysis).not.toHaveBeenCalled()
  })

  it("plan gratuit : 403, aucun appel IA, rien d'écrit", async () => {
    mocks.requireFullCvAnalysis.mockResolvedValue(
      NextResponse.json({ error: "PLAN_REQUIRED" }, { status: 403 }),
    )

    const res = await POST(request({ action: "rewrite_summary", content: "Mon résumé" }))

    expect(res.status).toBe(403)
    expect(mocks.requireFullCvAnalysis).toHaveBeenCalledWith("u1")
    expect(mocks.rewriteSummary).not.toHaveBeenCalled()
    expect(mocks.cvRewriteCreate).not.toHaveBeenCalled()
  })

  it("plan autorisé : la réécriture est exécutée", async () => {
    mocks.rewriteSummary.mockResolvedValue("Résumé réécrit")

    const res = await POST(request({ action: "rewrite_summary", content: "Mon résumé" }))

    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ success: true, data: "Résumé réécrit" })
    expect(mocks.rewriteSummary).toHaveBeenCalledWith("Mon résumé")
  })

  describe("rattachement à une analyse", () => {
    beforeEach(() => {
      mocks.rewriteSummary.mockResolvedValue("Résumé réécrit")
    })

    it("analyse de l'utilisateur : l'identifiant est enregistré avec la réécriture", async () => {
      mocks.analysisFindFirst.mockResolvedValue({ id: "a1" })

      const res = await POST(request({ action: "rewrite_summary", content: "Mon résumé", analysisId: "a1" }))

      expect(res.status).toBe(200)
      expect(mocks.analysisFindFirst.mock.calls[0][0].where).toEqual({ id: "a1", userId: "u1" })
      expect(mocks.cvRewriteCreate.mock.calls[0][0].data.analysisId).toBe("a1")
    })

    it("analyse d'un autre utilisateur ou inexistante : 404, aucun appel IA, rien d'écrit", async () => {
      mocks.analysisFindFirst.mockResolvedValue(null)

      const res = await POST(request({ action: "rewrite_summary", content: "Mon résumé", analysisId: "autre" }))

      expect(res.status).toBe(404)
      expect(mocks.rewriteSummary).not.toHaveBeenCalled()
      expect(mocks.cvRewriteCreate).not.toHaveBeenCalled()
    })

    it("sans analyse : aucune vérification, analysisId null", async () => {
      const res = await POST(request({ action: "rewrite_summary", content: "Mon résumé" }))

      expect(res.status).toBe(200)
      expect(mocks.analysisFindFirst).not.toHaveBeenCalled()
      expect(mocks.cvRewriteCreate.mock.calls[0][0].data.analysisId).toBeNull()
    })
  })
})
