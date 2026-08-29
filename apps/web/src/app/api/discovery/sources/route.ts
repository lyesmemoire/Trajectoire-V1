import {
  NextResponse,
} from "next/server"

import {
  prisma,
} from "@/lib/prisma"

import {
  createClient,
} from "@/lib/supabase/server"

export const runtime =
  "nodejs"

export const dynamic =
  "force-dynamic"

const AUTOMATIC_PROVIDERS = [
  "GREENHOUSE",
  "LEVER",
  "ASHBY",
] as const

type AutomaticProvider =
  (typeof AUTOMATIC_PROVIDERS)[number]

function isAutomaticProvider(
  value: unknown,
): value is AutomaticProvider {
  return (
    typeof value === "string" &&
    AUTOMATIC_PROVIDERS.includes(
      value as AutomaticProvider,
    )
  )
}

function cleanString(
  value: unknown,
): string {
  return typeof value === "string"
    ? value.trim()
    : ""
}

function isValidBoardKey(
  value: string,
): boolean {
  return /^[a-zA-Z0-9_-]{1,120}$/.test(
    value,
  )
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

export async function GET() {
  try {
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

    return NextResponse.json({
      sources,
    })
  }
  catch (error) {
    console.error(
      "[Discovery sources GET] Unexpected error:",
      error,
    )

    return NextResponse.json(
      {
        error:
          "Failed to load discovery sources",
      },
      {
        status: 500,
      },
    )
  }
}

export async function POST(
  request: Request,
) {
  try {
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

    const body =
      (await request.json()) as {
        provider?: unknown
        company?: unknown
        boardKey?: unknown
      }

    const provider =
      body.provider

    const company =
      cleanString(
        body.company,
      )

    const boardKey =
      cleanString(
        body.boardKey,
      )

    if (
      !isAutomaticProvider(
        provider,
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Unsupported discovery provider",
        },
        {
          status: 400,
        },
      )
    }

    if (!company) {
      return NextResponse.json(
        {
          error:
            "Company is required",
        },
        {
          status: 400,
        },
      )
    }

    if (
      !isValidBoardKey(
        boardKey,
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid board key",
        },
        {
          status: 400,
        },
      )
    }

    const source =
      await prisma.discoverySource.upsert({
        where: {
          userId_provider_boardKey: {
            userId:
              user.id,

            provider,
            boardKey,
          },
        },

        create: {
          userId:
            user.id,

          provider,
          company,
          boardKey,
          enabled:
            true,
        },

        update: {
          company,
          enabled:
            true,
          lastSyncError:
            null,
        },
      })

    return NextResponse.json(
      {
        source,
      },
      {
        status: 201,
      },
    )
  }
  catch (error) {
    console.error(
      "[Discovery sources POST] Unexpected error:",
      error,
    )

    return NextResponse.json(
      {
        error:
          "Failed to create discovery source",
      },
      {
        status: 500,
      },
    )
  }
}