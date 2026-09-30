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
  prisma: { cvRewrite: { create: mocks.cvRewriteCreate, findUnique: vi.fn() } },
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
})
