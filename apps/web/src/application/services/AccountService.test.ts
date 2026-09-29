import { describe, it, expect, vi, beforeEach } from "vitest"

const mocks = vi.hoisted(() => ({
  cancelUserSubscription: vi.fn(),
  deleteUser: vi.fn(),
}))

vi.mock("@/lib/billing/cancel-user-subscription", () => ({
  cancelUserSubscription: mocks.cancelUserSubscription,
}))
vi.mock("@/lib/supabase/service", () => ({
  createAdminClient: () => ({ auth: { admin: { deleteUser: mocks.deleteUser } } }),
}))

import { AccountService } from "./AccountService"

function build() {
  const sessionRepository = {
    find: vi.fn().mockResolvedValue([{ id: "s1" }]),
    delete: vi.fn().mockResolvedValue(undefined),
  }
  const messageRepository = { deleteBySessionId: vi.fn().mockResolvedValue(undefined) }
  const reportRepository = {
    getBySessionId: vi.fn().mockResolvedValue(null),
    delete: vi.fn(),
  }
  const profileRepository = {
    getByUserId: vi.fn().mockResolvedValue(null),
    delete: vi.fn(),
  }
  const auditService = { log: vi.fn().mockResolvedValue(undefined) }
  const logger = { setUserContext: vi.fn(), info: vi.fn(), error: vi.fn() }

  const service = new AccountService(
    sessionRepository as any,
    reportRepository as any,
    messageRepository as any,
    profileRepository as any,
    auditService as any,
    logger as any,
  )
  return { service, sessionRepository, messageRepository, logger }
}

describe("AccountService.deleteAccount — abonnement Stripe", () => {
  beforeEach(() => {
    vi.resetAllMocks()
    mocks.deleteUser.mockResolvedValue({ error: null })
  })

  it("annule l'abonnement avant de supprimer données et compte", async () => {
    mocks.cancelUserSubscription.mockResolvedValue({ cancelled: true })
    const { service, messageRepository } = build()

    await service.deleteAccount({ userId: "u1" })

    expect(mocks.cancelUserSubscription).toHaveBeenCalledWith("u1")
    const cancelOrder = mocks.cancelUserSubscription.mock.invocationCallOrder[0]
    const deleteMessagesOrder = messageRepository.deleteBySessionId.mock.invocationCallOrder[0]
    const deleteAuthOrder = mocks.deleteUser.mock.invocationCallOrder[0]
    expect(cancelOrder).toBeLessThan(deleteMessagesOrder)
    expect(cancelOrder).toBeLessThan(deleteAuthOrder)
    expect(mocks.deleteUser).toHaveBeenCalledWith("u1")
  })

  it("si l'annulation échoue : rien n'est supprimé, erreur explicite", async () => {
    mocks.cancelUserSubscription.mockRejectedValue(new Error("Stripe indisponible"))
    const { service, sessionRepository, messageRepository } = build()

    await expect(service.deleteAccount({ userId: "u1" })).rejects.toThrow(
      /abonnement/i,
    )

    expect(sessionRepository.find).not.toHaveBeenCalled()
    expect(messageRepository.deleteBySessionId).not.toHaveBeenCalled()
    expect(mocks.deleteUser).not.toHaveBeenCalled()
  })
})
