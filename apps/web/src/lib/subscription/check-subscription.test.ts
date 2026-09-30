import { describe, it, expect, vi, beforeEach } from "vitest"

const mocks = vi.hoisted(() => ({ findUnique: vi.fn() }))

vi.mock("@/lib/prisma", () => ({
  prisma: { user: { findUnique: mocks.findUnique } },
}))

import { checkUserSubscription } from "./check-subscription"

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

describe("checkUserSubscription (aligné sur le plan effectif)", () => {
  beforeEach(() => vi.resetAllMocks())

  it("FREE : pas d'accès", async () => {
    mocks.findUnique.mockResolvedValue(row())
    expect(await checkUserSubscription("u1")).toEqual({ hasAccess: false, status: "none", plan: "FREE" })
  })

  it("PACK actif : accès (mêmes droits que PRO)", async () => {
    mocks.findUnique.mockResolvedValue(row({ plan: "PACK", packExpiresAt: inDays(30) }))
    expect(await checkUserSubscription("u1")).toMatchObject({ hasAccess: true, plan: "PACK" })
  })

  it("PACK expiré : plus d'accès", async () => {
    mocks.findUnique.mockResolvedValue(row({ plan: "PACK", packExpiresAt: inDays(-1) }))
    expect(await checkUserSubscription("u1")).toMatchObject({ hasAccess: false, plan: "FREE" })
  })

  it("Pack acheté après un ancien abonnement annulé : accès conservé", async () => {
    mocks.findUnique.mockResolvedValue(
      row({
        plan: "PACK",
        packExpiresAt: inDays(30),
        Subscription: { status: "canceled", currentPeriodEnd: inDays(-40) },
      }),
    )
    expect(await checkUserSubscription("u1")).toMatchObject({ hasAccess: true, plan: "PACK" })
  })

  it("PRO actif ou en retard de paiement (grâce) : accès ; annulé : pas d'accès", async () => {
    mocks.findUnique.mockResolvedValue(
      row({ plan: "PRO", Subscription: { status: "active", currentPeriodEnd: inDays(20) } }),
    )
    expect(await checkUserSubscription("u1")).toMatchObject({ hasAccess: true, status: "active", plan: "PRO" })

    mocks.findUnique.mockResolvedValue(
      row({ plan: "PRO", Subscription: { status: "past_due", currentPeriodEnd: inDays(-1) } }),
    )
    expect(await checkUserSubscription("u1")).toMatchObject({ hasAccess: true, status: "past_due", plan: "PRO" })

    mocks.findUnique.mockResolvedValue(
      row({ plan: "PRO", Subscription: { status: "canceled", currentPeriodEnd: inDays(-1) } }),
    )
    expect(await checkUserSubscription("u1")).toMatchObject({ hasAccess: false, status: "canceled" })
  })

  it("administrateur : accès", async () => {
    mocks.findUnique.mockResolvedValue(row({ role: "ADMIN_PRODUCT" }))
    expect(await checkUserSubscription("u1")).toEqual({ hasAccess: true, status: "active", plan: "admin" })
  })

  it("erreur base de données : accès refusé, sans exception", async () => {
    mocks.findUnique.mockRejectedValue(new Error("db"))
    expect(await checkUserSubscription("u1")).toEqual({ hasAccess: false, status: "none", plan: null })
  })
})
