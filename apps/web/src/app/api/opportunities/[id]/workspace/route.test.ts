import { describe, it, expect, vi, beforeEach } from "vitest"
import { NextRequest } from "next/server"

const m = vi.hoisted(() => ({
  getUser: vi.fn(),
  oppFindFirst: vi.fn(),
  wsUpsert: vi.fn(),
  interview: vi.fn(),
}))

vi.mock("@/lib/supabase/server", () => ({
  createClient: async () => ({ auth: { getUser: async () => ({ data: { user: m.getUser() }, error: null }) } }),
}))
vi.mock("@/lib/prisma", () => ({
  prisma: {
    opportunity: { findFirst: m.oppFindFirst },
    applicationWorkspace: { upsert: m.wsUpsert },
    cVAnalysis: { findFirst: vi.fn() },
  },
}))
vi.mock("@/lib/interview/session-reader", () => ({ findOpportunityInterview: m.interview }))

import { GET, PATCH } from "./route"

const ctx = { params: Promise.resolve({ id: "opp1" }) }

beforeEach(() => {
  vi.resetAllMocks()
  m.getUser.mockReturnValue({ id: "u1" })
  m.oppFindFirst.mockResolvedValue({ id: "opp1", userId: "u1", title: "Dev", company: "Acme" })
  m.wsUpsert.mockResolvedValue({ id: "w1", opportunityId: "opp1", selectedCVAnalysis: null })
})

describe("workspace d'une opportunité : entretien lié par interview_sessions.opportunityId", () => {
  it("GET : l'entretien vient du lecteur de interview_sessions (utilisateur et opportunité), plus de la relation vers l'ancienne table", async () => {
    m.interview.mockResolvedValue({ id: "s1", jobTitle: "Dev", score: 80, status: "completed", completedAt: null })
    const res = await GET(new NextRequest("http://localhost/api/opportunities/opp1/workspace"), ctx)
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(m.interview).toHaveBeenCalledWith("u1", "opp1")
    expect(body.workspace.interviewSession).toMatchObject({ id: "s1", score: 80, status: "completed" })

    const include = m.wsUpsert.mock.calls[0][0].include
    expect(Object.keys(include)).toEqual(["selectedCVAnalysis"])
  })

  it("GET sans séance liée : interviewSession = null", async () => {
    m.interview.mockResolvedValue(null)
    const body = await (await GET(new NextRequest("http://localhost/api/opportunities/opp1/workspace"), ctx)).json()
    expect(body.workspace.interviewSession).toBeNull()
  })

  it("PATCH avec l'ancien champ interviewSessionId : refusé (400), rien n'est écrit", async () => {
    const res = await PATCH(
      new NextRequest("http://localhost/api/opportunities/opp1/workspace", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ interviewSessionId: "x" }),
      }),
      ctx,
    )
    expect(res.status).toBe(400)
    expect((await res.json()).code).toBe("INTERVIEW_SESSION_LINK_UNSUPPORTED")
    expect(m.wsUpsert).not.toHaveBeenCalled()
  })
})
