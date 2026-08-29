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

export async function POST(
  _request: Request,
  context: RouteContext,
) {
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

  const {
    id,
  } =
    await context.params

  const source =
    await prisma.discoverySource.findFirst({
      where: {
        id,
        userId:
          user.id,
      },
    })

  if (!source) {
    return NextResponse.json(
      {
        error:
          "Discovery source not found",
      },
      {
        status: 404,
      },
    )
  }

  if (!source.enabled) {
    return NextResponse.json(
      {
        error:
          "Discovery source is disabled",
      },
      {
        status: 409,
      },
    )
  }

  if (
    source.provider ===
    "OTHER"
  ) {
    return NextResponse.json(
      {
        error:
          "This discovery provider cannot be synchronized automatically",
      },
      {
        status: 400,
      },
    )
  }

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

    const updatedSource =
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

    return NextResponse.json({
      source:
        updatedSource,

      result,
    })
  }
  catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Discovery synchronization failed"

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

    console.error(
      "[Discovery source sync POST] Failed:",
      error,
    )

    return NextResponse.json(
      {
        error:
          "Discovery synchronization failed",
      },
      {
        status: 502,
      },
    )
  }
}