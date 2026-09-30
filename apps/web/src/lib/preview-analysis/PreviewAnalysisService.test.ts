import { describe, it, expect, vi, beforeEach } from "vitest"

const mocks = vi.hoisted(() => ({
  create: vi.fn(),
  isValidToken: vi.fn(),
  findByToken: vi.fn(),
  claimForUser: vi.fn(),
}))

vi.mock("./PreviewAnalysisRepository", () => ({
  previewAnalysisRepository: {
    create: mocks.create,
    isValidToken: mocks.isValidToken,
    findByToken: mocks.findByToken,
    claimForUser: mocks.claimForUser,
  },
}))

import { PreviewAnalysisService } from "./PreviewAnalysisService"

describe("PreviewAnalysisService.savePreviewAnalysis", () => {
  beforeEach(() => vi.resetAllMocks())

  it("persiste le résultat réellement calculé, sans texte de CV ni d'offre", async () => {
    mocks.create.mockResolvedValue("tok_1")
    const service = new PreviewAnalysisService()

    const { previewToken } = await service.savePreviewAnalysis({
      result: { score: 72, strengths: ["A", "B"], weakness: "C" },
      ipHash: "fp",
      fingerprint: "fp",
    })

    expect(previewToken).toBe("tok_1")
    const data = mocks.create.mock.calls[0][0]
    expect(data).toMatchObject({
      analysisResult: { score: 72, strengths: ["A", "B"], weakness: "C" },
      atsScore: 72,
      strengths: ["A", "B"],
      weaknesses: ["C"],
      status: "completed",
    })
    // Minimisation des données : rien d'autre que le résultat
    expect(data).not.toHaveProperty("rawPayload")
    expect(data).not.toHaveProperty("cvExtract")
    expect(data).not.toHaveProperty("jobExtract")
    expect(JSON.stringify(data)).not.toMatch(/JavaScript|TypeScript|5 ans/)
  })

  it("aucune faiblesse : liste vide, jamais une valeur inventée", async () => {
    mocks.create.mockResolvedValue("tok_2")
    await new PreviewAnalysisService().savePreviewAnalysis({
      result: { score: 50, strengths: [] },
    })
    expect(mocks.create.mock.calls[0][0].weaknesses).toEqual([])
  })
})

describe("PreviewAnalysisService.claimPreview", () => {
  beforeEach(() => vi.resetAllMocks())

  it("lie seulement l'aperçu à l'utilisateur", async () => {
    mocks.isValidToken.mockResolvedValue(true)
    mocks.findByToken.mockResolvedValue({ claimedByUserId: null })

    await new PreviewAnalysisService().claimPreview("tok", "u1")

    expect(mocks.claimForUser).toHaveBeenCalledWith("tok", "u1")
  })

  it("refuse un jeton invalide ou expiré", async () => {
    mocks.isValidToken.mockResolvedValue(false)
    await expect(new PreviewAnalysisService().claimPreview("tok", "u1")).rejects.toThrow(
      "Invalid or expired preview token",
    )
    expect(mocks.claimForUser).not.toHaveBeenCalled()
  })

  it("refuse un aperçu introuvable", async () => {
    mocks.isValidToken.mockResolvedValue(true)
    mocks.findByToken.mockResolvedValue(null)
    await expect(new PreviewAnalysisService().claimPreview("tok", "u1")).rejects.toThrow(
      "Preview analysis not found",
    )
  })

  it("refuse un aperçu déjà réclamé", async () => {
    mocks.isValidToken.mockResolvedValue(true)
    mocks.findByToken.mockResolvedValue({ claimedByUserId: "autre" })
    await expect(new PreviewAnalysisService().claimPreview("tok", "u1")).rejects.toThrow(
      "already claimed",
    )
    expect(mocks.claimForUser).not.toHaveBeenCalled()
  })
})
