import type {
  DiscoveryLivenessStatus,
} from "./liveness"

import type {
  DiscoveryProvider,
} from "./types"

import {
  scoreDiscoveryTrust,
} from "./trustScore"

export type DiscoveryFeedJob = {
  id: string
  opportunityId: string | null
  provider: DiscoveryProvider
  fingerprint: string
  title: string
  company: string
  location: string | null
  department: string | null
  employmentType: string | null
  workplaceType: string | null
  description: string
  sourceUrl: string
  applyUrl: string | null
  status: DiscoveryLivenessStatus
  publishedAt: Date | null
  firstSeenAt: Date
  lastSeenAt: Date
}

export type DiscoveryFeedCluster = {
  fingerprint: string
  canonical: DiscoveryFeedJob
  sources: DiscoveryFeedJob[]
  sourceCount: number
  providers: DiscoveryProvider[]
  opportunityId: string | null
  trust: ReturnType<typeof scoreDiscoveryTrust>
}

function canonicalQuality(
  job: DiscoveryFeedJob,
): number {
  let score =
    Math.min(
      job.description.length,
      10_000,
    )

  if (job.applyUrl) {
    score += 2_000
  }

  if (job.publishedAt) {
    score += 1_000
  }

  if (job.department) {
    score += 300
  }

  if (job.employmentType) {
    score += 300
  }

  if (job.workplaceType) {
    score += 300
  }

  if (job.status === "LIVE") {
    score += 4_000
  }
  else if (job.status === "STALE") {
    score += 1_000
  }

  return score
}

function selectCanonicalJob(
  jobs: DiscoveryFeedJob[],
): DiscoveryFeedJob {
  const canonical =
    [...jobs].sort(
      (left, right) => {
        const qualityDifference =
          canonicalQuality(right) -
          canonicalQuality(left)

        if (qualityDifference !== 0) {
          return qualityDifference
        }

        const seenDifference =
          right.lastSeenAt.getTime() -
          left.lastSeenAt.getTime()

        if (seenDifference !== 0) {
          return seenDifference
        }

        return left.id.localeCompare(
          right.id,
        )
      },
    )[0]

  if (!canonical) {
    throw new Error(
      "Cannot select canonical job from an empty discovery cluster.",
    )
  }

  return canonical
}

function clusterStatus(
  jobs: DiscoveryFeedJob[],
): DiscoveryLivenessStatus {
  if (
    jobs.some(
      (job) =>
        job.status === "LIVE",
    )
  ) {
    return "LIVE"
  }

  if (
    jobs.some(
      (job) =>
        job.status === "STALE",
    )
  ) {
    return "STALE"
  }

  return "CLOSED"
}

function latestSeenAt(
  jobs: DiscoveryFeedJob[],
): Date {
  return new Date(
    Math.max(
      ...jobs.map(
        (job) =>
          job.lastSeenAt.getTime(),
      ),
    ),
  )
}

function newestPublishedAt(
  jobs: DiscoveryFeedJob[],
): Date | null {
  const timestamps =
    jobs
      .map(
        (job) =>
          job.publishedAt?.getTime() ??
          null,
      )
      .filter(
        (
          value,
        ): value is number =>
          value !== null,
      )

  if (timestamps.length === 0) {
    return null
  }

  return new Date(
    Math.max(
      ...timestamps,
    ),
  )
}

export function buildDiscoveryFeed(
  jobs: DiscoveryFeedJob[],
  now = new Date(),
): DiscoveryFeedCluster[] {
  const grouped =
    new Map<
      string,
      DiscoveryFeedJob[]
    >()

  for (const job of jobs) {
    const sources =
      grouped.get(
        job.fingerprint,
      ) ?? []

    sources.push(job)

    grouped.set(
      job.fingerprint,
      sources,
    )
  }

  const clusters:
    DiscoveryFeedCluster[] = []

  for (
    const [
      fingerprint,
      sources,
    ] of grouped
  ) {
    const canonical =
      selectCanonicalJob(
        sources,
      )

    const providers =
      Array.from(
        new Set(
          sources.map(
            (source) =>
              source.provider,
          ),
        ),
      )

    const opportunityId =
      sources.find(
        (source) =>
          source.opportunityId !== null,
      )?.opportunityId ??
      null

    const status =
      clusterStatus(
        sources,
      )

    const trust =
      scoreDiscoveryTrust({
        status,
        providers,

        descriptionLength:
          canonical.description.length,

        hasApplyUrl:
          sources.some(
            (source) =>
              Boolean(
                source.applyUrl,
              ),
          ),

        publishedAt:
          newestPublishedAt(
            sources,
          ),

        lastSeenAt:
          latestSeenAt(
            sources,
          ),

        now,
      })

    clusters.push({
      fingerprint,
      canonical,
      sources,
      sourceCount:
        sources.length,
      providers,
      opportunityId,
      trust,
    })
  }

  return clusters.sort(
    (left, right) => {
      const trustDifference =
        right.trust.score -
        left.trust.score

      if (trustDifference !== 0) {
        return trustDifference
      }

      return (
        right.canonical.lastSeenAt.getTime() -
        left.canonical.lastSeenAt.getTime()
      )
    },
  )
}