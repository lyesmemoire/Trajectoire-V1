import { describe, it, expect } from "vitest"
import {
  realtimeSessionErrorMessage,
  realtimeMicErrorMessage,
  REALTIME_DEFAULT_ERROR,
  REALTIME_MIC_DENIED,
  REALTIME_MIC_MISSING,
} from "./realtime-errors"
import {
  REALTIME_CALLS_URL,
  REALTIME_CLIENT_SECRETS_URL,
  REALTIME_END_GRACE_SECONDS,
  REALTIME_MAX_DURATION_MS,
  REALTIME_MODEL,
  REALTIME_VOICE,
  REALTIME_WRAP_UP_SECONDS,
  realtimeTimeline,
} from "./realtime-config"

describe("realtimeSessionErrorMessage", () => {
  it("donne un message français précis pour chaque statut de la route", () => {
    for (const status of [400, 401, 404, 409, 429, 502, 503]) {
      const msg = realtimeSessionErrorMessage(status)
      expect(msg).not.toBe(REALTIME_DEFAULT_ERROR)
      expect(msg).not.toMatch(/token|Realtime|SDP/i)
    }
    expect(realtimeSessionErrorMessage(409)).toMatch(/terminée/)
    expect(realtimeSessionErrorMessage(429)).toMatch(/Patientez/)
  })

  it("statut inconnu : message par défaut", () => {
    expect(realtimeSessionErrorMessage(500)).toBe(REALTIME_DEFAULT_ERROR)
  })
})

describe("realtimeMicErrorMessage", () => {
  it("distingue refus et absence de micro", () => {
    expect(realtimeMicErrorMessage({ name: "NotAllowedError" })).toBe(REALTIME_MIC_DENIED)
    expect(realtimeMicErrorMessage({ name: "NotFoundError" })).toBe(REALTIME_MIC_MISSING)
  })

  it("autre erreur : null (le message par défaut s'applique)", () => {
    expect(realtimeMicErrorMessage(new Error("x"))).toBeNull()
    expect(realtimeMicErrorMessage(null)).toBeNull()
  })
})

describe("configuration Realtime (API GA)", () => {
  it("points d'entrée et modèle de l'API actuelle (plus de modèle preview ni d'interface beta)", () => {
    expect(REALTIME_CLIENT_SECRETS_URL).toBe("https://api.openai.com/v1/realtime/client_secrets")
    expect(REALTIME_CALLS_URL).toBe("https://api.openai.com/v1/realtime/calls")
    expect(REALTIME_MODEL).toMatch(/^gpt-realtime-\d/)
    expect(REALTIME_MODEL).not.toMatch(/preview/)
    expect(REALTIME_VOICE).toBe("marin")
  })
})

describe("realtimeTimeline : chronologie pilotée par la durée choisie", () => {
  it("15 min : consigne de clôture à 13 min, fin automatique à 16 min 30", () => {
    const { wrapUpAtMs, endAtMs } = realtimeTimeline(15 * 60)
    expect(wrapUpAtMs).toBe((15 * 60 - REALTIME_WRAP_UP_SECONDS) * 1000)
    expect(endAtMs).toBe((15 * 60 + REALTIME_END_GRACE_SECONDS) * 1000)
  })

  it("la clôture précède toujours la fin, même pour une durée très courte", () => {
    for (const s of [60, 120, 300, 1800]) {
      const { wrapUpAtMs, endAtMs } = realtimeTimeline(s)
      expect(wrapUpAtMs).toBeGreaterThanOrEqual(0)
      expect(wrapUpAtMs).toBeLessThan(endAtMs)
    }
  })

  it("durée absente ou invalide : 15 minutes par défaut", () => {
    expect(realtimeTimeline(undefined)).toEqual(realtimeTimeline(15 * 60))
    expect(realtimeTimeline(Number.NaN)).toEqual(realtimeTimeline(15 * 60))
    expect(realtimeTimeline(-5)).toEqual(realtimeTimeline(15 * 60))
  })

  it("plafond absolu de 45 minutes, quelle que soit la durée", () => {
    expect(realtimeTimeline(3 * 3600).endAtMs).toBe(REALTIME_MAX_DURATION_MS)
    expect(REALTIME_MAX_DURATION_MS).toBe(45 * 60_000)
  })
})
