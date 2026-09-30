import { describe, it, expect } from "vitest"
import { readdirSync, statSync } from "node:fs"
import { join } from "node:path"
import { fileURLToPath } from "node:url"
import { AuthorizationV2, AccessLevel } from "./AuthorizationV2"

/**
 * Défaut fermé : toute page ou route API du dépôt doit avoir une règle explicite dans AuthorizationV2,
 * sinon elle répond 404 en production. Ce test parcourt src/app et échoue à l'ajout d'une page ou
 * d'une route sans règle : impossible de la publier par oubli.
 */

const APP_DIR = fileURLToPath(new URL("../../app", import.meta.url))

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) walk(p, out)
    else if (name === "page.tsx" || name === "route.ts") out.push(p)
  }
  return out
}

/** Chemin d'URL d'un fichier page/route : groupes retirés, segments dynamiques remplacés. */
function toUrl(file: string): string {
  const rel = file.slice(APP_DIR.length).split(String.fromCharCode(92)).join("/")
  const withoutFile = rel.replace(/\/(page\.tsx|route\.ts)$/, "")
  const url = withoutFile
    .split("/")
    .filter(seg => seg && !/^\(.*\)$/.test(seg))
    .map(seg => (/^\[.*\]$/.test(seg) ? "x" : seg))
    .join("/")
  return "/" + url
}

const level = (path: string) => new AuthorizationV2(null).getRequiredAccessLevel(path)
const CLOSED_ON_PURPOSE = ["/monitoring", "/recruiter", "/__qa__"]

describe("couverture des règles d'accès (défaut fermé)", () => {
  const urls = walk(APP_DIR).map(toUrl)

  it("le parcours trouve les pages et routes du dépôt", () => {
    expect(urls.length).toBeGreaterThan(60)
    expect(urls).toContain("/login")
    expect(urls).toContain("/api/simulation/create")
  })

  it("chaque page et route a une règle explicite, sauf celles fermées volontairement", () => {
    const unruled = urls.filter(u => level(u) === AccessLevel.NOT_FOUND && !CLOSED_ON_PURPOSE.some(c => u === c || u.startsWith(c + "/")))
    expect(unruled).toEqual([])
  })

  it("les pages fermées volontairement le sont", () => {
    for (const p of CLOSED_ON_PURPOSE) expect(level(p)).toBe(AccessLevel.NOT_FOUND)
  })
})

describe("défaut fermé", () => {
  it("un chemin inconnu est fermé, y compris avec un préfixe proche d'une règle", () => {
    for (const p of ["/unknown-route", "/api/unknown", "/dashboardx", "/api/cvx", "/login-old"]) {
      expect(level(p)).toBe(AccessLevel.NOT_FOUND)
    }
  })

  it("la règle « / » ne couvre que l'accueil", () => {
    expect(level("/")).toBe(AccessLevel.PUBLIC)
    expect(level("/nimporte-quoi")).toBe(AccessLevel.NOT_FOUND)
  })

  it("les pages du parcours d'authentification restent publiques", () => {
    for (const p of ["/login", "/signup", "/forgot-password", "/reset-password", "/logout", "/signup-conversion", "/privacy", "/terms", "/pricing", "/analyze", "/contact"]) {
      expect(level(p)).toBe(AccessLevel.PUBLIC)
    }
  })

  it("API : publiques seulement auth, health, public et webhook Stripe", () => {
    for (const p of ["/api/auth/login", "/api/auth/callback", "/api/health/readiness", "/api/public/analyze-preview", "/api/stripe/webhook"]) {
      expect(level(p)).toBe(AccessLevel.PUBLIC)
    }
    for (const p of ["/api/stripe/checkout", "/api/stripe/customer-portal", "/api/account", "/api/quota", "/api/analytics/track"]) {
      expect(level(p)).toBe(AccessLevel.AUTHENTICATED)
    }
  })

  it("métriques de performance : administrateurs seulement", () => {
    expect(level("/api/performance/health")).toBe(AccessLevel.ADMIN)
  })

  it("checkAccess : fermé pour tous, même un administrateur connecté", () => {
    const admin = new AuthorizationV2({ userId: "u", email: "a@b.c", role: "ADMIN_FOUNDER", plan: "PRO", isAuthenticated: true } as never)
    expect(admin.checkAccess("/monitoring")).toMatchObject({ allowed: false, reason: "Not found" })
    expect(admin.checkAccess("/api/performance/health").allowed).toBe(true)
    const anon = new AuthorizationV2(null)
    expect(anon.checkAccess("/api/performance/health")).toMatchObject({ allowed: false, reason: "Authentication required" })
  })
})
