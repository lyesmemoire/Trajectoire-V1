import { describe, it, expect, vi, beforeEach } from "vitest"

const m = vi.hoisted(() => {
  const op = (name: string) => vi.fn((args: unknown) => ({ name, args }))
  return {
    transaction: vi.fn().mockResolvedValue([]),
    creditUsage: { deleteMany: op("creditUsage.deleteMany") },
    cvRewrite: { deleteMany: op("cvRewrite.deleteMany") },
    idempotency: { deleteMany: op("idempotency.deleteMany") },
    premiumInterviewSession: { deleteMany: op("premium.deleteMany") },
    simulationSession: { deleteMany: op("simulation.deleteMany") },
    stripeEvent: { updateMany: op("stripeEvent.updateMany") },
    previewAnalysis: { updateMany: op("preview.updateMany") },
    adminAuditLog: { deleteMany: op("adminAuditLog.deleteMany") },
    user: { deleteMany: op("user.deleteMany"), findUnique: vi.fn() },
  }
})
vi.mock("@/lib/prisma", () => ({ prisma: { ...m, $transaction: m.transaction } }))

import { getAccountDeletionBlocker, purgeUserData } from "./purge-user-data"

describe("purgeUserData", () => {
  beforeEach(() => m.transaction.mockClear())

  it("une seule transaction, toutes les requêtes filtrées par l'utilisateur, `users` en dernier", async () => {
    await purgeUserData("u1")

    expect(m.transaction).toHaveBeenCalledTimes(1)
    const ops = m.transaction.mock.calls[0][0] as Array<{ name: string; args: { where: Record<string, unknown> } }>
    expect(ops.at(-1)?.name).toBe("user.deleteMany")
    expect(ops.at(-1)?.args.where).toEqual({ id: "u1" })
    for (const o of ops.slice(0, -1)) {
      expect(Object.values(o.args.where)).toContain("u1")
    }
  })

  it("stripe_events et aperçus sont détachés de la personne, pas supprimés", async () => {
    await purgeUserData("u1")
    expect(m.stripeEvent.updateMany).toHaveBeenCalledWith({ where: { userId: "u1" }, data: { userId: null } })
    expect(m.previewAnalysis.updateMany).toHaveBeenCalledWith({
      where: { claimedByUserId: "u1" },
      data: { claimedByUserId: null },
    })
  })

  it("supprime le journal d'action de l'utilisateur avant le compte (clé étrangère RESTRICT)", async () => {
    await purgeUserData("u1")
    const names = (m.transaction.mock.calls[0][0] as Array<{ name: string }>).map(o => o.name)
    expect(names).toContain("adminAuditLog.deleteMany")
    expect(names.indexOf("adminAuditLog.deleteMany")).toBeLessThan(names.indexOf("user.deleteMany"))
    expect(m.adminAuditLog.deleteMany).toHaveBeenCalledWith({ where: { adminId: "u1" } })
  })

  it("propage l'échec de la transaction", async () => {
    m.transaction.mockRejectedValueOnce(new Error("RESTRICT"))
    await expect(purgeUserData("u1")).rejects.toThrow("RESTRICT")
  })
})

describe("getAccountDeletionBlocker", () => {
  it("compte ordinaire ou inexistant : aucun blocage", async () => {
    m.user.findUnique.mockResolvedValueOnce({ role: "USER" })
    expect(await getAccountDeletionBlocker("u1")).toBeNull()
    m.user.findUnique.mockResolvedValueOnce(null)
    expect(await getAccountDeletionBlocker("u2")).toBeNull()
  })

  it("compte administrateur : refus avec un message explicite", async () => {
    for (const role of ["ADMIN_SUPPORT", "ADMIN_PRODUCT", "ADMIN_FOUNDER"]) {
      m.user.findUnique.mockResolvedValueOnce({ role })
      expect(await getAccountDeletionBlocker("a1")).toMatch(/administration.*support/i)
    }
  })
})
