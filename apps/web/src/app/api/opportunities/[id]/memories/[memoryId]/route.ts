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
    memoryId: string
  }>
}

type LinkBody = {
  relevance?: unknown
  reason?: unknown
  selected?: unknown
  metadata?: unknown
}

async function getUser() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  return error || !user ? null : user
}

async function validateOwnership(
  opportunityId: string,
  memoryId: string,
  userId: string,
) {
  const [opportunity, memory] =
    await Promise.all([
      prisma.opportunity.findFirst({
        where: {
          id: opportunityId,
          userId,
        },
        select: {
          id: true,
        },
      }),

      prisma.careerMemory.findFirst({
        where: {
          id: memoryId,
          userId,
        },
        select: {
          id: true,
          status: true,
        },
      }),
    ])

  if (!opportunity || !memory) {
    return null
  }

  return {
    opportunity,
    memory,
  }
}

export async function PUT(
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

    const {
      id: opportunityId,
      memoryId,
    } = await context.params

    const owned =
      await validateOwnership(
        opportunityId,
        memoryId,
        user.id,
      )

    if (!owned) {
      return NextResponse.json(
        {
          error:
            "Opportunity or memory not found",
        },
        {
          status: 404,
        },
      )
    }

    // Rejected/archived memories must never
    // become active application evidence.
    if (
      owned.memory.status ===
        CareerMemoryStatus.REJECTED ||
      owned.memory.status ===
        CareerMemoryStatus.ARCHIVED
    ) {
      return NextResponse.json(
        {
          error:
            "Inactive memory cannot be selected",
        },
        {
          status: 409,
        },
      )
    }

    let body: LinkBody = {}

    try {
      body =
        (await request.json()) as LinkBody
    } catch {
      body = {}
    }

    let relevance: number | null = null

    if (body.relevance !== undefined) {
      if (
        typeof body.relevance !== "number" ||
        !Number.isFinite(body.relevance)
      ) {
        return NextResponse.json(
          {
            error: "Invalid relevance",
          },
          {
            status: 400,
          },
        )
      }

      relevance = Math.max(
        0,
        Math.min(
          100,
          Math.round(body.relevance),
        ),
      )
    }

    const reason =
      typeof body.reason === "string"
        ? body.reason
            .trim()
            .slice(0, 2000) || null
        : null

    const requestedSelected =
      typeof body.selected === "boolean"
        ? body.selected
        : false

    // Suggested AI memories may be relevant,
    // but cannot be selected as facts until
    // the user confirms them.
    if (
      requestedSelected &&
      owned.memory.status !==
        CareerMemoryStatus.CONFIRMED
    ) {
      return NextResponse.json(
        {
          error:
            "Memory must be confirmed before selection",
        },
        {
          status: 409,
        },
      )
    }

    const link =
      await prisma.opportunityMemory.upsert({
        where: {
          opportunityId_memoryId: {
            opportunityId:
              owned.opportunity.id,
            memoryId:
              owned.memory.id,
          },
        },
        update: {
          relevance,
          reason,
          selected:
            requestedSelected,
          metadata:
            body.metadata === undefined
              ? undefined
              : (body.metadata as any),
        },
        create: {
          opportunityId:
            owned.opportunity.id,
          memoryId:
            owned.memory.id,
          relevance,
          reason,
          selected:
            requestedSelected,
          metadata:
            body.metadata === undefined
              ? undefined
              : (body.metadata as any),
        },
      })

    return NextResponse.json({
      success: true,
      link,
    })
  } catch (error) {
    console.error(
      "[CareerMemory][LINK]",
      error,
    )

    return NextResponse.json(
      {
        error:
          "Unable to link career memory",
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

    const {
      id: opportunityId,
      memoryId,
    } = await context.params

    const owned =
      await validateOwnership(
        opportunityId,
        memoryId,
        user.id,
      )

    if (!owned) {
      return NextResponse.json(
        {
          error:
            "Opportunity or memory not found",
        },
        {
          status: 404,
        },
      )
    }

    await prisma.opportunityMemory.deleteMany({
      where: {
        opportunityId:
          owned.opportunity.id,
        memoryId:
          owned.memory.id,
      },
    })

    return NextResponse.json({
      success: true,
    })
  } catch (error) {
    console.error(
      "[CareerMemory][UNLINK]",
      error,
    )

    return NextResponse.json(
      {
        error:
          "Unable to unlink career memory",
      },
      {
        status: 500,
      },
    )
  }
}