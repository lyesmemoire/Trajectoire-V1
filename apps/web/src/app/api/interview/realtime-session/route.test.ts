import { describe, it, expect, vi, beforeEach } from "vitest"
import { NextRequest } from "next/server"

const m = vi.hoisted(() => ({
  getUser: vi.fn(),
  findById: vi.fn(),
  getMessages: vi.fn(),
  buildContext: vi.fn(),
  getKey: vi.fn(),
  fetch: vi.fn(),
}))

vi.mock("@/lib/auth/verified-user", () => ({ getVerifiedUserWithRetry: m.getUser }))
vi.mock("@/lib/ai/ai-models", () => ({ getOpenAIKey: m.getKey }))
vi.mock("@/infrastructure/di", () => ({
  Container: {
    resolve: async (token: string) =>
      token === "MessageRepository" ? { getBySessionId: m.getMessages } : { findById: m.findById },
  },
  ServiceTokens: { SessionRepository: "SessionRepository", MessageRepository: "MessageRepository" },
}))
vi.mock("@/infrastructure/di/bootstrap", () => ({ initializeContainer: () => {} }))
vi.mock("@/application/interview-context/UnifiedInterviewContextService", () => ({
  UnifiedInterviewContextService: class {
    build = m.buildContext
  },
}))
vi.mock("@/lib/supabase/server", () => ({ createClient: async () => ({}) }))
vi.mock("@/lib/logger", () => ({ logger: { warn: vi.fn(), error: vi.fn(), info: vi.fn() } }))
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

const SESSION = {
  id: "s1",
  user_id: "u1",
  status: "in_progress",
  interview_type: "Technique",
  job_title: "Développeur",
  level: "Senior",
  duration_seconds: 900,
}

const openaiBody = () => JSON.parse(m.fetch.mock.calls[0][1].body)

describe("POST /api/interview/realtime-session", () => {
  beforeEach(() => {
    vi.resetAllMocks()
    vi.stubGlobal("fetch", m.fetch)
    m.getUser.mockResolvedValue({ user: { id: "u1" } })
    m.getKey.mockReturnValue("sk-test")
    m.getMessages.mockResolvedValue([])
    m.buildContext.mockResolvedValue({
      candidate: { cvText: "CV de Marie" },
      job: { description: "Offre TypeScript" },
      matching: { matchedSkills: ["TypeScript"], missingSkills: ["Kubernetes"] },
      topRisks: [],
    })
    m.fetch.mockResolvedValue({ ok: true, json: async () => ({ value: "eph", expires_at: 123 }) })
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
    m.findById.mockResolvedValueOnce({ ...SESSION, user_id: "autre" })
    expect((await POST(req({ candidateId: "s1" }))).status).toBe(404)
    expect(m.fetch).not.toHaveBeenCalled()
  })

  it("session terminée : 409, aucun appel OpenAI", async () => {
    m.findById.mockResolvedValue({ ...SESSION, status: "completed" })
    expect((await POST(req({ candidateId: "s1" }))).status).toBe(409)
    expect(m.fetch).not.toHaveBeenCalled()
  })

  it("vérification impossible : échec fermé (503), aucun appel OpenAI", async () => {
    m.findById.mockRejectedValue(new Error("db down"))
    expect((await POST(req({ candidateId: "s1" }))).status).toBe(503)
    expect(m.fetch).not.toHaveBeenCalled()
  })

  it("séance neuve : contrat GA (client_secrets, session realtime) et question de repli du type", async () => {
    m.findById.mockResolvedValue(SESSION)
    const res = await POST(req({ candidateId: "s1" }))
    const body = await res.json()
    expect(res.status).toBe(200)
    expect(body.client_secret).toBe("eph")
    expect(body.opening_persisted).toBe(false)
    expect(body.resumed).toBe(false)
    expect(body.duration_seconds).toBe(900)
    expect(body.first_question).toMatch(/problème technique/)

    const [url, init] = m.fetch.mock.calls[0]
    expect(url).toBe("https://api.openai.com/v1/realtime/client_secrets")
    expect(init.headers.Authorization).toBe("Bearer sk-test")
    expect(init.headers["OpenAI-Beta"]).toBeUndefined()
    const sent = openaiBody()
    expect(sent.session.type).toBe("realtime")
    expect(sent.session.model).toBe("gpt-realtime-2.1")
    expect(sent.session.audio.output.voice).toBe("marin")
    expect(sent.session.audio.input.turn_detection.type).toBe("semantic_vad")
    expect(sent.session.instructions).toContain("CV de Marie")
    expect(sent.session.instructions).toContain("Développeur")
  })

  it("question d'ouverture déjà enregistrée : reprise telle quelle, marquée comme persistée", async () => {
    m.findById.mockResolvedValue(SESSION)
    m.getMessages.mockResolvedValue([{ role: "assistant", content: "Parlez-moi de vous." }])
    const body = await (await POST(req({ candidateId: "s1" }))).json()
    expect(body.first_question).toBe("Parlez-moi de vous.")
    expect(body.opening_persisted).toBe(true)
    expect(body.resumed).toBe(false)
  })

  it("page rechargée en cours d'entretien : reprise, ouverture non rejouée", async () => {
    m.findById.mockResolvedValue(SESSION)
    m.getMessages.mockResolvedValue([
      { role: "assistant", content: "Parlez-moi de vous." },
      { role: "user", content: "Je suis développeuse." },
    ])
    const body = await (await POST(req({ candidateId: "s1" }))).json()
    expect(body.resumed).toBe(true)
    expect(body.opening_persisted).toBe(false)
    expect(openaiBody().session.instructions).toContain("Je suis développeuse.")
  })

  it("contexte indisponible : la séance continue sans CV ni offre", async () => {
    m.findById.mockResolvedValue(SESSION)
    m.buildContext.mockRejectedValue(new Error("boom"))
    const res = await POST(req({ candidateId: "s1" }))
    expect(res.status).toBe(200)
    expect(openaiBody().session.instructions).not.toContain("<cv_du_candidat>")
  })

  it("refus d'OpenAI : 502 générique, le texte d'erreur n'est pas renvoyé", async () => {
    m.findById.mockResolvedValue(SESSION)
    m.fetch.mockResolvedValue({ ok: false, status: 403, text: async () => "model gpt-realtime-2.1 not allowed for org-secret" })
    const res = await POST(req({ candidateId: "s1" }))
    expect(res.status).toBe(502)
    expect(JSON.stringify(await res.json())).not.toContain("org-secret")
  })
})
