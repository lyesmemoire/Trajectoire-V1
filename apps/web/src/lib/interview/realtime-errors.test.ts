import { describe, it, expect } from "vitest"
import {
  realtimeSessionErrorMessage,
  realtimeMicErrorMessage,
  REALTIME_DEFAULT_ERROR,
  REALTIME_MIC_DENIED,
  REALTIME_MIC_MISSING,
} from "./realtime-errors"
import {
  REALTIME_MAX_DURATION_MS,
  REALTIME_WARNING_MS,
  REALTIME_MODEL,
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

describe("configuration Realtime", () => {
  it("avertissement à 40 min, fin à 45 min, un seul modèle", () => {
    expect(REALTIME_WARNING_MS).toBe(40 * 60_000)
    expect(REALTIME_MAX_DURATION_MS).toBe(45 * 60_000)
    expect(REALTIME_WARNING_MS).toBeLessThan(REALTIME_MAX_DURATION_MS)
    expect(REALTIME_MODEL).toMatch(/realtime/)
  })
})
