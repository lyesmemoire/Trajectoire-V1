import { describe, it, expect, vi, beforeEach } from "vitest"
import { NextRequest, NextResponse } from "next/server"

const mocks = vi.hoisted(() => ({
  getUser: vi.fn(),
  requireFullCvAnalysis: vi.fn(),
  idempotencyExecute: vi.fn(),
  cvAnalysisCreate: vi.fn(),
}))

vi.mock("@/lib/supabase/server", () => ({
  createClient: async () => ({ auth: { getUser: mocks.getUser } }),
}))
vi.mock("@/lib/quota/plan-access", () => ({
  requireFullCvAnalysis: mocks.requireFullCvAnalysis,
}))

// Enveloppes de protection neutralisées : on teste la logique de la route.
vi.mock("@/lib/security/csrf-middleware", () => ({ csrfProtect: (handler: unknown) => handler }))
vi.mock("@/lib/rate-limiting/rate-limit.middleware", () => ({
  rateLimit: (_type: unknown, handler: unknown) => handler,
}))
vi.mock("@/lib/rate-limiting/centralized-rate-limit.service", () => ({
  RouteType: { UPLOAD: "upload" },
  RateLimitScope: { USER: "user", IP: "ip" },
}))

vi.mock("@/lib/prisma", () => ({
  prisma: { cVAnalysis: { create: mocks.cvAnalysisCreate }, $transaction: vi.fn() },
}))
vi.mock("@/lib/logger", () => ({ logger: { error: vi.fn(), info: vi.fn(), warn: vi.fn() } }))
vi.mock("@/lib/ai/ai-models", () => ({
  getReasoningAIModel: vi.fn(),
  isRemoteAIAvailable: () => false,
}))
vi.mock("@/application/services/CVHIIOSBridge", () => ({ CVHIIOSBridge: {} }))
vi.mock("@/lib/db/billing.service", () => ({ BillingService: {} }))
vi.mock("@/core/idempotency/IdempotencyService", () => ({
  IdempotencyService: class {
    execute = mocks.idempotencyExecute
  },
}))
vi.mock("ai", () => ({ generateText: vi.fn() }))

import { POST } from "./route"

function request(body: unknown) {
  return new NextRequest("http://localhost/api/cv/analyze", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  })
}

const CV = "Jean Dupont — Développeur — 5 ans d'expérience en TypeScript et React. ".repeat(3)

describe("POST /api/cv/analyze — réservé au Pack Entretien et à Pro", () => {
  beforeEach(() => {
    vi.resetAllMocks()
    mocks.getUser.mockResolvedValue({ data: { user: { id: "u1" } }, error: null })
    mocks.requireFullCvAnalysis.mockResolvedValue(null)
  })

  it("non authentifié : 401, sans vérifier le plan", async () => {
    mocks.getUser.mockResolvedValue({ data: { user: null }, error: new Error("no") })

    const res = await POST(request({ extractedText: CV }))

    expect(res.status).toBe(401)
    expect(mocks.requireFullCvAnalysis).not.toHaveBeenCalled()
  })

  it("plan gratuit : 403, aucune idempotence, aucune écriture, aucune analyse", async () => {
    mocks.requireFullCvAnalysis.mockResolvedValue(
      NextResponse.json({ error: "PLAN_REQUIRED" }, { status: 403 }),
    )

    const res = await POST(request({ extractedText: CV }))

    expect(res.status).toBe(403)
    expect(mocks.requireFullCvAnalysis).toHaveBeenCalledWith("u1")
    expect(mocks.idempotencyExecute).not.toHaveBeenCalled()
    expect(mocks.cvAnalysisCreate).not.toHaveBeenCalled()
  })

  it("plan autorisé : l'analyse est lancée (idempotence appelée)", async () => {
    mocks.idempotencyExecute.mockResolvedValue({
      analysisId: "a1",
      structured: { personal: {} },
      hiiosContext: { sessionId: null },
    })

    const res = await POST(request({ extractedText: CV, fileName: "cv.pdf" }))

    expect(res.status).toBe(200)
    expect(mocks.idempotencyExecute).toHaveBeenCalledTimes(1)
    expect(await res.json()).toMatchObject({ success: true, analysisId: "a1" })
  })

  it("plan autorisé mais texte trop court : 400, sans idempotence", async () => {
    const res = await POST(request({ extractedText: "court" }))

    expect(res.status).toBe(400)
    expect(mocks.idempotencyExecute).not.toHaveBeenCalled()
  })
})
