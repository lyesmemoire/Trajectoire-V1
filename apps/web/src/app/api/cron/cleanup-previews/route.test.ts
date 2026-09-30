import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { NextRequest } from "next/server"

const m = vi.hoisted(() => ({ job: vi.fn() }))
vi.mock("@/lib/preview-analysis/previewCleanupJob", () => ({ previewCleanupJob: m.job }))

import { GET } from "./route"

const call = (authorization?: string) =>
  GET(
    new NextRequest("http://localhost/api/cron/cleanup-previews", {
      headers: authorization ? { authorization } : {},
    }),
  )

describe("GET /api/cron/cleanup-previews", () => {
  const original = process.env.CRON_SECRET

  beforeEach(() => {
    vi.resetAllMocks()
    process.env.CRON_SECRET = "secret-de-test"
    m.job.mockResolvedValue({ success: true, deletedCount: 3 })
  })

  afterEach(() => {
    if (original === undefined) delete process.env.CRON_SECRET
    else process.env.CRON_SECRET = original
  })

  it("sans secret configuré : 503, rien n'est exécuté", async () => {
    delete process.env.CRON_SECRET
    expect((await call("Bearer secret-de-test")).status).toBe(503)
    expect(m.job).not.toHaveBeenCalled()
  })

  it("sans en-tête ou avec un mauvais secret : 401, rien n'est exécuté", async () => {
    expect((await call()).status).toBe(401)
    expect((await call("Bearer mauvais")).status).toBe(401)
    expect((await call("secret-de-test")).status).toBe(401)
    expect(m.job).not.toHaveBeenCalled()
  })

  it("avec le bon secret : exécute le nettoyage et renvoie le résultat", async () => {
    const res = await call("Bearer secret-de-test")
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ success: true, deletedCount: 3 })
    expect(m.job).toHaveBeenCalledTimes(1)
  })

  it("échec du nettoyage : 500", async () => {
    m.job.mockResolvedValue({ success: false, error: "base indisponible" })
    expect((await call("Bearer secret-de-test")).status).toBe(500)
  })
})
