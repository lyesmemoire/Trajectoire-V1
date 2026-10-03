import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import {
  CHECKOUT_INTENT_COOKIE,
  CHECKOUT_INTENT_MAX_AGE_SECONDS,
  postAuthPathFromIntent,
  resolvePostAuthDestination,
  resumeDestination,
  setCheckoutIntent,
  takeCheckoutIntent,
} from "./checkout-intent"

describe("resumeDestination / resolvePostAuthDestination", () => {
  it("destination de reprise construite côté code, depuis la liste blanche", () => {
    expect(resumeDestination("PACK")).toBe("/pricing?resume=PACK")
    expect(resumeDestination("PRO")).toBe("/pricing?resume=PRO")
  })

  it("destination par défaut + intention valide : retour sur /pricing avec le plan", () => {
    expect(resolvePostAuthDestination("/dashboard", "PACK")).toBe("/pricing?resume=PACK")
    expect(resolvePostAuthDestination("/dashboard", "PRO")).toBe("/pricing?resume=PRO")
  })

  it("destination explicite : jamais remplacée (réinitialisation de mot de passe, page demandée avant connexion)", () => {
    expect(resolvePostAuthDestination("/reset-password", "PACK")).toBe("/reset-password")
    expect(resolvePostAuthDestination("/simulation/abc", "PRO")).toBe("/simulation/abc")
  })

  it("intention absente ou invalide (FREE, inconnue, injection) : destination inchangée", () => {
    for (const bad of [undefined, null, "", "FREE", "pack", "PACK;evil", "https://evil.test", "//evil.test"]) {
      expect(resolvePostAuthDestination("/dashboard", bad)).toBe("/dashboard")
    }
  })

  it("la valeur du témoin n'apparaît jamais telle quelle dans la destination", () => {
    expect(resolvePostAuthDestination("/dashboard", "PACK&next=https://evil.test")).toBe("/dashboard")
  })
})

describe("témoin côté navigateur", () => {
  let jar: Record<string, string>

  beforeEach(() => {
    jar = {}
    vi.stubGlobal("window", { location: { protocol: "https:" } })
    vi.stubGlobal("document", {
      get cookie() {
        return Object.entries(jar).map(([k, v]) => `${k}=${v}`).join("; ")
      },
      set cookie(raw: string) {
        const [pair, ...attrs] = raw.split(";").map(part => part.trim())
        const [key, ...value] = pair.split("=")
        const maxAge = attrs.find(a => a.toLowerCase().startsWith("max-age="))
        if (maxAge && Number(maxAge.split("=")[1]) <= 0) delete jar[key]
        else jar[key] = value.join("=")
      },
    })
  })
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("posé avec le bon nom, lu une seule fois puis supprimé", () => {
    setCheckoutIntent("PACK")
    expect(jar[CHECKOUT_INTENT_COOKIE]).toBe("PACK")
    expect(takeCheckoutIntent()).toBe("PACK")
    expect(jar[CHECKOUT_INTENT_COOKIE]).toBeUndefined()
    expect(takeCheckoutIntent()).toBeNull()
  })

  it("valeur invalide : null, et le témoin est tout de même supprimé", () => {
    jar[CHECKOUT_INTENT_COOKIE] = "FREE"
    expect(takeCheckoutIntent()).toBeNull()
    expect(jar[CHECKOUT_INTENT_COOKIE]).toBeUndefined()
  })

  it("postAuthPathFromIntent : reprise si intention et destination par défaut ; sinon destination inchangée", () => {
    setCheckoutIntent("PRO")
    expect(postAuthPathFromIntent()).toBe("/pricing?resume=PRO")
    expect(jar[CHECKOUT_INTENT_COOKIE]).toBeUndefined()

    expect(postAuthPathFromIntent()).toBe("/dashboard")

    setCheckoutIntent("PACK")
    expect(postAuthPathFromIntent("/simulation/new")).toBe("/simulation/new")
    expect(jar[CHECKOUT_INTENT_COOKIE]).toBe("PACK") // laissé en place : une destination explicite ne le consomme pas
  })

  it("durée de vie d'une heure", () => {
    expect(CHECKOUT_INTENT_MAX_AGE_SECONDS).toBe(3600)
  })
})
