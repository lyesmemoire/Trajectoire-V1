import {
  Prisma,
} from "@prisma/client"

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

type RouteContext = {
  params: Promise<{
    id: string
  }>
}

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

function toPrismaJson(
  value: Record<string, unknown>,
): Prisma.InputJsonValue {
  return JSON.parse(
    JSON.stringify(value),
  ) as Prisma.InputJsonValue
}

export async function POST(
  _request: Request,
  context: RouteContext,
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

    const {
      id,
    } =
      await context.params

    const selected =
      await prisma.discoveredJob.findFirst({
        where: {
          id,
          userId: user.id,
        },

        select: {
          id: true,
          fingerprint: true,
        },
      })

    if (!selected) {
      return NextResponse.json(
        {
          error:
            "Discovered job not found",
        },
        {
          status: 404,
        },
      )
    }

    const clusterJobs =
      await prisma.discoveredJob.findMany({
        where: {
          userId:
            user.id,

          fingerprint:
            selected.fingerprint,
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
      })

    const cluster =
      buildDiscoveryFeed(
        clusterJobs,
      )[0]

    if (!cluster) {
      return NextResponse.json(
        {
          error:
            "Discovery cluster not found",
        },
        {
          status: 404,
        },
      )
    }

    if (
      cluster.opportunityId
    ) {
      const existing =
        await prisma.opportunity.findFirst({
          where: {
            id:
              cluster.opportunityId,

            userId:
              user.id,
          },
        })

      if (existing) {
        return NextResponse.json({
          opportunity:
            existing,

          created: false,
          alreadyPromoted: true,
        })
      }
    }

    const hasPromotableSource =
      cluster.sources.some(
        (source) =>
          source.status !== "CLOSED",
      )

    if (!hasPromotableSource) {
      return NextResponse.json(
        {
          error:
            "Closed discovered jobs cannot be promoted",
        },
        {
          status: 409,
        },
      )
    }

    const result =
      await prisma.$transaction(
        async (tx) => {

          /*
           * Re-check the cluster inside the transaction.
           * This keeps sequential repeated promotion idempotent.
           */
          const linked =
            await tx.discoveredJob.findFirst({
              where: {
                userId:
                  user.id,

                fingerprint:
                  selected.fingerprint,

                opportunityId: {
                  not: null,
                },
              },

              select: {
                opportunityId: true,
              },
            })

          if (
            linked?.opportunityId
          ) {
            const existing =
              await tx.opportunity.findFirst({
                where: {
                  id:
                    linked.opportunityId,

                  userId:
                    user.id,
                },
              })

            if (existing) {
              return {
                opportunity:
                  existing,

                created:
                  false,
              }
            }
          }

          const canonical =
            cluster.canonical

          const metadata =
            toPrismaJson({
              discovery: {
                fingerprint:
                  cluster.fingerprint,

                trustScore:
                  cluster.trust.score,

                trustBand:
                  cluster.trust.band,

                trustReasons:
                  cluster.trust.reasons,

                providers:
                  cluster.providers,

                sourceCount:
                  cluster.sourceCount,

                canonicalDiscoveredJobId:
                  canonical.id,

                promotedAt:
                  new Date().toISOString(),
              },
            })

          const opportunity =
            await tx.opportunity.create({
              data: {
                userId:
                  user.id,

                title:
                  canonical.title,

                company:
                  canonical.company,

                location:
                  canonical.location,

                sourceUrl:
                  canonical.sourceUrl,

                source:
                  `DISCOVERY:${canonical.provider}`,

                description:
                  canonical.description,

                status:
                  "DISCOVERED",

                nextAction:
                  "Qualifier cette opportunité",

                metadata,
              },
            })

          await tx.discoveredJob.updateMany({
            where: {
              userId:
                user.id,

              fingerprint:
                selected.fingerprint,
            },

            data: {
              opportunityId:
                opportunity.id,
            },
          })

          return {
            opportunity,
            created: true,
          }
        },
      )

    return NextResponse.json(
      {
        opportunity:
          result.opportunity,

        created:
          result.created,

        alreadyPromoted:
          !result.created,

        discovery: {
          fingerprint:
            cluster.fingerprint,

          sourceCount:
            cluster.sourceCount,

          providers:
            cluster.providers,

          trust:
            cluster.trust,
        },
      },
      {
        status:
          result.created
            ? 201
            : 200,
      },
    )
  }
  catch (error) {
    console.error(
      "[Discovery promote POST] Unexpected error:",
      error,
    )

    return NextResponse.json(
      {
        error:
          "Failed to promote discovered job",
      },
      {
        status: 500,
      },
    )
  }
}