import { describe, it, expect, vi, beforeEach } from "vitest"
import { NextRequest } from "next/server"

const m = vi.hoisted(() => ({
  getUser: vi.fn(),
  findUnique: vi.fn(),
  updateMany: vi.fn(),
  upload: vi.fn(),
}))

vi.mock("@/lib/auth/verified-user", () => ({ getVerifiedUserWithRetry: m.getUser }))
vi.mock("@/lib/supabase/service", () => ({
  createAdminClient: () => ({ storage: { from: () => ({ upload: m.upload }) } }),
}))
// Verrou transparent : on teste la logique de la route, pas le verrou distribué.
vi.mock("@/lib/concurrency/DistributedLock", () => ({
  DistributedLock: { execute: async (_key: string, fn: () => Promise<unknown>) => fn() },
}))
vi.mock("@/lib/prisma", () => ({
  prisma: { interview_sessions: { findUnique: m.findUnique, updateMany: m.updateMany } },
}))

import { POST } from "./route"

const SESSION_ID = "0b1c2d3e-0000-4000-8000-000000000001"

function request(fields: { sessionId?: string; messageId?: string; type?: string } = {}) {
  const form = new FormData()
  form.set("sessionId", fields.sessionId ?? SESSION_ID)
  form.set("messageId", fields.messageId ?? "msg1")
  form.set("audio", new Blob([new Uint8Array([1, 2, 3])], { type: fields.type ?? "audio/webm" }), "a.webm")
  return new NextRequest("http://localhost/api/simulation/audio-upload", { method: "POST", body: form })
}

const sessionRow = (over: Record<string, unknown> = {}) => ({
  user_id: "u1",
  version: 7,
  analysis: { qnaEvaluations: [{ messageId: "msg1", oralPerformance: { durationMs: 1200 } }] },
  ...over,
})

beforeEach(() => {
  vi.resetAllMocks()
  m.getUser.mockResolvedValue({ user: { id: "u1" }, authError: null })
  m.findUnique.mockResolvedValue(sessionRow())
  m.upload.mockResolvedValue({ error: null })
  m.updateMany.mockResolvedValue({ count: 1 })
})

describe("POST /api/simulation/audio-upload (table interview_sessions)", () => {
  it("non authentifié : 401", async () => {
    m.getUser.mockResolvedValue({ user: null, authError: new Error("x") })
    expect((await POST(request())).status).toBe(401)
    expect(m.findUnique).not.toHaveBeenCalled()
  })

  it("identifiant de séance mal formé : 404 sans interroger la base ni le stockage", async () => {
    expect((await POST(request({ sessionId: "123" }))).status).toBe(404)
    expect(m.findUnique).not.toHaveBeenCalled()
    expect(m.upload).not.toHaveBeenCalled()
  })

  it("séance d'un autre utilisateur : 403, rien n'est téléversé ni écrit", async () => {
    m.findUnique.mockResolvedValue(sessionRow({ user_id: "autre" }))
    expect((await POST(request())).status).toBe(403)
    expect(m.upload).not.toHaveBeenCalled()
    expect(m.updateMany).not.toHaveBeenCalled()
  })

  it("séance absente : 404 ; réponse inconnue dans les évaluations : 404", async () => {
    m.findUnique.mockResolvedValueOnce(null)
    expect((await POST(request())).status).toBe(404)
    expect((await POST(request({ messageId: "inconnu" }))).status).toBe(404)
    expect(m.updateMany).not.toHaveBeenCalled()
  })

  it("succès : lit user_id, analysis et version ; écrit l'audio dans analysis sous condition de version et l'incrémente", async () => {
    const res = await POST(request())
    expect(res.status).toBe(200)
    expect(m.findUnique.mock.calls[0][0]).toEqual({ where: { id: SESSION_ID }, select: { user_id: true, analysis: true, version: true } })

    const write = m.updateMany.mock.calls[0][0]
    expect(write.where).toEqual({ id: SESSION_ID, version: 7 })
    expect(write.data.version).toEqual({ increment: 1 })
    expect(write.data.analysis.qnaEvaluations[0].audio).toMatchObject({ path: `u1/${SESSION_ID}/msg1.webm`, mimeType: "audio/webm", durationMs: 1200 })
  })

  it("écriture concurrente (version changée entre la lecture et l'écriture) : 409, rien d'écrasé", async () => {
    m.updateMany.mockResolvedValue({ count: 0 })
    expect((await POST(request())).status).toBe(409)
  })

  it("échec du stockage : 500, aucune métadonnée écrite", async () => {
    m.upload.mockResolvedValue({ error: { message: "boom" } })
    expect((await POST(request())).status).toBe(500)
    expect(m.updateMany).not.toHaveBeenCalled()
  })

  it("format audio invalide : 400", async () => {
    expect((await POST(request({ type: "audio/mp3" }))).status).toBe(400)
  })
})
