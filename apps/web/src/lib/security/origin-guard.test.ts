import { describe, it, expect } from "vitest"
import { checkRequestOrigin } from "./origin-guard"

const allowedOrigins = ["https://trajectoire.io", "http://localhost:3000", "https://*.preview.app"]
const base = {
  method: "POST",
  pathname: "/api/simulation/create",
  origin: "https://trajectoire.io" as string | null,
  host: "trajectoire.io" as string | null,
  secFetchSite: "same-origin" as string | null,
  allowedOrigins,
}
const check = (over: Partial<typeof base>) => checkRequestOrigin({ ...base, ...over })

describe("checkRequestOrigin", () => {
  it("autorise l'origine du site", () => {
    expect(check({}).allowed).toBe(true)
  })

  it("refuse une origine étrangère sur une écriture", () => {
    for (const method of ["POST", "PUT", "PATCH", "DELETE"]) {
      const r = check({ method, origin: "https://evil.example" })
      expect(r).toEqual({ allowed: false, reason: "origin_not_allowed" })
    }
  })

  it("ne contrôle pas les lectures ni les routes hors /api", () => {
    expect(check({ method: "GET", origin: "https://evil.example" }).allowed).toBe(true)
    expect(check({ pathname: "/dashboard", origin: "https://evil.example" }).allowed).toBe(true)
  })

  it("exclut le webhook Stripe", () => {
    expect(check({ pathname: "/api/stripe/webhook", origin: "https://evil.example" }).allowed).toBe(true)
  })

  it("Origin absent : accepté (serveur à serveur), refusé si cross-site", () => {
    expect(check({ origin: null, secFetchSite: null }).allowed).toBe(true)
    expect(check({ origin: null, secFetchSite: "same-origin" }).allowed).toBe(true)
    expect(check({ origin: null, secFetchSite: "cross-site" })).toEqual({
      allowed: false,
      reason: "cross_site_without_origin",
    })
  })

  it("accepte l'hôte de la requête même hors liste (variable d'environnement absente)", () => {
    expect(
      check({ origin: "https://www.trajectoire.io", host: "www.trajectoire.io", allowedOrigins: ["http://localhost:3000"] }).allowed,
    ).toBe(true)
  })

  it("un hôte différent n'est pas accepté par ce repli", () => {
    expect(check({ origin: "https://evil.example", host: "trajectoire.io" }).allowed).toBe(false)
  })

  it("origine opaque « null » ou illisible : refusée", () => {
    expect(check({ origin: "null" }).allowed).toBe(false)
  })

  it("prend en charge les jokers de la liste (prévisualisations)", () => {
    expect(check({ origin: "https://pr-12.preview.app", host: "trajectoire.io" }).allowed).toBe(true)
    expect(check({ origin: "https://preview.app.evil.example", host: "trajectoire.io" }).allowed).toBe(false)
  })
})
