import {
  describe,
  expect,
  it,
} from "vitest"

import {
  decideDiscoveryLiveness,
  DISCOVERY_CLOSE_AFTER_MISSES,
} from "./liveness"

describe(
  "decideDiscoveryLiveness",
  () => {
    it(
      "keeps a seen job live and resets misses",
      () => {
        expect(
          decideDiscoveryLiveness({
            currentlySeen: true,
            previousStatus: "STALE",
            previousMissCount: 1,
          }),
        ).toEqual({
          status: "LIVE",
          missCount: 0,
          shouldClose: false,
        })
      },
    )

    it(
      "marks a job stale after its first missed scan",
      () => {
        expect(
          decideDiscoveryLiveness({
            currentlySeen: false,
            previousStatus: "LIVE",
            previousMissCount: 0,
          }),
        ).toEqual({
          status: "STALE",
          missCount: 1,
          shouldClose: false,
        })
      },
    )

    it(
      "closes a job after the configured missed scans",
      () => {
        expect(
          decideDiscoveryLiveness({
            currentlySeen: false,
            previousStatus: "STALE",
            previousMissCount:
              DISCOVERY_CLOSE_AFTER_MISSES - 1,
          }),
        ).toEqual({
          status: "CLOSED",
          missCount:
            DISCOVERY_CLOSE_AFTER_MISSES,
          shouldClose: true,
        })
      },
    )

    it(
      "does not reopen an already closed unseen job",
      () => {
        const decision =
          decideDiscoveryLiveness({
            currentlySeen: false,
            previousStatus: "CLOSED",
            previousMissCount: 4,
          })

        expect(
          decision.status,
        ).toBe("CLOSED")

        expect(
          decision.shouldClose,
        ).toBe(false)
      },
    )

    it(
      "reopens a closed job when it is seen again",
      () => {
        expect(
          decideDiscoveryLiveness({
            currentlySeen: true,
            previousStatus: "CLOSED",
            previousMissCount: 3,
          }),
        ).toEqual({
          status: "LIVE",
          missCount: 0,
          shouldClose: false,
        })
      },
    )
  },
)