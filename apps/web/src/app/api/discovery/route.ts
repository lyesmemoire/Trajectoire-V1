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
  buildDiscoveryFeed,
} from "@/lib/discovery/buildDiscoveryFeed"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

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

export async function GET(
  request: Request,
) {
  try {
    const user =
      await getAuthenticatedUser()

    if (!user) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        },
      )
    }

    const url =
      new URL(
        request.url,
      )

    const requestedStatus =
      url.searchParams.get(
        "status",
      )

    const status =
      requestedStatus === "LIVE" ||
      requestedStatus === "STALE" ||
      requestedStatus === "CLOSED"
        ? requestedStatus
        : null

    const jobs =
      await prisma.discoveredJob.findMany({
        where: {
          userId:
            user.id,

          ...(status
            ? {
                status,
              }
            : {}),
        },

        select: {
          id: true,
          opportunityId: true,
          provider: true,
          fingerprint: true,
          title: true,
          company: true,
          location: true,
          department: true,
          employmentType: true,
          workplaceType: true,
          description: true,
          sourceUrl: true,
          applyUrl: true,
          status: true,
          publishedAt: true,
          firstSeenAt: true,
          lastSeenAt: true,
        },

        orderBy: {
          lastSeenAt: "desc",
        },

        take: 1_000,
      })

    const clusters =
      buildDiscoveryFeed(
        jobs,
      )

    return NextResponse.json({
      clusters,

      summary: {
        clusters:
          clusters.length,

        sources:
          jobs.length,

        promoted:
          clusters.filter(
            (cluster) =>
              cluster.opportunityId !== null,
          ).length,

        highTrust:
          clusters.filter(
            (cluster) =>
              cluster.trust.band === "HIGH",
          ).length,
      },
    })
  }
  catch (error) {
    console.error(
      "[Discovery GET] Unexpected error:",
      error,
    )

    return NextResponse.json(
      {
        error:
          "Failed to load discovery feed",
      },
      {
        status: 500,
      },
    )
  }
}