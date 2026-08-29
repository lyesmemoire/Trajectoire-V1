import {
  CareerMemoryOrigin,
  CareerMemoryStatus,
} from "@prisma/client"
import { NextRequest, NextResponse } from "next/server"

import { prisma } from "@/lib/prisma"
import { createClient } from "@/lib/supabase/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

type CreateMemoryBody = {
  category?: unknown
  key?: unknown
  value?: unknown
  origin?: unknown
  confidence?: unknown
  evidence?: unknown
  sourceType?: unknown
  sourceId?: unknown
  isFavorite?: unknown
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

function requiredText(
  value: unknown,
  field: string,
  maxLength: number,
) {
  if (typeof value !== "string") {
    throw new Error(`${field} is required`)
  }

  const normalized = value.trim()

  if (!normalized) {
    throw new Error(`${field} is required`)
  }

  return normalized.slice(0, maxLength)
}

function optionalText(
  value: unknown,
  maxLength: number,
) {
  if (typeof value !== "string") {
    return null
  }

  const normalized = value.trim()

  return normalized
    ? normalized.slice(0, maxLength)
    : null
}

function confidenceValue(
  value: unknown,
  fallback: number,
) {
  if (
    typeof value !== "number" ||
    !Number.isFinite(value)
  ) {
    return fallback
  }

  return Math.max(
    0,
    Math.min(100, Math.round(value)),
  )
}

export async function GET(
  request: NextRequest,
) {
  try {
    const user = await getUser()

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      )
    }

    const statusParam =
      request.nextUrl.searchParams.get("status")

    const category =
      request.nextUrl.searchParams.get("category")

    const opportunityId =
      request.nextUrl.searchParams.get("opportunity")

    const allowedStatuses =
      new Set<string>(
        Object.values(CareerMemoryStatus),
      )

    const status =
      statusParam &&
      allowedStatuses.has(statusParam)
        ? (statusParam as CareerMemoryStatus)
        : undefined

    if (opportunityId) {
      const opportunity =
        await prisma.opportunity.findFirst({
          where: {
            id: opportunityId,
            userId: user.id,
          },
          select: {
            id: true,
          },
        })

      if (!opportunity) {
        return NextResponse.json(
          {
            error: "Opportunity not found",
          },
          {
            status: 404,
          },
        )
      }
    }

    const memories =
      await prisma.careerMemory.findMany({
        where: {
          userId: user.id,
          status,
          category:
            category?.trim() || undefined,
        },
        include: {
          opportunities: {
            where: opportunityId
              ? {
                  opportunityId,
                }
              : undefined,
            select: {
              opportunityId: true,
              relevance: true,
              reason: true,
              selected: true,
            },
          },
        },
        orderBy: [
          {
            isFavorite: "desc",
          },
          {
            updatedAt: "desc",
          },
        ],
      })

    return NextResponse.json({
      memories: memories.map((memory) => ({
        ...memory,
        linkedToOpportunity:
          opportunityId !== null
            ? memory.opportunities.some(
                (link) =>
                  link.opportunityId ===
                  opportunityId,
              )
            : undefined,
      })),
    })
  } catch (error) {
    console.error(
      "[CareerMemory][GET]",
      error,
    )

    return NextResponse.json(
      {
        error:
          "Unable to load career memory",
      },
      {
        status: 500,
      },
    )
  }
}

export async function POST(
  request: NextRequest,
) {
  try {
    const user = await getUser()

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      )
    }

    let body: CreateMemoryBody

    try {
      body =
        (await request.json()) as CreateMemoryBody
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

    let category: string
    let key: string
    let value: string

    try {
      category = requiredText(
        body.category,
        "category",
        80,
      )

      key = requiredText(
        body.key,
        "key",
        160,
      )

      value = requiredText(
        body.value,
        "value",
        10000,
      )
    } catch (error) {
      return NextResponse.json(
        {
          error:
            error instanceof Error
              ? error.message
              : "Invalid memory",
        },
        {
          status: 400,
        },
      )
    }

    const requestedOrigin =
      typeof body.origin === "string"
        ? body.origin
        : CareerMemoryOrigin.USER_CONFIRMED

    const origin =
      requestedOrigin ===
      CareerMemoryOrigin.AI_DERIVED
        ? CareerMemoryOrigin.AI_DERIVED
        : requestedOrigin ===
            CareerMemoryOrigin.IMPORTED
          ? CareerMemoryOrigin.IMPORTED
          : CareerMemoryOrigin.USER_CONFIRMED

    // Critical truth contract:
    // AI-derived information can only enter memory
    // as a suggestion. It is never auto-confirmed.
    const status =
      origin === CareerMemoryOrigin.AI_DERIVED
        ? CareerMemoryStatus.SUGGESTED
        : CareerMemoryStatus.CONFIRMED

    const confidence =
      confidenceValue(
        body.confidence,
        origin === CareerMemoryOrigin.AI_DERIVED
          ? 60
          : 100,
      )

    const memory =
      await prisma.careerMemory.upsert({
        where: {
          userId_category_key: {
            userId: user.id,
            category,
            key,
          },
        },
        update: {
          value,
          origin,
          status,
          confidence,
          evidence:
            body.evidence === undefined
              ? undefined
              : (body.evidence as any),
          sourceType: optionalText(
            body.sourceType,
            120,
          ),
          sourceId: optionalText(
            body.sourceId,
            200,
          ),
          isFavorite:
            typeof body.isFavorite === "boolean"
              ? body.isFavorite
              : undefined,
          metadata:
            body.metadata === undefined
              ? undefined
              : (body.metadata as any),
        },
        create: {
          userId: user.id,
          category,
          key,
          value,
          origin,
          status,
          confidence,
          evidence:
            body.evidence === undefined
              ? undefined
              : (body.evidence as any),
          sourceType: optionalText(
            body.sourceType,
            120,
          ),
          sourceId: optionalText(
            body.sourceId,
            200,
          ),
          isFavorite:
            typeof body.isFavorite === "boolean"
              ? body.isFavorite
              : false,
          metadata:
            body.metadata === undefined
              ? undefined
              : (body.metadata as any),
        },
      })

    return NextResponse.json(
      {
        success: true,
        memory,
      },
      {
        status: 201,
      },
    )
  } catch (error) {
    console.error(
      "[CareerMemory][POST]",
      error,
    )

    return NextResponse.json(
      {
        error:
          "Unable to create career memory",
      },
      {
        status: 500,
      },
    )
  }
}