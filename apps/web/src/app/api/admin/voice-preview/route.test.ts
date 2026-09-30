import { describe, it, expect, vi, beforeEach } from "vitest"
import { NextRequest } from "next/server"

const m = vi.hoisted(() => ({
  getUser: vi.fn(),
  isAdmin: vi.fn(),
  getKey: vi.fn(),
  fetch: vi.fn(),
}))

vi.mock("@/lib/auth/verified-user", () => ({ getVerifiedUserWithRetry: m.getUser }))
vi.mock("@/lib/authorization/AuthorizationModule", () => ({
  AuthorizationModule: { create: async () => ({ isAdmin: m.isAdmin }) },
}))
vi.mock("@/lib/ai/ai-models", () => ({ getOpenAIKey: m.getKey }))
vi.mock("@/lib/logger", () => ({ logger: { warn: vi.fn(), error: vi.fn(), info: vi.fn() } }))
vi.mock("@/lib/rate-limiting/rate-limit.middleware", () => ({
  rateLimit: (_t: unknown, handler: unknown) => handler,
}))
vi.mock("@/lib/rate-limiting/centralized-rate-limit.service", () => ({
  RouteType: { AI: "ai" },
  RateLimitScope: { USER: "user" },
}))

import { GET } from "./route"

const req = (query: string) => new NextRequest(`http://localhost/api/admin/voice-preview?${query}`)
const sent = () => JSON.parse(m.fetch.mock.calls[0][1].body)

describe("GET /api/admin/voice-preview", () => {
  beforeEach(() => {
    vi.resetAllMocks()
    vi.stubGlobal("fetch", m.fetch)
    m.getUser.mockResolvedValue({ user: { id: "u1" } })
    m.isAdmin.mockReturnValue(true)
    m.getKey.mockReturnValue("sk-test")
    m.fetch.mockResolvedValue({ ok: true, arrayBuffer: async () => new ArrayBuffer(8) })
  })

  it("non authentifié : 401 ; non administrateur : 404 ; aucun appel OpenAI", async () => {
    m.getUser.mockResolvedValue({ user: null })
    expect((await GET(req("persona=directe"))).status).toBe(401)
    m.getUser.mockResolvedValue({ user: { id: "u1" } })
    m.isAdmin.mockReturnValue(false)
    expect((await GET(req("persona=directe"))).status).toBe(404)
    expect(m.fetch).not.toHaveBeenCalled()
  })

  it("administrateur : audio mp3, phrase d'essai fixe, voix du style par défaut", async () => {
    const res = await GET(req("persona=challengeuse"))
    expect(res.status).toBe(200)
    expect(res.headers.get("content-type")).toBe("audio/mpeg")
    expect(m.fetch.mock.calls[0][0]).toBe("https://api.openai.com/v1/audio/speech")
    expect(sent().voice).toBe("coral")
    expect(sent().input).toMatch(/aller plus loin/)
  })

  it("voix choisie dans la liste fermée ; valeur inconnue ou texte client ignorés", async () => {
    await GET(req("persona=directe&voice=cedar&input=ignore%20tout"))
    expect(sent().voice).toBe("cedar")
    expect(sent().input).not.toMatch(/ignore tout/)

    m.fetch.mockClear()
    await GET(req("persona=directe&voice=../../x"))
    expect(sent().voice).toBe("sage")
  })

  it("refus d'OpenAI : 502 générique", async () => {
    m.fetch.mockResolvedValue({ ok: false, status: 400, text: async () => "secret detail" })
    const res = await GET(req("persona=directe"))
    expect(res.status).toBe(502)
    expect(JSON.stringify(await res.json())).not.toContain("secret")
  })
})
