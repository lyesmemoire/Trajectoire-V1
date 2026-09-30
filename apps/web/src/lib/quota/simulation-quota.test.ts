import { describe, it, expect, vi, beforeEach } from "vitest"

const mocks = vi.hoisted(() => ({
  findUnique: vi.fn(),
  updateMany: vi.fn(),
}))

vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: { findUnique: mocks.findUnique, updateMany: mocks.updateMany },
  },
}))

import {
  checkSimulationQuota,
  consumeSimulation,
  releaseSimulation,
} from "./simulation-quota"

const DAY = 24 * 3600 * 1000
const inDays = (n: number) => new Date(Date.now() + n * DAY)

function userRow(over: Record<string, unknown> = {}) {
  return {
    plan: "FREE",
    simulationsUsed: 0,
    packExpiresAt: null,
    Subscription: null,
    ...over,
  }
}

describe("checkSimulationQuota", () => {
  beforeEach(() => vi.resetAllMocks())

  it("FREE : aucune simulation", async () => {
    mocks.findUnique.mockResolvedValue(userRow())
    const q = await checkSimulationQuota("u1")
    expect(q.plan).toBe("FREE")
    expect(q.limit).toBe(0)
    expect(q.remaining).toBe(0)
    expect(q.allowed).toBe(false)
  })

  it("utilisateur introuvable : traité comme FREE, refusé", async () => {
    mocks.findUnique.mockResolvedValue(null)
    const q = await checkSimulationQuota("u1")
    expect(q.plan).toBe("FREE")
    expect(q.allowed).toBe(false)
  })

  it("PACK actif : 5 simulations moins celles déjà utilisées", async () => {
    mocks.findUnique.mockResolvedValue(
      userRow({ plan: "PACK", simulationsUsed: 3, packExpiresAt: inDays(30) }),
    )
    const q = await checkSimulationQuota("u1")
    expect(q.plan).toBe("PACK")
    expect(q.limit).toBe(5)
    expect(q.used).toBe(3)
    expect(q.remaining).toBe(2)
    expect(q.allowed).toBe(true)
    expect(q.expired).toBe(false)
  })

  it("PACK épuisé : refusé", async () => {
    mocks.findUnique.mockResolvedValue(
      userRow({ plan: "PACK", simulationsUsed: 5, packExpiresAt: inDays(30) }),
    )
    const q = await checkSimulationQuota("u1")
    expect(q.remaining).toBe(0)
    expect(q.allowed).toBe(false)
  })

  it("PACK expiré : retombe sur FREE, refusé, expired = true", async () => {
    mocks.findUnique.mockResolvedValue(
      userRow({ plan: "PACK", simulationsUsed: 1, packExpiresAt: inDays(-1) }),
    )
    const q = await checkSimulationQuota("u1")
    expect(q.plan).toBe("FREE")
    expect(q.allowed).toBe(false)
    expect(q.expired).toBe(true)
  })

  it("PRO avec abonnement actif : illimité", async () => {
    mocks.findUnique.mockResolvedValue(
      userRow({
        plan: "PRO",
        Subscription: { status: "active", currentPeriodEnd: inDays(20) },
      }),
    )
    const q = await checkSimulationQuota("u1")
    expect(q.plan).toBe("PRO")
    expect(q.isUnlimited).toBe(true)
    expect(q.limit).toBeNull()
    expect(q.remaining).toBeNull()
    expect(q.allowed).toBe(true)
  })

  it("PRO en retard de paiement (past_due) : droits maintenus, signalé", async () => {
    mocks.findUnique.mockResolvedValue(
      userRow({
        plan: "PRO",
        Subscription: { status: "past_due", currentPeriodEnd: inDays(3) },
      }),
    )
    const q = await checkSimulationQuota("u1")
    expect(q.plan).toBe("PRO")
    expect(q.allowed).toBe(true)
    expect(q.paymentPastDue).toBe(true)
  })

  it("PRO dont l'abonnement est annulé ou impayé : plus de droits", async () => {
    for (const status of ["canceled", "unpaid"]) {
      mocks.findUnique.mockResolvedValue(
        userRow({
          plan: "PRO",
          Subscription: { status, currentPeriodEnd: inDays(-2) },
        }),
      )
      const q = await checkSimulationQuota("u1")
      expect(q.plan).toBe("FREE")
      expect(q.allowed).toBe(false)
      expect(q.paymentPastDue).toBe(false)
    }
  })
})

describe("consumeSimulation", () => {
  beforeEach(() => vi.resetAllMocks())

  it("refuse FREE sans toucher la base", async () => {
    mocks.findUnique.mockResolvedValue(userRow())
    const r = await consumeSimulation("u1")
    expect(r.ok).toBe(false)
    expect(mocks.updateMany).not.toHaveBeenCalled()
  })

  it("PRO : autorisé sans décompte", async () => {
    mocks.findUnique.mockResolvedValue(
      userRow({
        plan: "PRO",
        Subscription: { status: "active", currentPeriodEnd: inDays(20) },
      }),
    )
    const r = await consumeSimulation("u1")
    expect(r.ok).toBe(true)
    expect(mocks.updateMany).not.toHaveBeenCalled()
  })

  it("PACK : incrément atomique conditionné à la limite et à l'expiration", async () => {
    mocks.findUnique.mockResolvedValue(
      userRow({ plan: "PACK", simulationsUsed: 2, packExpiresAt: inDays(30) }),
    )
    mocks.updateMany.mockResolvedValue({ count: 1 })

    const r = await consumeSimulation("u1")

    expect(r.ok).toBe(true)
    expect(mocks.updateMany).toHaveBeenCalledWith({
      where: {
        id: "u1",
        plan: "PACK",
        simulationsUsed: { lt: 5 },
        OR: [{ packExpiresAt: null }, { packExpiresAt: { gt: expect.any(Date) } }],
      },
      data: { simulationsUsed: { increment: 1 } },
    })
  })

  it("PACK : course perdue (count = 0) → refus", async () => {
    mocks.findUnique
      .mockResolvedValueOnce(
        userRow({ plan: "PACK", simulationsUsed: 4, packExpiresAt: inDays(30) }),
      )
      .mockResolvedValueOnce(
        userRow({ plan: "PACK", simulationsUsed: 5, packExpiresAt: inDays(30) }),
      )
    mocks.updateMany.mockResolvedValue({ count: 0 })

    const r = await consumeSimulation("u1")

    expect(r.ok).toBe(false)
    expect(r.quota.remaining).toBe(0)
  })
})

describe("releaseSimulation", () => {
  beforeEach(() => vi.resetAllMocks())

  it("décrémente sans jamais passer sous zéro", async () => {
    mocks.updateMany.mockResolvedValue({ count: 1 })
    await releaseSimulation("u1")
    expect(mocks.updateMany).toHaveBeenCalledWith({
      where: { id: "u1", plan: "PACK", simulationsUsed: { gt: 0 } },
      data: { simulationsUsed: { decrement: 1 } },
    })
  })
})
