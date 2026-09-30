import { describe, it, expect, vi, beforeEach } from "vitest"
import { NextRequest } from "next/server"

const m = vi.hoisted(() => ({
  getUser: vi.fn(),
  findById: vi.fn(),
  getKey: vi.fn(),
  fetch: vi.fn(),
}))

vi.mock("@/lib/auth/verified-user", () => ({ getVerifiedUserWithRetry: m.getUser }))
vi.mock("@/lib/ai/ai-models", () => ({ getOpenAIKey: m.getKey }))
vi.mock("@/infrastructure/di", () => ({
  Container: { resolve: async () => ({ findById: m.findById }) },
  ServiceTokens: { SessionRepository: "SessionRepository" },
}))
vi.mock("@/infrastructure/di/bootstrap", () => ({ initializeContainer: () => {} }))
vi.mock("@/lib/rate-limiting/rate-limit.middleware", () => ({
  rateLimit: (_t: unknown, handler: unknown) => handler,
}))
vi.mock("@/lib/rate-limiting/centralized-rate-limit.service", () => ({
  RouteType: { SIMULATION: "simulation" },
  RateLimitScope: { USER: "user", IP: "ip" },
}))

import { POST } from "./route"

const req = (body: unknown) =>
  new NextRequest("http://localhost/api/interview/realtime-session", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  })

describe("POST /api/interview/realtime-session — session obligatoire", () => {
  beforeEach(() => {
    vi.resetAllMocks()
    vi.stubGlobal("fetch", m.fetch)
    m.getUser.mockResolvedValue({ user: { id: "u1" } })
    m.getKey.mockReturnValue("sk-test")
    m.fetch.mockResolvedValue({ ok: true, json: async () => ({ id: "rt1", client_secret: { value: "eph" } }) })
  })

  it("non authentifié : 401, aucun appel OpenAI", async () => {
    m.getUser.mockResolvedValue({ user: null })
    expect((await POST(req({ candidateId: "s1" }))).status).toBe(401)
    expect(m.fetch).not.toHaveBeenCalled()
  })

  it("sans session : 400, aucun appel OpenAI", async () => {
    expect((await POST(req({}))).status).toBe(400)
    expect(m.fetch).not.toHaveBeenCalled()
  })

  it("session inexistante ou d'un autre utilisateur : 404, aucun appel OpenAI", async () => {
    m.findById.mockResolvedValueOnce(null)
    expect((await POST(req({ candidateId: "s1" }))).status).toBe(404)
    m.findById.mockResolvedValueOnce({ id: "s1", user_id: "autre", status: "in_progress" })
    expect((await POST(req({ candidateId: "s1" }))).status).toBe(404)
    expect(m.fetch).not.toHaveBeenCalled()
  })

  it("session terminée : 409, aucun appel OpenAI", async () => {
    m.findById.mockResolvedValue({ id: "s1", user_id: "u1", status: "completed", interview_type: "RH" })
    expect((await POST(req({ candidateId: "s1" }))).status).toBe(409)
    expect(m.fetch).not.toHaveBeenCalled()
  })

  it("vérification impossible : échec fermé (503), aucun appel OpenAI", async () => {
    m.findById.mockRejectedValue(new Error("db down"))
    expect((await POST(req({ candidateId: "s1" }))).status).toBe(503)
    expect(m.fetch).not.toHaveBeenCalled()
  })

  it("session en cours de l'utilisateur : jeton émis, question selon le type", async () => {
    m.findById.mockResolvedValue({ id: "s1", user_id: "u1", status: "in_progress", interview_type: "Technique" })
    const res = await POST(req({ candidateId: "s1" }))
    const body = await res.json()
    expect(res.status).toBe(200)
    expect(body.client_secret).toBe("eph")
    expect(body.question_id).toBe("opening_technique")
    expect(m.fetch).toHaveBeenCalledTimes(1)
  })
})
