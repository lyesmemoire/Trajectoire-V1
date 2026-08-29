import {
  Prisma,
} from "@prisma/client"

import type {
  DiscoveryProvider,
} from "./types"

import {
  fetchDiscoveryJobs,
} from "./connectors"

import {
  decideDiscoveryLiveness,
} from "./liveness"

import {
  prisma,
} from "@/lib/prisma"

export type DiscoveryIngestionInput = {
  userId: string
  provider: DiscoveryProvider
  company: string
  boardKey: string
}

export type DiscoveryIngestionResult = {
  provider: DiscoveryProvider
  company: string
  boardKey: string
  fetched: number
  normalized: number
  rejected: number
  created: number
  updated: number
  stale: number
  closed: number
  reopened: number
}

type JsonRecord =
  Record<string, unknown>

function toPrismaJson(
  value: JsonRecord,
): Prisma.InputJsonValue {
  return JSON.parse(
    JSON.stringify(value),
  ) as Prisma.InputJsonValue
}

function asJsonRecord(
  value: Prisma.JsonValue | null,
): JsonRecord {
  if (
    typeof value !== "object" ||
    value === null ||
    Array.isArray(value)
  ) {
    return {}
  }

  return {
    ...value,
  }
}

function readMissCount(
  metadata: Prisma.JsonValue | null,
): number {
  const record =
    asJsonRecord(metadata)

  const value =
    record.discoveryMissCount

  if (
    typeof value !== "number" ||
    !Number.isFinite(value)
  ) {
    return 0
  }

  return Math.max(
    0,
    Math.floor(value),
  )
}

function withLivenessMetadata(
  metadata: Prisma.JsonValue | null,
  missCount: number,
  checkedAt: Date,
): Prisma.InputJsonValue {
  const record =
    asJsonRecord(metadata)

  return toPrismaJson({
    ...record,

    discoveryMissCount:
      missCount,

    discoveryLastCheckedAt:
      checkedAt.toISOString(),
  })
}

export async function ingestDiscoveryJobs({
  userId,
  provider,
  company,
  boardKey,
}: DiscoveryIngestionInput): Promise<DiscoveryIngestionResult> {
  const cleanUserId =
    userId.trim()

  if (!cleanUserId) {
    throw new Error(
      "Discovery ingestion requires a user.",
    )
  }

  /*
   * Critical invariant:
   * fetchDiscoveryJobs must complete successfully before
   * any unseen job can become STALE/CLOSED.
   *
   * A provider/network failure therefore cannot close jobs.
   */
  const connector =
    await fetchDiscoveryJobs({
      provider,
      company,
      boardKey,
    })

  const checkedAt =
    new Date()

  const seenSourceKeys =
    new Set(
      connector.jobs.map(
        (job) => job.sourceKey,
      ),
    )

  const previousJobs =
    await prisma.discoveredJob.findMany({
      where: {
        userId:
          cleanUserId,

        provider,
        boardKey,
      },

      select: {
        id:
          true,

        sourceKey:
          true,

        status:
          true,

        metadata:
          true,
      },
    })

  const previousBySourceKey =
    new Map(
      previousJobs.map(
        (job) => [
          job.sourceKey,
          job,
        ],
      ),
    )

  let created = 0
  let updated = 0
  let stale = 0
  let closed = 0
  let reopened = 0

  for (const job of connector.jobs) {
    const rawPayload =
      toPrismaJson(
        job.rawPayload,
      )

    const previous =
      previousBySourceKey.get(
        job.sourceKey,
      )

    const wasClosed =
      previous?.status === "CLOSED"

    const metadata =
      withLivenessMetadata(
        previous?.metadata ?? null,
        0,
        checkedAt,
      )

    if (previous) {
      await prisma.discoveredJob.update({
        where: {
          id:
            previous.id,
        },

        data: {
          externalId:
            job.externalId,

          boardKey:
            job.boardKey,

          title:
            job.title,

          company:
            job.company,

          location:
            job.location,

          department:
            job.department,

          employmentType:
            job.employmentType,

          workplaceType:
            job.workplaceType,

          description:
            job.description,

          sourceUrl:
            job.sourceUrl,

          applyUrl:
            job.applyUrl,

          fingerprint:
            job.fingerprint,

          status:
            "LIVE",

          publishedAt:
            job.publishedAt,

          lastSeenAt:
            checkedAt,

          closedAt:
            null,

          rawPayload,
          metadata,
        },
      })

      updated += 1

      if (wasClosed) {
        reopened += 1
      }

      continue
    }

    await prisma.discoveredJob.create({
      data: {
        userId:
          cleanUserId,

        provider:
          job.provider,

        sourceKey:
          job.sourceKey,

        externalId:
          job.externalId,

        boardKey:
          job.boardKey,

        title:
          job.title,

        company:
          job.company,

        location:
          job.location,

        department:
          job.department,

        employmentType:
          job.employmentType,

        workplaceType:
          job.workplaceType,

        description:
          job.description,

        sourceUrl:
          job.sourceUrl,

        applyUrl:
          job.applyUrl,

        fingerprint:
          job.fingerprint,

        status:
          "LIVE",

        publishedAt:
          job.publishedAt,

        lastSeenAt:
          checkedAt,

        rawPayload,

        metadata:
          withLivenessMetadata(
            null,
            0,
            checkedAt,
          ),
      },
    })

    created += 1
  }

  for (const previous of previousJobs) {
    if (
      seenSourceKeys.has(
        previous.sourceKey,
      )
    ) {
      continue
    }

    const previousMissCount =
      readMissCount(
        previous.metadata,
      )

    const decision =
      decideDiscoveryLiveness({
        currentlySeen:
          false,

        previousStatus:
          previous.status,

        previousMissCount,
      })

    if (
      previous.status === "CLOSED" &&
      decision.status === "CLOSED"
    ) {
      continue
    }

    await prisma.discoveredJob.update({
      where: {
        id:
          previous.id,
      },

      data: {
        status:
          decision.status,

        closedAt:
          decision.shouldClose
            ? checkedAt
            : undefined,

        metadata:
          withLivenessMetadata(
            previous.metadata,
            decision.missCount,
            checkedAt,
          ),
      },
    })

    if (
      decision.status === "STALE"
    ) {
      stale += 1
    }

    if (
      decision.shouldClose
    ) {
      closed += 1
    }
  }

  return {
    provider:
      connector.provider,

    company:
      connector.company,

    boardKey:
      connector.boardKey,

    fetched:
      connector.rawCount,

    normalized:
      connector.jobs.length,

    rejected:
      connector.rejectedCount,

    created,
    updated,
    stale,
    closed,
    reopened,
  }
}