import { describe, it, expect, vi, beforeEach } from "vitest"

const m = vi.hoisted(() => ({
  QuotaError: class QuotaError extends Error {},
  getUser: vi.fn(),
  oppFindFirst: vi.fn(),
  userFindUnique: vi.fn(),
  sessionFindFirst: vi.fn(),
  checkQuota: vi.fn(),
  start: vi.fn(),
}))

const QuotaError = m.QuotaError

vi.mock("next/navigation", () => ({
  redirect: (to: string) => {
    throw new Error(`REDIRECT:${to}`)
  },
}))
vi.mock("@/lib/auth/verified-user", () => ({ getVerifiedUserWithRetry: m.getUser }))
vi.mock("@/lib/quota/simulation-quota", () => ({ checkSimulationQuota: m.checkQuota }))
vi.mock("@/lib/logger", () => ({ logger: { warn: vi.fn(), error: vi.fn(), info: vi.fn() } }))
vi.mock("@/lib/prisma", () => ({
  prisma: {
    opportunity: { findFirst: m.oppFindFirst },
    user: { findUnique: m.userFindUnique },
    interview_sessions: { findFirst: m.sessionFindFirst },
  },
}))
vi.mock("@/lib/simulation/start-simulation", () => ({
  SimulationQuotaExceededError: m.QuotaError,
  startSimulation: m.start,
  MAX_JOB_DESCRIPTION_LENGTH: 20_000,
}))

import { prepareInterview } from "./actions"

const redirectTarget = async (p: Promise<unknown>) => {
  const err = (await p.catch((e: unknown) => e)) as Error
  return err.message
}

beforeEach(() => {
  vi.resetAllMocks()
  m.getUser.mockResolvedValue({ supabase: { tag: "supabase" }, user: { id: "u1" } })
  m.oppFindFirst.mockResolvedValue({ title: "Dev", company: "Acme", location: "Paris", description: "desc" })
  m.userFindUnique.mockResolvedValue({ onboardingData: null })
  m.sessionFindFirst.mockResolvedValue(null)
  m.checkQuota.mockResolvedValue({ allowed: true })
  m.start.mockResolvedValue({ sessionId: "s1" })
})

describe("prepareInterview", () => {
  it("identifiant invalide : retour à /opportunities, rien n'est lu ni créé", async () => {
    expect(await redirectTarget(prepareInterview("  "))).toBe("REDIRECT:/opportunities")
    expect(m.getUser).not.toHaveBeenCalled()
  })

  it("non connecté : /login ; opportunité d'un autre utilisateur ou absente : /opportunities", async () => {
    m.getUser.mockResolvedValueOnce({ supabase: {}, user: null })
    expect(await redirectTarget(prepareInterview("o1"))).toBe("REDIRECT:/login")

    m.oppFindFirst.mockResolvedValueOnce(null)
    expect(await redirectTarget(prepareInterview("o1"))).toBe("REDIRECT:/opportunities")
    expect(m.oppFindFirst.mock.calls[0][0].where).toEqual({ id: "o1", userId: "u1" })
    expect(m.start).not.toHaveBeenCalled()
  })

  it("crée la simulation préremplie pour l'utilisateur de la session et redirige vers elle", async () => {
    expect(await redirectTarget(prepareInterview("o1"))).toBe("REDIRECT:/simulation/s1")
    const args = m.start.mock.calls[0][0]
    expect(args.userId).toBe("u1")
    expect(args.input).toMatchObject({ jobTitle: "Dev", opportunityId: "o1", duration: 15 })
    expect(args.input.jobDescription).toContain("Entreprise : Acme")
  })

  it("séance identique créée il y a moins de 2 minutes : reprise, ni quota ni création", async () => {
    m.sessionFindFirst.mockResolvedValue({ id: "s-existante" })
    expect(await redirectTarget(prepareInterview("o1"))).toBe("REDIRECT:/simulation/s-existante")
    expect(m.checkQuota).not.toHaveBeenCalled()
    expect(m.start).not.toHaveBeenCalled()
    const where = m.sessionFindFirst.mock.calls[0][0].where
    expect(where).toMatchObject({ user_id: "u1", status: "in_progress", job_title: "Dev" })
  })

  it("quota épuisé (avant ou pendant la création) : /pricing", async () => {
    m.checkQuota.mockResolvedValueOnce({ allowed: false })
    expect(await redirectTarget(prepareInterview("o1"))).toBe("REDIRECT:/pricing?reason=quota")
    expect(m.start).not.toHaveBeenCalled()

    m.start.mockRejectedValueOnce(new QuotaError("course perdue"))
    expect(await redirectTarget(prepareInterview("o1"))).toBe("REDIRECT:/pricing?reason=quota")
  })

  it("autre erreur : relancée pour la page d'erreur", async () => {
    m.start.mockRejectedValueOnce(new Error("boom"))
    expect(await redirectTarget(prepareInterview("o1"))).toBe("boom")
  })
})
