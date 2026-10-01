import { describe, it, expect, vi, beforeEach } from "vitest"

const db = vi.hoisted(() => ({ queryRaw: vi.fn() }))
vi.mock("@/lib/prisma", () => ({ prisma: { $queryRaw: db.queryRaw } }))
vi.mock("@/lib/logger", () => ({ logger: { warn: vi.fn(), error: vi.fn(), info: vi.fn() } }))

import { findOpportunityInterview, isUuid, toOpportunityInterview } from "./session-reader"

const row = (over: Record<string, unknown> = {}) => ({
  id: "0b1c2d3e-0000-4000-8000-000000000001",
  job_title: "Développeur",
  score: 72,
  status: "completed",
  completed_at: new Date("2026-10-01T10:00:00Z"),
  ...over,
})

describe("isUuid", () => {
  it("accepte un uuid, refuse le reste", () => {
    expect(isUuid("0b1c2d3e-0000-4000-8000-000000000001")).toBe(true)
    expect(isUuid("0B1C2D3E-0000-4000-8000-000000000001")).toBe(true)
    for (const bad of ["123", "", "clxyz123abc", "0b1c2d3e-0000-4000-8000-00000000000", "0b1c2d3e-0000-4000-8000-0000000000012", "x' OR 1=1 --"]) {
      expect(isUuid(bad)).toBe(false)
    }
  })
})

describe("toOpportunityInterview", () => {
  it("terminée ou en cours : projetée en camelCase", () => {
    expect(toOpportunityInterview(row())).toEqual({
      id: "0b1c2d3e-0000-4000-8000-000000000001",
      jobTitle: "Développeur",
      score: 72,
      status: "completed",
      completedAt: new Date("2026-10-01T10:00:00Z"),
    })
    expect(toOpportunityInterview(row({ status: "in_progress", score: null, completed_at: null }))).toMatchObject({ status: "in_progress", score: null, completedAt: null })
  })

  it("autre statut (échec, abandon, ancien « active ») : ignorée", () => {
    for (const status of ["failed", "abandoned", "active", "created"]) expect(toOpportunityInterview(row({ status }))).toBeNull()
  })
})

describe("findOpportunityInterview", () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it("lit interview_sessions : filtre utilisateur et opportunité, terminée d'abord, une seule ligne", async () => {
    db.queryRaw.mockResolvedValue([row()])
    const found = await findOpportunityInterview("u-uuid", "opp1")

    expect(found?.status).toBe("completed")
    const [strings, ...values] = db.queryRaw.mock.calls[0]
    const sql = (strings as string[]).join("?")
    expect(sql).toContain("public.interview_sessions")
    expect(sql).toContain('"opportunityId"')
    expect(sql).toMatch(/user_id = \?::uuid/)
    expect(sql).toMatch(/ORDER BY \(status = 'completed'\) DESC, created_at DESC/)
    expect(sql).toMatch(/LIMIT 1/)
    // Valeurs passées en paramètres (jamais concaténées dans le SQL).
    expect(values).toEqual(["u-uuid", "opp1"])
    expect(sql).not.toContain("opp1")
  })

  it("aucune séance liée : null", async () => {
    db.queryRaw.mockResolvedValue([])
    expect(await findOpportunityInterview("u", "opp1")).toBeNull()
  })

  it("lecture en échec (colonne absente d'un environnement non migré, uuid invalide) : null, l'écran ne tombe pas", async () => {
    db.queryRaw.mockRejectedValue(new Error('column "opportunityId" does not exist'))
    expect(await findOpportunityInterview("u", "opp1")).toBeNull()
  })
})
