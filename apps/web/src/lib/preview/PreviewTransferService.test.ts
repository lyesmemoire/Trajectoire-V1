import { describe, it, expect, vi, beforeEach } from "vitest"

const mocks = vi.hoisted(() => ({
  getPreviewByToken: vi.fn(),
  markAsConsumed: vi.fn(),
  prismaAccess: vi.fn(),
}))

vi.mock("./PreviewStorageService", () => ({
  PreviewStorageService: {
    getPreviewByToken: mocks.getPreviewByToken,
    markAsConsumed: mocks.markAsConsumed,
  },
}))

// Toute écriture Prisma ferait échouer ces tests : le transfert n'écrit plus rien
// dans le profil, les analyses ou le nom de l'utilisateur.
vi.mock("@/lib/prisma", () => ({
  prisma: new Proxy(
    {},
    {
      get() {
        mocks.prismaAccess()
        throw new Error("Prisma ne doit pas être utilisé par PreviewTransferService")
      },
    },
  ),
}))

import { PreviewTransferService } from "./PreviewTransferService"

describe("PreviewTransferService.transferPreviewToUser (Option B : lien seulement)", () => {
  beforeEach(() => vi.resetAllMocks())

  it("marque l'aperçu comme consommé pour l'utilisateur et n'écrit rien d'autre", async () => {
    mocks.getPreviewByToken.mockResolvedValue({
      token: "t",
      atsResult: { score: 60, strengths: ["A"], weakness: "B" },
      candidateData: { fullName: "Jean", email: "j@x.fr" },
    })
    mocks.markAsConsumed.mockResolvedValue(true)

    const result = await PreviewTransferService.transferPreviewToUser("t", "u1")

    expect(result).toEqual({ success: true })
    expect(mocks.markAsConsumed).toHaveBeenCalledWith("t", "u1")
    expect(mocks.prismaAccess).not.toHaveBeenCalled()
  })

  it("aperçu introuvable, expiré ou déjà consommé : échec, rien de consommé", async () => {
    mocks.getPreviewByToken.mockResolvedValue(null)

    const result = await PreviewTransferService.transferPreviewToUser("t", "u1")

    expect(result.success).toBe(false)
    expect(mocks.markAsConsumed).not.toHaveBeenCalled()
  })

  it("marquage refusé : échec explicite", async () => {
    mocks.getPreviewByToken.mockResolvedValue({ token: "t" })
    mocks.markAsConsumed.mockResolvedValue(false)

    const result = await PreviewTransferService.transferPreviewToUser("t", "u1")

    expect(result).toEqual({ success: false, error: "Failed to mark preview as consumed" })
  })

  it("erreur inattendue : échec sans exception", async () => {
    mocks.getPreviewByToken.mockRejectedValue(new Error("db"))

    const result = await PreviewTransferService.transferPreviewToUser("t", "u1")

    expect(result.success).toBe(false)
  })
})
