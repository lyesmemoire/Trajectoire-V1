import { describe, it, expect, vi } from "vitest"
import { SimulationService } from "./SimulationService"

/**
 * Régression : la fin de séance échouait en 409 pour toute séance (« Session was modified by another user »).
 * Le dépôt attend la version LUE en base ; Session.complete() / cancel() incrémentent la version en mémoire.
 */
function makeService(row: Record<string, unknown>) {
  const update = vi.fn().mockResolvedValue({})
  const repo = { findById: vi.fn().mockResolvedValue(row), update }
  const noop = vi.fn().mockResolvedValue(undefined)
  const logger = { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn(), setUserContext: vi.fn() }
  const service = new SimulationService(
    repo as never,
    {} as never,
    {} as never,
    { log: noop } as never,
    logger as never,
    {} as never,
  )
  return { service, update }
}

const row = (version: number) => ({
  id: "11111111-1111-4111-8111-111111111111",
  user_id: "u1",
  job_title: "Chargée de communication",
  level: "Confirmé",
  interview_type: "RH",
  duration_seconds: 900,
  status: "in_progress",
  started_at: new Date().toISOString(),
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  version,
})

describe("SimulationService : version attendue du verrou optimiste", () => {
  for (const version of [1, 2, 4]) {
    it(`endSession transmet la version lue en base (${version}), pas la version incrémentée`, async () => {
      const { service, update } = makeService(row(version))
      await service.endSession("11111111-1111-4111-8111-111111111111", "u1")
      expect(update).toHaveBeenCalledTimes(1)
      const [, updates] = update.mock.calls[0]
      expect(updates.version).toBe(version)
      expect(updates.status).toBe("completed")
    })
  }

  it("cancelSession transmet aussi la version lue en base", async () => {
    const { service, update } = makeService(row(3))
    await service.cancelSession("11111111-1111-4111-8111-111111111111", "u1")
    const [, updates] = update.mock.calls[0]
    expect(updates.version).toBe(3)
    expect(updates.status).toBe("cancelled")
  })
})
