import {
  CareerMemoryStatus,
} from "@prisma/client"
import { NextRequest, NextResponse } from "next/server"

import { prisma } from "@/lib/prisma"
import { createClient } from "@/lib/supabase/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

type RouteContext = {
  params: Promise<{
    id: string
  }>
}

type MemoryPatchBody = {
  action?: unknown
  value?: unknown
  confidence?: unknown
  isFavorite?: unknown
  metadata?: unknown
}

const ACTION_STATUS = {
  confirm: CareerMemoryStatus.CONFIRMED,
  reject: CareerMemoryStatus.REJECTED,
  archive: CareerMemoryStatus.ARCHIVED,
} as const

async function getUser() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  return error || !user ? null : user
}

export async function GET(
  _request: NextRequest,
  context: RouteContext,
) {
  try {
    const user = await getUser()

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      )
    }

    const { id } = await context.params

    const memory =
      await prisma.careerMemory.findFirst({
        where: {
          id,
          userId: user.id,
        },
        include: {
          opportunities: true,
        },
      })

    if (!memory) {
      return NextResponse.json(
        {
          error: "Memory not found",
        },
        {
          status: 404,
        },
      )
    }

    return NextResponse.json({
      memory,
    })
  } catch (error) {
    console.error(
      "[CareerMemory][GET_ONE]",
      error,
    )

    return NextResponse.json(
      {
        error: "Unable to load memory",
      },
      {
        status: 500,
      },
    )
  }
}

export async function PATCH(
  request: NextRequest,
  context: RouteContext,
) {
  try {
    const user = await getUser()

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      )
    }

    const { id } = await context.params

    const existing =
      await prisma.careerMemory.findFirst({
        where: {
          id,
          userId: user.id,
        },
      })

    if (!existing) {
      return NextResponse.json(
        {
          error: "Memory not found",
        },
        {
          status: 404,
        },
      )
    }

    let body: MemoryPatchBody

    try {
      body =
        (await request.json()) as MemoryPatchBody
    } catch {
      return NextResponse.json(
        {
          error: "Invalid JSON body",
        },
        {
          status: 400,
        },
      )
    }

    const data: Record<string, any> = {}

    if (body.action !== undefined) {
      if (
        typeof body.action !== "string" ||
        !Object.prototype.hasOwnProperty.call(
          ACTION_STATUS,
          body.action,
        )
      ) {
        return NextResponse.json(
          {
            error:
              "Invalid memory action",
          },
          {
            status: 400,
          },
        )
      }

      data.status =
        ACTION_STATUS[
          body.action as keyof typeof ACTION_STATUS
        ]

      // Explicit confirmation converts the suggestion
      // into a user-approved fact without rewriting
      // its provenance.
      if (body.action === "confirm") {
        data.confidence = 100
      }
    }

    if (body.value !== undefined) {
      if (
        typeof body.value !== "string" ||
        !body.value.trim()
      ) {
        return NextResponse.json(
          {
            error:
              "Memory value cannot be empty",
          },
          {
            status: 400,
          },
        )
      }

      data.value =
        body.value.trim().slice(0, 10000)
    }

    if (body.confidence !== undefined) {
      if (
        typeof body.confidence !== "number" ||
        !Number.isFinite(body.confidence)
      ) {
        return NextResponse.json(
          {
            error: "Invalid confidence",
          },
          {
            status: 400,
          },
        )
      }

      data.confidence = Math.max(
        0,
        Math.min(
          100,
          Math.round(body.confidence),
        ),
      )
    }

    if (body.isFavorite !== undefined) {
      if (
        typeof body.isFavorite !== "boolean"
      ) {
        return NextResponse.json(
          {
            error:
              "Invalid favorite value",
          },
          {
            status: 400,
          },
        )
      }

      data.isFavorite =
        body.isFavorite
    }

    if (body.metadata !== undefined) {
      data.metadata =
        body.metadata as any
    }

    const memory =
      await prisma.careerMemory.update({
        where: {
          id: existing.id,
        },
        data,
      })

    return NextResponse.json({
      success: true,
      memory,
    })
  } catch (error) {
    console.error(
      "[CareerMemory][PATCH]",
      error,
    )

    return NextResponse.json(
      {
        error: "Unable to update memory",
      },
      {
        status: 500,
      },
    )
  }
}

export async function DELETE(
  _request: NextRequest,
  context: RouteContext,
) {
  try {
    const user = await getUser()

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      )
    }

    const { id } = await context.params

    const existing =
      await prisma.careerMemory.findFirst({
        where: {
          id,
          userId: user.id,
        },
        select: {
          id: true,
        },
      })

    if (!existing) {
      return NextResponse.json(
        {
          error: "Memory not found",
        },
        {
          status: 404,
        },
      )
    }

    await prisma.careerMemory.delete({
      where: {
        id: existing.id,
      },
    })

    return NextResponse.json({
      success: true,
    })
  } catch (error) {
    console.error(
      "[CareerMemory][DELETE]",
      error,
    )

    return NextResponse.json(
      {
        error: "Unable to delete memory",
      },
      {
        status: 500,
      },
    )
  }
}