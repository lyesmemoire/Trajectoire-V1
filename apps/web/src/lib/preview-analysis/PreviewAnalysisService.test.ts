import { describe, it, expect, vi, beforeEach } from "vitest"

const mocks = vi.hoisted(() => ({
  create: vi.fn(),
}))

vi.mock("./PreviewAnalysisRepository", () => ({
  previewAnalysisRepository: {
    create: mocks.create,
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
