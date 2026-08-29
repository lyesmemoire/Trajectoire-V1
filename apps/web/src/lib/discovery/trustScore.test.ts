import {
  describe,
  expect,
  it,
} from "vitest"

import {
  scoreDiscoveryTrust,
} from "./trustScore"

const NOW =
  new Date(
    "2026-08-28T12:00:00.000Z",
  )

describe(
  "scoreDiscoveryTrust",
  () => {
    it(
      "gives a strong score to a fresh multi-provider live job",
      () => {
        const result =
          scoreDiscoveryTrust({
            status:
              "LIVE",

            providers: [
              "GREENHOUSE",
              "LEVER",
              "ASHBY",
            ],

            descriptionLength:
              2_500,

            hasApplyUrl:
              true,

            publishedAt:
              new Date(
                "2026-08-26T12:00:00.000Z",
              ),

            lastSeenAt:
              new Date(
                "2026-08-28T10:00:00.000Z",
              ),

            now:
              NOW,
          })

        expect(
          result.score,
        ).toBe(100)

        expect(
          result.band,
        ).toBe("HIGH")

        expect(
          result.signals.providerAgreement,
        ).toBe(20)
      },
    )

    it(
      "does not double count the same provider",
      () => {
        const result =
          scoreDiscoveryTrust({
            status:
              "LIVE",

            providers: [
              "LEVER",
              "LEVER",
              "LEVER",
            ],

            descriptionLength:
              1_000,

            hasApplyUrl:
              true,

            publishedAt:
              NOW,

            lastSeenAt:
              NOW,

            now:
              NOW,
          })

        expect(
          result.signals.providerAgreement,
        ).toBe(6)
      },
    )

    it(
      "penalizes a stale offer",
      () => {
        const live =
          scoreDiscoveryTrust({
            status:
              "LIVE",

            providers: [
              "GREENHOUSE",
            ],

            descriptionLength:
              1_000,

            hasApplyUrl:
              true,

            publishedAt:
              NOW,

            lastSeenAt:
              NOW,

            now:
              NOW,
          })

        const stale =
          scoreDiscoveryTrust({
            status:
              "STALE",

            providers: [
              "GREENHOUSE",
            ],

            descriptionLength:
              1_000,

            hasApplyUrl:
              true,

            publishedAt:
              NOW,

            lastSeenAt:
              NOW,

            now:
              NOW,
          })

        expect(
          stale.score,
        ).toBeLessThan(
          live.score,
        )
      },
    )

    it(
      "marks closed offers untrusted",
      () => {
        const result =
          scoreDiscoveryTrust({
            status:
              "CLOSED",

            providers: [
              "GREENHOUSE",
              "LEVER",
              "ASHBY",
            ],

            descriptionLength:
              4_000,

            hasApplyUrl:
              true,

            publishedAt:
              NOW,

            lastSeenAt:
              NOW,

            now:
              NOW,
          })

        expect(
          result.band,
        ).toBe("UNTRUSTED")

        expect(
          result.signals.liveness,
        ).toBe(0)
      },
    )

    it(
      "penalizes old low-information postings",
      () => {
        const result =
          scoreDiscoveryTrust({
            status:
              "LIVE",

            providers: [
              "ASHBY",
            ],

            descriptionLength:
              100,

            hasApplyUrl:
              false,

            publishedAt:
              new Date(
                "2026-01-01T00:00:00.000Z",
              ),

            lastSeenAt:
              new Date(
                "2026-08-01T00:00:00.000Z",
              ),

            now:
              NOW,
          })

        expect(
          result.score,
        ).toBeLessThan(50)

        expect(
          result.band,
        ).toBe("LOW")
      },
    )

    it(
      "returns explainable signal totals",
      () => {
        const result =
          scoreDiscoveryTrust({
            status:
              "LIVE",

            providers: [
              "GREENHOUSE",
              "LEVER",
            ],

            descriptionLength:
              1_500,

            hasApplyUrl:
              true,

            publishedAt:
              new Date(
                "2026-08-20T12:00:00.000Z",
              ),

            lastSeenAt:
              NOW,

            now:
              NOW,
          })

        const total =
          result.signals.liveness +
          result.signals.providerAgreement +
          result.signals.recency +
          result.signals.completeness +
          result.signals.applyPath

        expect(
          result.score,
        ).toBe(total)

        expect(
          result.reasons.length,
        ).toBeGreaterThan(0)
      },
    )
  },
)