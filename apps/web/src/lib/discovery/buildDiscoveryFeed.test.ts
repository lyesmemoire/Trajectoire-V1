import {
  describe,
  expect,
  it,
} from "vitest"

import {
  buildDiscoveryFeed,
} from "./buildDiscoveryFeed"

import type {
  DiscoveryFeedJob,
} from "./buildDiscoveryFeed"

const NOW =
  new Date(
    "2026-08-28T12:00:00.000Z",
  )

function job(
  overrides:
    Partial<DiscoveryFeedJob> = {},
): DiscoveryFeedJob {
  return {
    id: "job-1",
    opportunityId: null,
    provider: "GREENHOUSE",
    fingerprint: "fingerprint-a",
    title: "Senior Product Manager",
    company: "Acme",
    location: "Paris",
    department: null,
    employmentType: null,
    workplaceType: null,

    description:
      "A".repeat(1_500),

    sourceUrl:
      "https://example.com/job",

    applyUrl:
      "https://example.com/apply",

    status: "LIVE",

    publishedAt:
      new Date(
        "2026-08-27T12:00:00.000Z",
      ),

    firstSeenAt:
      new Date(
        "2026-08-27T12:00:00.000Z",
      ),

    lastSeenAt:
      NOW,

    ...overrides,
  }
}

describe(
  "buildDiscoveryFeed",
  () => {

    it(
      "clusters cross-provider duplicates",
      () => {
        const feed =
          buildDiscoveryFeed(
            [
              job({
                id: "greenhouse",
                provider: "GREENHOUSE",
              }),

              job({
                id: "lever",
                provider: "LEVER",
              }),
            ],
            NOW,
          )

        expect(feed).toHaveLength(1)
        expect(feed[0].sourceCount).toBe(2)

        expect(
          feed[0].providers,
        ).toEqual([
          "GREENHOUSE",
          "LEVER",
        ])

        expect(
          feed[0].trust.signals
            .providerAgreement,
        ).toBe(14)
      },
    )

    it(
      "selects the richest canonical source",
      () => {
        const feed =
          buildDiscoveryFeed(
            [
              job({
                id: "short",
                description: "Short",
                applyUrl: null,
              }),

              job({
                id: "rich",
                provider: "ASHBY",

                description:
                  "A".repeat(3_000),

                department:
                  "Product",

                employmentType:
                  "Full-time",
              }),
            ],
            NOW,
          )

        expect(
          feed[0].canonical.id,
        ).toBe("rich")
      },
    )

    it(
      "uses LIVE when any source remains live",
      () => {
        const feed =
          buildDiscoveryFeed(
            [
              job({
                id: "stale",
                status: "STALE",
              }),

              job({
                id: "live",
                provider: "LEVER",
                status: "LIVE",
              }),
            ],
            NOW,
          )

        expect(
          feed[0].trust.signals
            .liveness,
        ).toBe(35)
      },
    )

    it(
      "exposes an existing opportunity link",
      () => {
        const feed =
          buildDiscoveryFeed(
            [
              job({
                id: "one",
              }),

              job({
                id: "two",
                provider: "LEVER",

                opportunityId:
                  "opp-123",
              }),
            ],
            NOW,
          )

        expect(
          feed[0].opportunityId,
        ).toBe("opp-123")
      },
    )

    it(
      "supports OTHER persisted provider",
      () => {
        const feed =
          buildDiscoveryFeed(
            [
              job({
                id: "other",
                provider: "OTHER",
              }),
            ],
            NOW,
          )

        expect(
          feed[0].providers,
        ).toEqual([
          "OTHER",
        ])
      },
    )

    it(
      "sorts clusters by trust score",
      () => {
        const feed =
          buildDiscoveryFeed(
            [
              job({
                id: "weak",
                fingerprint: "weak",
                description: "Tiny",
                applyUrl: null,
                status: "STALE",
                publishedAt: null,

                lastSeenAt:
                  new Date(
                    "2026-07-01T00:00:00.000Z",
                  ),
              }),

              job({
                id: "strong",
                fingerprint: "strong",

                description:
                  "A".repeat(3_000),
              }),
            ],
            NOW,
          )

        expect(
          feed[0].fingerprint,
        ).toBe("strong")
      },
    )
  },
)