import { describe, it, expect, vi, beforeEach } from "vitest"

const mocks = vi.hoisted(() => ({ findUnique: vi.fn() }))

vi.mock("@/lib/prisma", () => ({
  prisma: { user: { findUnique: mocks.findUnique } },
}))

import {
  hasFullCvAnalysis,
  isAdminRole,
  loadPlanAccess,
  requireFullCvAnalysis,
} from "./plan-access"

const DAY = 24 * 3600 * 1000
const inDays = (n: number) => new Date(Date.now() + n * DAY)

function row(over: Record<string, unknown> = {}) {
  return {
    plan: "FREE",
    role: "USER",
    simulationsUsed: 0,
    packExpiresAt: null,
    Subscription: null,
    ...over,
  }
}

describe("loadPlanAccess", () => {
  beforeEach(() => vi.resetAllMocks())

  it("FREE par défaut, et pour un utilisateur introuvable", async () => {
    mocks.findUnique.mockResolvedValue(null)
    const a = await loadPlanAccess("u1")
    expect(a.effective).toBe("FREE")
    expect(a.role).toBeNull()
  })

  it("PACK actif", async () => {
    mocks.findUnique.mockResolvedValue(row({ plan: "PACK", packExpiresAt: inDays(30) }))
    const a = await loadPlanAccess("u1")
    expect(a.effective).toBe("PACK")
    expect(a.expired).toBe(false)
  })

  it("PACK expiré → FREE", async () => {
    mocks.findUnique.mockResolvedValue(row({ plan: "PACK", packExpiresAt: inDays(-1) }))
    const a = await loadPlanAccess("u1")
    expect(a.effective).toBe("FREE")
    expect(a.expired).toBe(true)
  })

  it("PRO seulement avec un abonnement actif", async () => {
    mocks.findUnique.mockResolvedValue(
      row({ plan: "PRO", Subscription: { status: "active", currentPeriodEnd: inDays(20) } }),
    )
    expect((await loadPlanAccess("u1")).effective).toBe("PRO")

    mocks.findUnique.mockResolvedValue(
      row({ plan: "PRO", Subscription: { status: "past_due", currentPeriodEnd: inDays(-1) } }),
    )
    expect((await loadPlanAccess("u1")).effective).toBe("FREE")
  })
})

describe("hasFullCvAnalysis / requireFullCvAnalysis", () => {
  beforeEach(() => vi.resetAllMocks())

  it("FREE : refus 403 PLAN_REQUIRED avec renvoi vers les offres", async () => {
    mocks.findUnique.mockResolvedValue(row())

    expect(await hasFullCvAnalysis("u1")).toBe(false)
    const res = await requireFullCvAnalysis("u1")

    expect(res).not.toBeNull()
    expect(res!.status).toBe(403)
    expect(await res!.json()).toMatchObject({
      error: "PLAN_REQUIRED",
      requiredPlans: ["PACK", "PRO"],
      upgradeUrl: "/pricing",
    })
  })

  it("Pack expiré : message d'expiration", async () => {
    mocks.findUnique.mockResolvedValue(row({ plan: "PACK", packExpiresAt: inDays(-3) }))

    const res = await requireFullCvAnalysis("u1")

    expect(res!.status).toBe(403)
    expect((await res!.json()).message).toMatch(/expiré/)
  })

  it("PACK actif : autorisé", async () => {
    mocks.findUnique.mockResolvedValue(row({ plan: "PACK", packExpiresAt: inDays(30) }))
    expect(await hasFullCvAnalysis("u1")).toBe(true)
    expect(await requireFullCvAnalysis("u1")).toBeNull()
  })

  it("PRO actif : autorisé", async () => {
    mocks.findUnique.mockResolvedValue(
      row({ plan: "PRO", Subscription: { status: "active", currentPeriodEnd: inDays(20) } }),
    )
    expect(await requireFullCvAnalysis("u1")).toBeNull()
  })

  it("administrateur : autorisé même en FREE", async () => {
    mocks.findUnique.mockResolvedValue(row({ role: "ADMIN_SUPPORT" }))
    expect(await requireFullCvAnalysis("u1")).toBeNull()
  })
})

describe("isAdminRole", () => {
  it("reconnaît les rôles administrateur", () => {
    expect(isAdminRole("ADMIN_FOUNDER")).toBe(true)
    expect(isAdminRole("USER")).toBe(false)
    expect(isAdminRole(null)).toBe(false)
  })
})
