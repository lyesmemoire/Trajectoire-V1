import { describe, it, expect, vi } from "vitest"

const captured = vi.hoisted(() => ({ type: "" as string, options: undefined as unknown }))

vi.mock("@/lib/rate-limiting/rate-limit.middleware", () => ({
  rateLimit: (type: string, handler: unknown, options: unknown) => {
    captured.type = type
    captured.options = options
    return handler
  },
}))
vi.mock("@/lib/rate-limiting/centralized-rate-limit.service", () => ({
  RouteType: { UPLOAD: "upload" },
  RateLimitScope: { USER: "user", IP: "ip" },
}))
vi.mock("@/lib/supabase/server", () => ({
  createClient: async () => ({ auth: { getUser: async () => ({ data: { user: null }, error: null }) } }),
}))
vi.mock("@/lib/logger", () => ({ logger: { error: vi.fn(), info: vi.fn() } }))

import { NextRequest } from "next/server"
import { POST } from "./route"

describe("POST /api/cv/upload", () => {
  it("est protégée par une limite de débit utilisateur + IP", () => {
    expect(captured.type).toBe("upload")
    expect(captured.options).toEqual({ scopes: ["user", "ip"] })
  })

  it("refuse un appel non authentifié", async () => {
    const res = await POST(new NextRequest("http://localhost/api/cv/upload", { method: "POST" }))
    expect(res.status).toBe(401)
  })
})
