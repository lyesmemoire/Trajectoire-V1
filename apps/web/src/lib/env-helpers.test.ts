import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { z } from "zod"
import { optionalNonEmptyString } from "./env-helpers"

describe("optionalNonEmptyString", () => {
  const schema = z.object({ KEY: optionalNonEmptyString() })

  it("absente, chaîne vide ou espaces seuls : acceptée, valeur undefined", () => {
    for (const input of [{}, { KEY: undefined }, { KEY: "" }, { KEY: "   " }, { KEY: "\t\n" }]) {
      const r = schema.safeParse(input)
      expect(r.success).toBe(true)
      expect(r.success && r.data.KEY).toBeUndefined()
    }
  })

  it("valeur non vide : conservée telle quelle", () => {
    const r = schema.safeParse({ KEY: " abc " })
    expect(r.success && r.data.KEY).toBe(" abc ")
  })

  it("type inattendu (nombre) : toujours refusé, pas converti en absente", () => {
    expect(schema.safeParse({ KEY: 42 }).success).toBe(false)
  })
})

/**
 * Intégration : le vrai schéma d'`env.server.ts`. En production, une validation en échec arrête l'application,
 * donc une variable France Travail créée VIDE chez l'hébergeur ne doit rien casser ; absente non plus.
 */
describe("env.server : FRANCE_TRAVAIL_CLIENT_ID / FRANCE_TRAVAIL_CLIENT_SECRET", () => {
  const logError = vi.fn()

  const baseEnv = {
    NEXT_PUBLIC_SUPABASE_URL: "http://127.0.0.1:54321",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon-test-key",
    SUPABASE_SERVICE_ROLE_KEY: "service-test-key",
    STRIPE_SECRET_KEY: "sk_test_123",
    SKIP_ENV_VALIDATION: undefined,
  }

  async function loadEnv(overrides: Record<string, string | undefined>) {
    vi.resetModules()
    vi.doMock("@/lib/logger/Logger", () => ({ logError }))
    for (const [key, value] of Object.entries({ ...baseEnv, ...overrides })) {
      if (value === undefined) vi.stubEnv(key, undefined as unknown as string)
      else vi.stubEnv(key, value)
    }
    return (await import("./env.server")).envServer
  }

  beforeEach(() => {
    logError.mockReset()
    vi.unstubAllEnvs()
  })
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.doUnmock("@/lib/logger/Logger")
  })

  it("absentes : aucune erreur de validation, valeurs undefined", async () => {
    const env = await loadEnv({ FRANCE_TRAVAIL_CLIENT_ID: undefined, FRANCE_TRAVAIL_CLIENT_SECRET: undefined })
    expect(logError).not.toHaveBeenCalled()
    expect(env.FRANCE_TRAVAIL_CLIENT_ID).toBeUndefined()
    expect(env.FRANCE_TRAVAIL_CLIENT_SECRET).toBeUndefined()
  })

  it("chaînes vides : traitées comme absentes, aucune erreur de validation", async () => {
    const env = await loadEnv({ FRANCE_TRAVAIL_CLIENT_ID: "", FRANCE_TRAVAIL_CLIENT_SECRET: "" })
    expect(logError).not.toHaveBeenCalled()
    expect(env.FRANCE_TRAVAIL_CLIENT_ID).toBeUndefined()
    expect(env.FRANCE_TRAVAIL_CLIENT_SECRET).toBeUndefined()
  })

  it("valeurs renseignées : conservées", async () => {
    const env = await loadEnv({ FRANCE_TRAVAIL_CLIENT_ID: "mon-id", FRANCE_TRAVAIL_CLIENT_SECRET: "mon-secret" })
    expect(logError).not.toHaveBeenCalled()
    expect(env.FRANCE_TRAVAIL_CLIENT_ID).toBe("mon-id")
    expect(env.FRANCE_TRAVAIL_CLIENT_SECRET).toBe("mon-secret")
  })

  it("garde-fou : une vraie variable invalide est toujours signalée (le test ne valide pas tout à vide)", async () => {
    await loadEnv({ NEXT_PUBLIC_SUPABASE_URL: "pas-une-url" })
    expect(logError).toHaveBeenCalled()
    expect(String(logError.mock.calls[0][0])).toContain("NEXT_PUBLIC_SUPABASE_URL")
  })
})
