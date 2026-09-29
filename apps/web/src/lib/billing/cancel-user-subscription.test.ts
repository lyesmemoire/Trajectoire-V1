import { describe, it, expect, vi, beforeEach } from "vitest"

const mocks = vi.hoisted(() => ({
  findUnique: vi.fn(),
  cancel: vi.fn(),
  retrieve: vi.fn(),
  info: vi.fn(),
}))

vi.mock("@/lib/prisma", () => ({
  prisma: { subscription: { findUnique: mocks.findUnique } },
}))
vi.mock("@/lib/stripe", () => ({
  stripe: { subscriptions: { cancel: mocks.cancel, retrieve: mocks.retrieve } },
}))
vi.mock("@/lib/logger", () => ({ logger: { info: mocks.info } }))

import { cancelUserSubscription } from "./cancel-user-subscription"

describe("cancelUserSubscription", () => {
  beforeEach(() => vi.resetAllMocks())

  it("ne fait rien sans abonnement", async () => {
    mocks.findUnique.mockResolvedValue(null)
    expect(await cancelUserSubscription("u1")).toEqual({ cancelled: false })
    expect(mocks.cancel).not.toHaveBeenCalled()
  })

  it("ne fait rien si stripeSubId a été vidé (abonnement déjà terminé)", async () => {
    mocks.findUnique.mockResolvedValue({ stripeSubId: "" })
    expect(await cancelUserSubscription("u1")).toEqual({ cancelled: false })
    expect(mocks.cancel).not.toHaveBeenCalled()
  })

  it("annule l'abonnement Stripe", async () => {
    mocks.findUnique.mockResolvedValue({ stripeSubId: "sub_123" })
    mocks.cancel.mockResolvedValue({ id: "sub_123", status: "canceled" })
    expect(await cancelUserSubscription("u1")).toEqual({ cancelled: true })
    expect(mocks.cancel).toHaveBeenCalledWith("sub_123")
  })

  it("abonnement introuvable chez Stripe (resource_missing) : réglé", async () => {
    mocks.findUnique.mockResolvedValue({ stripeSubId: "sub_test_x" })
    mocks.cancel.mockRejectedValue(Object.assign(new Error("No such subscription"), { code: "resource_missing" }))
    expect(await cancelUserSubscription("u1")).toEqual({ cancelled: false })
  })

  it("déjà annulé côté Stripe : réglé", async () => {
    mocks.findUnique.mockResolvedValue({ stripeSubId: "sub_123" })
    mocks.cancel.mockRejectedValue(new Error("A canceled subscription can only update its cancellation_details."))
    mocks.retrieve.mockResolvedValue({ status: "canceled" })
    expect(await cancelUserSubscription("u1")).toEqual({ cancelled: false })
  })

  it("autre erreur Stripe : relancée, pour interrompre la suppression", async () => {
    mocks.findUnique.mockResolvedValue({ stripeSubId: "sub_123" })
    const failure = new Error("Stripe indisponible")
    mocks.cancel.mockRejectedValue(failure)
    mocks.retrieve.mockResolvedValue({ status: "active" })
    await expect(cancelUserSubscription("u1")).rejects.toBe(failure)
  })
})
