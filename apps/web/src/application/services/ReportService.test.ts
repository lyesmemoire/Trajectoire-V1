import { describe, it, expect, vi, beforeEach } from "vitest"

const ai = vi.hoisted(() => ({ generateReport: vi.fn() }))
vi.mock("@/lib/ai/services/report.service", () => ({ ReportService: { generateReport: ai.generateReport } }))

import { ReportService, MIN_CANDIDATE_WORDS } from "./ReportService"

const words = (n: number) => Array.from({ length: n }, () => "mot").join(" ")

function setup(messages: Array<{ role: string; content: string }>) {
  const reportRepository = {
    getBySessionId: vi.fn().mockResolvedValue(null),
    create: vi.fn().mockResolvedValue({ id: "r1" }),
  }
  const quotaService = {
    checkQuota: vi.fn().mockResolvedValue({ allowed: true, limit: 10, remaining: 10, period: "month" }),
    incrementQuota: vi.fn(),
  }
  const service = new ReportService(
    {
      findById: vi.fn().mockResolvedValue({
        user_id: "u1", status: "completed", job_title: "Dev", level: "Senior", interview_type: "RH", duration_seconds: 900,
      }),
    } as never,
    reportRepository as never,
    { getBySessionId: vi.fn().mockResolvedValue(messages) } as never,
    { checkRateLimit: vi.fn().mockResolvedValue({ allowed: true }) } as never,
    quotaService as never,
    { log: vi.fn() } as never,
    { setUserContext: vi.fn(), error: vi.fn(), info: vi.fn() } as never
  )
  return { service, reportRepository, quotaService }
}

describe("ReportService.generateReport : garde-fous", () => {
  beforeEach(() => vi.resetAllMocks())

  it("séance d'un autre utilisateur : 403, aucun appel IA, aucun rapport créé", async () => {
    const { service, reportRepository, quotaService } = setup([{ role: "user", content: words(MIN_CANDIDATE_WORDS) }])
    await expect(service.generateReport({ userId: "u2", sessionId: "s1" })).rejects.toMatchObject({ statusCode: 403 })
    expect(ai.generateReport).not.toHaveBeenCalled()
    expect(reportRepository.create).not.toHaveBeenCalled()
    expect(quotaService.incrementQuota).not.toHaveBeenCalled()
  })

  it("entretien sans réponse du candidat : 422, aucun appel IA, rien d'enregistré", async () => {
    const { service, reportRepository, quotaService } = setup([{ role: "assistant", content: "Bonjour, parlez-moi de vous." }])
    await expect(service.generateReport({ userId: "u1", sessionId: "s1" })).rejects.toMatchObject({ statusCode: 422 })
    expect(ai.generateReport).not.toHaveBeenCalled()
    expect(reportRepository.create).not.toHaveBeenCalled()
    expect(quotaService.incrementQuota).not.toHaveBeenCalled()
  })

  it("candidat trop peu bavard (sous le seuil) : 422", async () => {
    const { service } = setup([
      { role: "assistant", content: "Question ?" },
      { role: "user", content: words(MIN_CANDIDATE_WORDS - 1) },
    ])
    await expect(service.generateReport({ userId: "u1", sessionId: "s1" })).rejects.toMatchObject({ statusCode: 422 })
  })

  it("échec de l'IA : 503, aucun faux rapport enregistré ni compté au quota", async () => {
    ai.generateReport.mockRejectedValue(new Error("openai down"))
    const { service, reportRepository, quotaService } = setup([
      { role: "assistant", content: "Question ?" },
      { role: "user", content: words(MIN_CANDIDATE_WORDS) },
    ])
    await expect(service.generateReport({ userId: "u1", sessionId: "s1" })).rejects.toMatchObject({ statusCode: 503 })
    expect(reportRepository.create).not.toHaveBeenCalled()
    expect(quotaService.incrementQuota).not.toHaveBeenCalled()
  })

  it("entretien suffisant et IA disponible : rapport enregistré et compté", async () => {
    ai.generateReport.mockResolvedValue({
      overallScore: 70, communication: 70, technical: 70, confidence: 70,
      strengths: ["a"], improvements: ["b"], summary: "s", recommendation: "r",
    })
    const { service, reportRepository, quotaService } = setup([
      { role: "assistant", content: "Question ?" },
      { role: "user", content: words(MIN_CANDIDATE_WORDS) },
    ])
    const res = await service.generateReport({ userId: "u1", sessionId: "s1" })
    expect(res.reportId).toBe("r1")
    expect(reportRepository.create).toHaveBeenCalledTimes(1)
    expect(quotaService.incrementQuota).toHaveBeenCalledTimes(1)
  })
})
