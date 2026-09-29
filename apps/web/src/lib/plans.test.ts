import { describe, it, expect } from "vitest"
import {
  PLANS,
  canFullCVAnalysis,
  canSimulate,
  computePackExpiry,
  getEffectivePlanId,
  getPlan,
  getRemainingSimulations,
  isExpired,
  type PlanUser,
} from "./plans"

const NOW = new Date("2026-10-01T12:00:00.000Z")
const DAY = 24 * 3600 * 1000
const user = (over: Partial<PlanUser> = {}): PlanUser => ({
  plan: "FREE",
  simulationsUsed: 0,
  packExpiresAt: null,
  ...over,
})

describe("grille PLANS", () => {
  it("respecte la grille validée", () => {
    expect(PLANS.FREE).toMatchObject({ price: 0, simulationLimit: 0, cvAnalysis: "preview", cvPreviewRemarksMax: 3 })
    expect(PLANS.PACK).toMatchObject({ price: 29, interval: "one_time", simulationLimit: 5, simulationExpiry: { months: 3 }, highlighted: true })
    expect(PLANS.PRO).toMatchObject({ price: 19, interval: "month", simulationLimit: null, cvAnalysis: "full" })
    expect(getPlan("PACK")).toBe(PLANS.PACK)
  })
})

describe("droits par plan", () => {
  it("FREE : aucune simulation, aperçu CV seulement", () => {
    expect(canSimulate(user(), NOW)).toBe(false)
    expect(getRemainingSimulations(user(), NOW)).toBe(0)
    expect(canFullCVAnalysis(user(), NOW)).toBe(false)
  })

  it("PACK actif : simulations restantes, jamais négatives", () => {
    const pack = user({ plan: "PACK", simulationsUsed: 3, packExpiresAt: new Date(NOW.getTime() + DAY) })
    expect(getRemainingSimulations(pack, NOW)).toBe(2)
    expect(canSimulate(pack, NOW)).toBe(true)
    expect(canFullCVAnalysis(pack, NOW)).toBe(true)
    expect(getRemainingSimulations({ ...pack, simulationsUsed: 9 }, NOW)).toBe(0)
  })

  it("PACK expiré : retombe sur FREE", () => {
    const pack = user({ plan: "PACK", simulationsUsed: 0, packExpiresAt: new Date(NOW.getTime() - DAY) })
    expect(isExpired(pack, NOW)).toBe(true)
    expect(getEffectivePlanId(pack, NOW)).toBe("FREE")
    expect(canSimulate(pack, NOW)).toBe(false)
    expect(canFullCVAnalysis(pack, NOW)).toBe(false)
  })

  it("PACK sans date d'expiration : jamais considéré expiré", () => {
    expect(isExpired(user({ plan: "PACK" }), NOW)).toBe(false)
  })

  it("accepte une date ISO", () => {
    const pack = user({ plan: "PACK", packExpiresAt: "2026-09-01T00:00:00.000Z" })
    expect(isExpired(pack, NOW)).toBe(true)
  })

  it("PRO : illimité (null), seul PACK expire", () => {
    const pro = user({ plan: "PRO", simulationsUsed: 999 })
    expect(getRemainingSimulations(pro, NOW)).toBeNull()
    expect(canSimulate(pro, NOW)).toBe(true)
    expect(isExpired({ ...pro, packExpiresAt: new Date(0) }, NOW)).toBe(false)
  })
})

describe("computePackExpiry", () => {
  it("ajoute 3 mois pour PACK", () => {
    const from = new Date(2026, 0, 15, 10, 0, 0)
    expect(computePackExpiry("PACK", from)).toEqual(new Date(2026, 3, 15, 10, 0, 0))
  })

  it("renvoie null pour les plans qui n'expirent pas", () => {
    expect(computePackExpiry("PRO", NOW)).toBeNull()
    expect(computePackExpiry("FREE", NOW)).toBeNull()
  })
})
