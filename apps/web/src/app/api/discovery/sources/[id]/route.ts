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

export async function PATCH(
  request: Request,
  context: RouteContext,
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

    const {
      id,
    } =
      await context.params

    const existing =
      await prisma.discoverySource.findFirst({
        where: {
          id,
          userId:
            user.id,
        },
      })

    if (!existing) {
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

    const body =
      (await request.json()) as {
        enabled?: unknown
        company?: unknown
      }

    const data: {
      enabled?: boolean
      company?: string
    } = {}

    if (
      typeof body.enabled ===
      "boolean"
    ) {
      data.enabled =
        body.enabled
    }

    if (
      typeof body.company ===
      "string"
    ) {
      const company =
        body.company.trim()

      if (!company) {
        return NextResponse.json(
          {
            error:
              "Company cannot be empty",
          },
          {
            status: 400,
          },
        )
      }

      data.company =
        company
    }

    if (
      Object.keys(
        data,
      ).length === 0
    ) {
      return NextResponse.json(
        {
          error:
            "No supported fields provided",
        },
        {
          status: 400,
        },
      )
    }

    const source =
      await prisma.discoverySource.update({
        where: {
          id:
            existing.id,
        },

        data,
      })

    return NextResponse.json({
      source,
    })
  }
  catch (error) {
    console.error(
      "[Discovery source PATCH] Unexpected error:",
      error,
    )

    return NextResponse.json(
      {
        error:
          "Failed to update discovery source",
      },
      {
        status: 500,
      },
    )
  }
}

export async function DELETE(
  _request: Request,
  context: RouteContext,
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

    const {
      id,
    } =
      await context.params

    const existing =
      await prisma.discoverySource.findFirst({
        where: {
          id,
          userId:
            user.id,
        },

        select: {
          id:
            true,
        },
      })

    if (!existing) {
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

    await prisma.discoverySource.delete({
      where: {
        id:
          existing.id,
      },
    })

    return NextResponse.json({
      deleted:
        true,
    })
  }
  catch (error) {
    console.error(
      "[Discovery source DELETE] Unexpected error:",
      error,
    )

    return NextResponse.json(
      {
        error:
          "Failed to delete discovery source",
      },
      {
        status: 500,
      },
    )
  }
}