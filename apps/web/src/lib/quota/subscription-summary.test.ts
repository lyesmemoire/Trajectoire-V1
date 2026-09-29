import { describe, it, expect } from "vitest"
import { buildSubscriptionSummary } from "./subscription-summary"
import type { SimulationQuota } from "./simulation-quota"

function quota(over: Partial<SimulationQuota>): SimulationQuota {
  return {
    plan: "FREE",
    resource: "simulations",
    limit: 0,
    used: 0,
    remaining: 0,
    isUnlimited: false,
    periodStart: null,
    periodEnd: null,
    allowed: false,
    expired: false,
    ...over,
  }
}

describe("buildSubscriptionSummary", () => {
  it("FREE : aucune simulation, offres proposées, pas de portail", () => {
    const s = buildSubscriptionSummary(quota({}))
    expect(s.plan).toBe("FREE")
    expect(s.priceLabel).toBe("Gratuit")
    expect(s.headline).toBe("Aucune simulation incluse")
    expect(s.showUpgrade).toBe(true)
    expect(s.showPortal).toBe(false)
    expect(s.progress).toBeNull()
  })

  it("PACK actif : X sur 5, expiration, portail, pas d'upgrade", () => {
    const s = buildSubscriptionSummary(
      quota({
        plan: "PACK",
        limit: 5,
        used: 3,
        remaining: 2,
        allowed: true,
        periodEnd: new Date("2027-01-12T10:00:00.000Z"),
      }),
    )
    expect(s.planName).toBe("Pack Entretien")
    expect(s.headline).toBe("2 simulations restantes sur 5")
    expect(s.detail).toBe("Valable jusqu'au 12 janvier 2027")
    expect(s.progress).toEqual({ used: 3, limit: 5 })
    expect(s.showPortal).toBe(true)
    expect(s.showUpgrade).toBe(false)
  })

  it("PACK : singulier pour une simulation restante", () => {
    const s = buildSubscriptionSummary(
      quota({ plan: "PACK", limit: 5, used: 4, remaining: 1, allowed: true }),
    )
    expect(s.headline).toBe("1 simulation restante sur 5")
  })

  it("PACK épuisé : upgrade proposé, portail conservé", () => {
    const s = buildSubscriptionSummary(
      quota({ plan: "PACK", limit: 5, used: 5, remaining: 0 }),
    )
    expect(s.headline).toBe("Vous avez utilisé vos 5 simulations")
    expect(s.showUpgrade).toBe(true)
    expect(s.showPortal).toBe(true)
  })

  it("PACK expiré (plan effectif FREE) : message d'expiration, upgrade et portail", () => {
    const s = buildSubscriptionSummary(
      quota({
        plan: "FREE",
        expired: true,
        periodEnd: new Date("2026-09-01T10:00:00.000Z"),
      }),
    )
    expect(s.headline).toBe("Votre Pack Entretien a expiré")
    expect(s.detail).toContain("Expiré le 1 septembre 2026")
    expect(s.showUpgrade).toBe(true)
    expect(s.showPortal).toBe(true)
  })

  it("PRO : illimité, prix mensuel, portail, pas d'upgrade", () => {
    const s = buildSubscriptionSummary(
      quota({
        plan: "PRO",
        limit: null,
        remaining: null,
        isUnlimited: true,
        allowed: true,
        periodEnd: new Date("2026-10-25T10:00:00.000Z"),
      }),
    )
    expect(s.priceLabel).toContain("19")
    expect(s.priceLabel).toContain("/ mois")
    expect(s.headline).toBe("Simulations illimitées")
    expect(s.detail).toBe("Période en cours jusqu'au 25 octobre 2026")
    expect(s.showPortal).toBe(true)
    expect(s.showUpgrade).toBe(false)
  })
})
