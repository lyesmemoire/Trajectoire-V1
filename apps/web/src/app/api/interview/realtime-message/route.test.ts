import { describe, it, expect, vi, beforeEach } from "vitest"
import { NextRequest } from "next/server"

const m = vi.hoisted(() => ({
  getUser: vi.fn(),
  findById: vi.fn(),
  create: vi.fn(),
  protection: { type: "" as string, options: undefined as unknown },
}))

vi.mock("@/lib/auth/verified-user", () => ({ getVerifiedUserWithRetry: m.getUser }))
vi.mock("@/infrastructure/di", () => ({
  Container: {
    resolve: async (token: string) =>
      token === "SessionRepository" ? { findById: m.findById } : { create: m.create },
  },
  ServiceTokens: { SessionRepository: "SessionRepository", MessageRepository: "MessageRepository" },
}))
vi.mock("@/infrastructure/di/bootstrap", () => ({ initializeContainer: () => {} }))
vi.mock("@/lib/rate-limiting/rate-limit.middleware", () => ({
  rateLimit: (type: string, handler: unknown, options: unknown) => {
    m.protection.type = type
    m.protection.options = options
    return handler
  },
}))
vi.mock("@/lib/rate-limiting/centralized-rate-limit.service", () => ({
  RouteType: { INTERVIEW_TURN: "interview_turn" },
  RateLimitScope: { USER: "user", IP: "ip" },
}))

import { POST } from "./route"

const req = (body: unknown) =>
  new NextRequest("http://localhost/api/interview/realtime-message", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  })
const valid = { sessionId: "s1", role: "user", content: "Bonjour" }

describe("POST /api/interview/realtime-message", () => {
  it("est limitée par utilisateur (bucket dédié aux tours d'entretien)", () => {
    expect(m.protection.type).toBe("interview_turn")
    expect(m.protection.options).toEqual({ scopes: ["user"] })
  })

  beforeEach(() => {
    vi.resetAllMocks()
    m.getUser.mockResolvedValue({ user: { id: "u1" } })
    m.findById.mockResolvedValue({ id: "s1", user_id: "u1", status: "in_progress" })
    m.create.mockResolvedValue({})
  })

  it("non authentifié : 401, rien d'écrit", async () => {
    m.getUser.mockResolvedValue({ user: null })
    expect((await POST(req(valid))).status).toBe(401)
    expect(m.create).not.toHaveBeenCalled()
  })

  it("corps invalide : 400 (contenu vide, non texte, rôle inconnu)", async () => {
    expect((await POST(req({ ...valid, content: "   " }))).status).toBe(400)
    expect((await POST(req({ ...valid, content: 42 }))).status).toBe(400)
    expect((await POST(req({ ...valid, role: "system" }))).status).toBe(400)
    expect(m.create).not.toHaveBeenCalled()
  })

  it("session inexistante : 404 ; d'un autre utilisateur : 403", async () => {
    m.findById.mockResolvedValueOnce(null)
    expect((await POST(req(valid))).status).toBe(404)
    m.findById.mockResolvedValueOnce({ id: "s1", user_id: "autre", status: "in_progress" })
    expect((await POST(req(valid))).status).toBe(403)
    expect(m.create).not.toHaveBeenCalled()
  })

  it("session terminée ou annulée : 409, rien d'écrit", async () => {
    for (const status of ["completed", "cancelled"]) {
      m.findById.mockResolvedValueOnce({ id: "s1", user_id: "u1", status })
      expect((await POST(req(valid))).status).toBe(409)
    }
    expect(m.create).not.toHaveBeenCalled()
  })

  it("session en cours : message enregistré", async () => {
    const res = await POST(req(valid))
    expect(res.status).toBe(200)
    expect(m.create).toHaveBeenCalledWith({ session_id: "s1", role: "user", content: "Bonjour" })
  })

  it("contenu tronqué à 4000 caractères", async () => {
    const res = await POST(req({ ...valid, content: "a".repeat(10_000) }))
    expect(res.status).toBe(200)
    expect(m.create.mock.calls[0][0].content).toHaveLength(4000)
  })
})
