import { describe, it, expect, vi } from "vitest"
import { NextRequest } from "next/server"

const gate = vi.hoisted(() => ({ enabled: false }))

vi.mock("@/lib/billing/purchase-gate", () => ({
  get PURCHASE_ENABLED() {
    return gate.enabled
  },
  PURCHASE_DISABLED_MESSAGE: "L’achat des offres payantes n’est pas encore ouvert.",
  PURCHASE_SOON_LABEL: "Bientôt disponible",
}))

const getStrictUser = vi.hoisted(() => vi.fn())
const stripeCreate = vi.hoisted(() => vi.fn())

vi.mock("@/lib/auth/session-logic", () => ({ getStrictUser }))
vi.mock("@/lib/stripe", () => ({ stripe: { checkout: { sessions: { create: stripeCreate } } } }))
vi.mock("@/lib/prisma", () => ({ prisma: { user: { findUnique: vi.fn() } } }))
vi.mock("@/lib/rate-limit", () => ({ checkRateLimit: vi.fn(async () => ({ blocked: false, headers: {} })) }))
vi.mock("@/lib/logger", () => ({ logInfo: vi.fn(), logError: vi.fn() }))
vi.mock("@/lib/env.server", () => ({
  envServer: { STRIPE_SECRET_KEY: "sk_test_x", STRIPE_PRICE_INTERVIEW_PACK: "price_pack", STRIPE_PRO_PRICE_ID: "price_pro" },
}))

import { POST } from "./route"

const req = (plan: string) =>
  new NextRequest("http://localhost:3000/api/stripe/checkout", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ plan }),
  })

describe("POST /api/stripe/checkout : verrou d'achat", () => {
  it("renvoie 503 avec un message clair tant que l'achat est fermé, sans toucher à Stripe ni à la session", async () => {
    gate.enabled = false
    for (const plan of ["PACK", "PRO"]) {
      const res = await POST(req(plan))
      expect(res.status).toBe(503)
      const body = await res.json()
      expect(body.error).toMatch(/pas encore ouvert/)
    }
    expect(getStrictUser).not.toHaveBeenCalled()
    expect(stripeCreate).not.toHaveBeenCalled()
  })

  it("ne répond plus 503 pour ce motif quand l'achat est ouvert (la requête passe aux contrôles suivants)", async () => {
    gate.enabled = true
    getStrictUser.mockResolvedValue({ user: null })
    const res = await POST(req("PACK"))
    expect(res.status).toBe(401)
  })
})
