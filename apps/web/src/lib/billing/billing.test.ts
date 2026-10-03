import { describe, it, expect, vi, afterEach } from "vitest"
import { PAID_PLANS, buildCheckoutReturnUrls, parsePaidPlan } from "./checkout-plan"
import { resolvePaymentStatus } from "./resolve-payment-status"
import { pollUntil } from "./poll-until"

describe("parsePaidPlan", () => {
  it("accepte PACK et PRO, rien d'autre (FREE, minuscules, vide, non-texte)", () => {
    expect(PAID_PLANS).toEqual(["PACK", "PRO"])
    expect(parsePaidPlan("PACK")).toBe("PACK")
    expect(parsePaidPlan("PRO")).toBe("PRO")
    for (const bad of ["FREE", "pack", "", " PRO", "ADMIN", null, undefined, 42, ["PACK"]]) {
      expect(parsePaidPlan(bad)).toBeNull()
    }
  })
})

describe("buildCheckoutReturnUrls", () => {
  it("succès vers /billing/success avec le plan, annulation vers /pricing ; barre finale ignorée", () => {
    expect(buildCheckoutReturnUrls("https://app.example.test", "PACK")).toEqual({
      successUrl: "https://app.example.test/billing/success?plan=PACK",
      cancelUrl: "https://app.example.test/pricing?checkout=cancelled",
    })
    expect(buildCheckoutReturnUrls("https://app.example.test//", "PRO").successUrl).toBe("https://app.example.test/billing/success?plan=PRO")
  })
})

describe("resolvePaymentStatus", () => {
  it("FREE : toujours en attente (aucun faux succès), quel que soit l'indice de l'adresse", () => {
    for (const expected of [null, "PACK", "PRO"] as const) {
      expect(resolvePaymentStatus({ expected, effectivePlan: "FREE" })).toBe("pending")
    }
  })

  it("Pack attendu (ou indice absent) : un plan payant suffit", () => {
    expect(resolvePaymentStatus({ expected: "PACK", effectivePlan: "PACK" })).toBe("activated")
    expect(resolvePaymentStatus({ expected: "PACK", effectivePlan: "PRO" })).toBe("activated")
    expect(resolvePaymentStatus({ expected: null, effectivePlan: "PACK" })).toBe("activated")
  })

  it("Pro attendu : en attente tant que le plan effectif n'est pas PRO (porteur de Pack qui passe à Pro)", () => {
    expect(resolvePaymentStatus({ expected: "PRO", effectivePlan: "PACK" })).toBe("pending")
    expect(resolvePaymentStatus({ expected: "PRO", effectivePlan: "PRO" })).toBe("activated")
  })
})

describe("pollUntil", () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it("valeur trouvée au 3e essai : intervalle respecté, résultat renvoyé", async () => {
    vi.useFakeTimers()
    const check = vi.fn<() => Promise<string | null>>().mockResolvedValueOnce(null).mockResolvedValueOnce(null).mockResolvedValueOnce("ok")
    const promise = pollUntil(check, { intervalMs: 2000, timeoutMs: 30000 })
    await vi.advanceTimersByTimeAsync(4000)
    expect(await promise).toEqual({ kind: "value", value: "ok" })
    expect(check).toHaveBeenCalledTimes(3)
  })

  it("délai dépassé : nombre d'essais borné (timeout / intervalle + 1), résultat « timeout »", async () => {
    vi.useFakeTimers()
    const check = vi.fn<() => Promise<string | null>>().mockResolvedValue(null)
    const promise = pollUntil(check, { intervalMs: 2000, timeoutMs: 30000 })
    await vi.advanceTimersByTimeAsync(40000)
    expect(await promise).toEqual({ kind: "timeout" })
    expect(check).toHaveBeenCalledTimes(16)
  })

  it("une erreur réseau compte comme « pas encore » et ne casse pas la boucle", async () => {
    vi.useFakeTimers()
    const check = vi.fn<() => Promise<string | null>>().mockRejectedValueOnce(new Error("réseau")).mockResolvedValueOnce("ok")
    const promise = pollUntil(check, { intervalMs: 1000, timeoutMs: 5000 })
    await vi.advanceTimersByTimeAsync(1000)
    expect(await promise).toEqual({ kind: "value", value: "ok" })
  })

  it("annulation (démontage) : arrêt immédiat, plus aucun appel", async () => {
    vi.useFakeTimers()
    const controller = new AbortController()
    const check = vi.fn<() => Promise<string | null>>().mockResolvedValue(null)
    const promise = pollUntil(check, { intervalMs: 2000, timeoutMs: 30000, signal: controller.signal })
    await vi.advanceTimersByTimeAsync(2000)
    const callsBefore = check.mock.calls.length
    controller.abort()
    await vi.advanceTimersByTimeAsync(10000)
    expect(await promise).toEqual({ kind: "aborted" })
    expect(check.mock.calls.length).toBe(callsBefore)
  })

  it("signal déjà annulé au départ : aucun appel", async () => {
    const controller = new AbortController()
    controller.abort()
    const check = vi.fn<() => Promise<string | null>>().mockResolvedValue("ok")
    expect(await pollUntil(check, { intervalMs: 1000, timeoutMs: 5000, signal: controller.signal })).toEqual({ kind: "aborted" })
    expect(check).not.toHaveBeenCalled()
  })
})
