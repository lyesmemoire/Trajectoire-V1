import {
  redirect,
} from "next/navigation"

import {
  prisma,
} from "@/lib/prisma"

import {
  createClient,
} from "@/lib/supabase/server"

import {
  buildDiscoveryFeed,
} from "@/lib/discovery/buildDiscoveryFeed"

import {
  DiscoveryFeed,
} from "@/components/discovery/DiscoveryFeed"

import {
  DiscoverySourcesPanel,
} from "@/components/discovery/DiscoverySourcesPanel"

export const dynamic =
  "force-dynamic"

export default async function DiscoveryPage() {
  const supabase =
    await createClient()

  const {
    data: {
      user,
    },
  } =
    await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const sources =
    await prisma.discoverySource.findMany({
      where: {
        userId:
          user.id,
      },

      orderBy: [
        {
          enabled:
            "desc",
        },
        {
          updatedAt:
            "desc",
        },
      ],
    })

  const jobs =
    await prisma.discoveredJob.findMany({
      where: {
        userId:
          user.id,
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
        lastSeenAt:
          "desc",
      },

      take:
        1_000,
    })

  const serializedSources =
    sources.map(
      (source) => ({
        id:
          source.id,

        provider:
          source.provider,

        company:
          source.company,

        boardKey:
          source.boardKey,

        enabled:
          source.enabled,

        lastSyncAt:
          source.lastSyncAt
            ?.toISOString() ??
          null,

        lastSyncStatus:
          source.lastSyncStatus,

        lastSyncError:
          source.lastSyncError,

        createdAt:
          source.createdAt
            .toISOString(),

        updatedAt:
          source.updatedAt
            .toISOString(),
      }),
    )

  const clusters =
    buildDiscoveryFeed(
      jobs,
    )

  const serialized =
    clusters.map(
      (cluster) => ({
        fingerprint:
          cluster.fingerprint,

        canonical: {
          ...cluster.canonical,

          publishedAt:
            cluster.canonical.publishedAt
              ?.toISOString() ??
            null,

          firstSeenAt:
            cluster.canonical.firstSeenAt
              .toISOString(),

          lastSeenAt:
            cluster.canonical.lastSeenAt
              .toISOString(),
        },

        sources:
          cluster.sources.map(
            (source) => ({
              ...source,

              publishedAt:
                source.publishedAt
                  ?.toISOString() ??
                null,

              firstSeenAt:
                source.firstSeenAt
                  .toISOString(),

              lastSeenAt:
                source.lastSeenAt
                  .toISOString(),
            }),
          ),

        sourceCount:
          cluster.sourceCount,

        providers:
          cluster.providers,

        opportunityId:
          cluster.opportunityId,

        trust:
          cluster.trust,
      }),
    )

  return (
    <>
      <DiscoveryFeed
        initialClusters={
          serialized
        }
      />

      <DiscoverySourcesPanel
        initialSources={
          serializedSources
        }
      />
    </>
  )
}