import {
  NextResponse,
} from "next/server"

import {
  prisma,
} from "@/lib/prisma"

import {
  createClient,
} from "@/lib/supabase/server"

import {
  ingestDiscoveryJobs,
} from "@/lib/discovery/ingestDiscoveryJobs"

export const runtime =
  "nodejs"

export const dynamic =
  "force-dynamic"

async function getAuthenticatedUser() {
  const supabase =
    await createClient()

  const {
    data: {
      user,
    },
    error,
  } =
    await supabase.auth.getUser()

  if (
    error ||
    !user
  ) {
    return null
  }

  return user
}

export async function POST() {
  const user =
    await getAuthenticatedUser()

  if (!user) {
    return NextResponse.json(
      {
        error:
          "Unauthorized",
      },
      {
        status: 401,
      },
    )
  }

  const sources =
    await prisma.discoverySource.findMany({
      where: {
        userId:
          user.id,

        enabled:
          true,

        provider: {
          in: [
            "GREENHOUSE",
            "LEVER",
            "ASHBY",
          ],
        },
      },

      orderBy: {
        updatedAt:
          "desc",
      },
    })

  if (
    sources.length === 0
  ) {
    return NextResponse.json({
      total:
        0,

      succeeded:
        0,

      failed:
        0,

      created:
        0,

      updated:
        0,

      stale:
        0,

      closed:
        0,

      reopened:
        0,

      results: [],
    })
  }

  const results = []

  let succeeded = 0
  let failed = 0
  let created = 0
  let updated = 0
  let stale = 0
  let closed = 0
  let reopened = 0

  for (const source of sources) {
    const checkedAt =
      new Date()

    try {
      const result =
        await ingestDiscoveryJobs({
          userId:
            user.id,

          provider:
            source.provider,

          company:
            source.company,

          boardKey:
            source.boardKey,
        })

      await prisma.discoverySource.update({
        where: {
          id:
            source.id,
        },

        data: {
          lastSyncAt:
            checkedAt,

          lastSyncStatus:
            "SUCCESS",

          lastSyncError:
            null,
        },
      })

      succeeded += 1
      created += result.created
      updated += result.updated
      stale += result.stale
      closed += result.closed
      reopened += result.reopened

      results.push({
        sourceId:
          source.id,

        company:
          source.company,

        provider:
          source.provider,

        ok:
          true,

        result,
      })
    }
    catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Discovery synchronization failed"

      failed += 1

      await prisma.discoverySource.update({
        where: {
          id:
            source.id,
        },

        data: {
          lastSyncAt:
            checkedAt,

          lastSyncStatus:
            "ERROR",

          lastSyncError:
            message.slice(
              0,
              1_000,
            ),
        },
      })

      results.push({
        sourceId:
          source.id,

        company:
          source.company,

        provider:
          source.provider,

        ok:
          false,

        error:
          message,
      })
    }
  }

  return NextResponse.json({
    total:
      sources.length,

    succeeded,
    failed,
    created,
    updated,
    stale,
    closed,
    reopened,
    results,
  })
}