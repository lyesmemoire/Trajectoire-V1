import { describe, it, expect, vi, beforeEach } from "vitest"
import { NextRequest, NextResponse } from "next/server"

const mocks = vi.hoisted(() => ({
  getUser: vi.fn(),
  requireFullCvAnalysis: vi.fn(),
  analysisFindFirst: vi.fn(),
  protection: { csrf: 0, type: "" as string, options: undefined as unknown },
}))

vi.mock("@/lib/security/csrf-middleware", () => ({
  csrfProtect: (handler: unknown) => {
    mocks.protection.csrf += 1
    return handler
  },
}))
vi.mock("@/lib/rate-limiting/rate-limit.middleware", () => ({
  rateLimit: (type: string, handler: unknown, options: unknown) => {
    mocks.protection.type = type
    mocks.protection.options = options
    return handler
  },
}))
vi.mock("@/lib/rate-limiting/centralized-rate-limit.service", () => ({
  RouteType: { UPLOAD: "upload" },
  RateLimitScope: { USER: "user", IP: "ip" },
}))
vi.mock("@/lib/supabase/server", () => ({ createClient: async () => ({ auth: { getUser: mocks.getUser } }) }))
vi.mock("@/lib/quota/plan-access", () => ({ requireFullCvAnalysis: mocks.requireFullCvAnalysis }))
vi.mock("@/lib/prisma", () => ({ prisma: { cVAnalysis: { findFirst: mocks.analysisFindFirst } } }))

import { POST } from "./route"

const DOCUMENT = {
  personal: { name: "Marie Dupont", email: "", phone: "", location: "", linkedin: "" },
  headline: "",
  summary: "Développeuse full stack avec six ans d'expérience.",
  experiences: [
    { title: "Développeuse", company: "Acme", startDate: "2020", endDate: "", current: true, bullets: ["Migration vers le cloud"] },
  ],
  education: [],
  skills: { technical: ["TypeScript"], languages: [], soft: [] },
}

const call = (body: unknown, raw?: string) =>
  (POST as unknown as (r: NextRequest) => Promise<Response>)(
    new NextRequest("http://localhost/api/cv/export", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: raw ?? JSON.stringify(body),
    }),
  )

const valid = (over: Record<string, unknown> = {}) => ({ analysisId: "a1", format: "docx", document: DOCUMENT, ...over })

describe("POST /api/cv/export", () => {
  it("est protégée par CSRF et par une limite de débit utilisateur + IP", () => {
    expect(mocks.protection.csrf).toBe(1)
    expect(mocks.protection.type).toBe("upload")
    expect(mocks.protection.options).toEqual({ scopes: ["user", "ip"] })
  })

  beforeEach(() => {
    vi.resetAllMocks()
    mocks.getUser.mockResolvedValue({ data: { user: { id: "u1" } }, error: null })
    mocks.requireFullCvAnalysis.mockResolvedValue(null)
    mocks.analysisFindFirst.mockResolvedValue({ id: "a1" })
  })

  it("non authentifié : 401, plan non vérifié", async () => {
    mocks.getUser.mockResolvedValue({ data: { user: null }, error: null })
    expect((await call(valid())).status).toBe(401)
    expect(mocks.requireFullCvAnalysis).not.toHaveBeenCalled()
  })

  it("plan gratuit : 403 avant toute lecture en base", async () => {
    mocks.requireFullCvAnalysis.mockResolvedValue(NextResponse.json({ error: "PLAN_REQUIRED" }, { status: 403 }))
    expect((await call(valid())).status).toBe(403)
    expect(mocks.analysisFindFirst).not.toHaveBeenCalled()
  })

  it("corps invalide : 400 (JSON cassé, format inconnu, champ en trop, nom absent, CV vide)", async () => {
    expect((await call(null, "pas du json")).status).toBe(400)
    expect((await call(valid({ format: "exe" }))).status).toBe(400)
    expect((await call(valid({ extra: 1 }))).status).toBe(400)
    expect((await call(valid({ document: { ...DOCUMENT, personal: { ...DOCUMENT.personal, name: "  " } } }))).status).toBe(400)
    const empty = {
      ...DOCUMENT,
      summary: "",
      experiences: [],
      skills: { technical: [], languages: [], soft: [] },
    }
    const res = await call(valid({ document: empty }))
    expect(res.status).toBe(400)
    expect((await res.json()).error).toMatch(/vide/)
    expect(mocks.analysisFindFirst).not.toHaveBeenCalled()
  })

  it("corps trop volumineux : 413", async () => {
    const big = valid({ document: { ...DOCUMENT, summary: "x" } })
    const res = await call(null, JSON.stringify({ ...big, pad: "a".repeat(210_000) }))
    expect(res.status).toBe(413)
  })

  it("analyse d'un autre utilisateur ou inexistante : 404, aucun fichier", async () => {
    mocks.analysisFindFirst.mockResolvedValue(null)
    expect((await call(valid())).status).toBe(404)
    expect(mocks.analysisFindFirst.mock.calls[0][0].where).toEqual({ id: "a1", userId: "u1" })
  })

  it("DOCX : fichier Word renvoyé en pièce jointe, sans mise en cache", async () => {
    const res = await call(valid())
    expect(res.status).toBe(200)
    expect(res.headers.get("content-type")).toContain("wordprocessingml.document")
    expect(res.headers.get("content-disposition")).toBe('attachment; filename="CV-Marie-Dupont.docx"')
    expect(res.headers.get("cache-control")).toBe("no-store")
    const bytes = Buffer.from(await res.arrayBuffer())
    expect(bytes.subarray(0, 2).toString("latin1")).toBe("PK")
    expect(res.headers.get("content-length")).toBe(String(bytes.length))
  })

  it("PDF : fichier PDF renvoyé en pièce jointe", async () => {
    const res = await call(valid({ format: "pdf" }))
    expect(res.status).toBe(200)
    expect(res.headers.get("content-type")).toBe("application/pdf")
    expect(res.headers.get("content-disposition")).toBe('attachment; filename="CV-Marie-Dupont.pdf"')
    expect(Buffer.from(await res.arrayBuffer()).subarray(0, 4).toString("latin1")).toBe("%PDF")
  })
})
