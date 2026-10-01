import { describe, it, expect, vi, beforeEach } from "vitest"
import { NextRequest } from "next/server"

const m = vi.hoisted(() => ({
  exchange: vi.fn(),
  verifyOtp: vi.fn(),
  getUser: vi.fn(),
  transfer: vi.fn(),
}))

vi.mock("@/lib/supabase/server", () => ({
  createClient: async () => ({ auth: { exchangeCodeForSession: m.exchange, verifyOtp: m.verifyOtp, getUser: m.getUser } }),
}))
vi.mock("@/lib/logger", () => ({ logger: { warn: vi.fn(), error: vi.fn(), info: vi.fn() } }))
vi.mock("@/lib/preview/PreviewTransferService", () => ({ PreviewTransferService: { transferPreviewToUser: m.transfer } }))

import { GET } from "./route"

const call = (query: string, cookie?: string) =>
  GET(new NextRequest(`http://localhost/api/auth/callback?${query}`, { headers: cookie ? { cookie } : {} }))

const location = (res: Response) => new URL(res.headers.get("location") ?? "").pathname + new URL(res.headers.get("location") ?? "").search
const setCookies = (res: Response) => res.headers.getSetCookie().join(" | ")

beforeEach(() => {
  vi.resetAllMocks()
  m.exchange.mockResolvedValue({ error: null })
  m.verifyOtp.mockResolvedValue({ error: null })
  m.getUser.mockResolvedValue({ data: { user: { id: "u1" } } })
  m.transfer.mockResolvedValue({ success: true })
})

describe("GET /api/auth/callback : plan choisi avant l'inscription", () => {
  it("sans témoin : /dashboard comme avant", async () => {
    const res = await call("code=abc")
    expect(location(res)).toBe("/dashboard")
    expect(setCookies(res)).not.toContain("checkout_intent")
  })

  it("témoin valide et destination par défaut : retour sur /pricing?resume=<plan>, témoin supprimé", async () => {
    const res = await call("code=abc", "checkout_intent=PACK")
    expect(location(res)).toBe("/pricing?resume=PACK")
    expect(setCookies(res)).toMatch(/checkout_intent=;/)
  })

  it("lien reçu par e-mail (token_hash) : même comportement", async () => {
    const res = await call("token_hash=xyz&type=signup", "checkout_intent=PRO")
    expect(location(res)).toBe("/pricing?resume=PRO")
  })

  it("destination explicite (next) ou réinitialisation de mot de passe : jamais remplacée", async () => {
    expect(location(await call("code=abc&next=/simulation/new", "checkout_intent=PACK"))).toBe("/simulation/new")
    expect(location(await call("code=abc&type=recovery", "checkout_intent=PACK"))).toBe("/reset-password")
  })

  it("témoin invalide (FREE, injection) : destination inchangée mais témoin nettoyé", async () => {
    const res = await call("code=abc", "checkout_intent=FREE")
    expect(location(res)).toBe("/dashboard")
    expect(setCookies(res)).toMatch(/checkout_intent=;/)

    const injected = await call("code=abc", "checkout_intent=https%3A%2F%2Fevil.test")
    expect(location(injected)).toBe("/dashboard")
  })

  it("coexiste avec le rattachement de l'aperçu : les deux sont traités", async () => {
    const res = await call("code=abc", "preview_token=tok123; checkout_intent=PACK")
    expect(m.transfer).toHaveBeenCalledWith("tok123", "u1")
    expect(location(res)).toBe("/pricing?resume=PACK")
    expect(setCookies(res)).toMatch(/preview_token=;/)
    expect(setCookies(res)).toMatch(/checkout_intent=;/)
  })

  it("lien refusé ou échange de session en échec : /login?error=…, le témoin n'est pas utilisé", async () => {
    m.exchange.mockResolvedValue({ error: { message: "invalid" } })
    const res = await call("code=abc", "checkout_intent=PACK")
    expect(location(res)).toBe("/login?error=link_invalid")
    expect(await call("", "checkout_intent=PACK").then(location)).toBe("/login?error=missing_code")
  })
})
