import { describe, it, expect } from "vitest"
import { buildContentSecurityPolicy } from "./csp"

const csp = buildContentSecurityPolicy("SCRIPTNONCE", "STYLENONCE")
const directive = (name: string) =>
  csp.split(";").map(d => d.trim()).find(d => d.startsWith(name + " "))

describe("buildContentSecurityPolicy", () => {
  it("script-src : nonce + strict-dynamic, jamais unsafe-inline ni unsafe-eval", () => {
    const d = directive("script-src")!
    expect(d).toContain("'nonce-SCRIPTNONCE'")
    expect(d).toContain("'strict-dynamic'")
    expect(d).not.toContain("unsafe-inline")
    expect(d).not.toContain("unsafe-eval")
  })

  it("style-src : nonce seulement ; unsafe-inline réservé aux attributs style", () => {
    expect(directive("style-src")).toContain("'nonce-STYLENONCE'")
    expect(directive("style-src")).not.toContain("unsafe-inline")
    expect(directive("style-src-attr")).toBe("style-src-attr 'unsafe-inline'")
  })

  it("connect-src : Supabase, OpenAI, Sentry et PostHog", () => {
    const d = directive("connect-src")!
    for (const host of ["https://*.supabase.co", "https://api.openai.com", "https://*.sentry.io", "https://*.posthog.com"]) {
      expect(d).toContain(host)
    }
  })

  it("garde-fous : pas d'iframe, pas d'object, pas de wildcard global", () => {
    expect(csp).toContain("frame-ancestors 'none'")
    expect(csp).toContain("object-src 'none'")
    expect(csp).toContain("default-src 'self'")
    expect(csp).not.toMatch(/(^|\s)\*(\s|;)/)
  })
})
