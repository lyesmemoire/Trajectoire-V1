import { NextRequest, NextResponse } from "next/server"

import { prisma } from "@/lib/prisma"
import { createClient } from "@/lib/supabase/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

type StoryCreateBody = {
  title?: unknown
  situation?: unknown
  task?: unknown
  action?: unknown
  result?: unknown
  skills?: unknown
  tags?: unknown
  metrics?: unknown
  source?: unknown
  confidence?: unknown
  isFavorite?: unknown
  metadata?: unknown
}

async function getAuthenticatedUser() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return null
  }

  return user
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
  if (value === undefined || value === null) {
    return null
  }

  if (typeof value !== "string") {
    return null
  }

  const normalized = value.trim()

  return normalized
    ? normalized.slice(0, maxLength)
    : null
}

function stringArray(
  value: unknown,
  maxItems = 30,
) {
  if (!Array.isArray(value)) {
    return []
  }

  return Array.from(
    new Set(
      value
        .filter(
          (item): item is string =>
            typeof item === "string",
        )
        .map((item) => item.trim())
        .filter(Boolean)
        .map((item) => item.slice(0, 100)),
    ),
  ).slice(0, maxItems)
}

function confidenceValue(value: unknown) {
  if (
    typeof value !== "number" ||
    !Number.isFinite(value)
  ) {
    return 100
  }

  return Math.max(
    0,
    Math.min(100, Math.round(value)),
  )
}

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser()

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      )
    }

    const opportunityId =
      request.nextUrl.searchParams.get("opportunity")

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
          { error: "Opportunity not found" },
          { status: 404 },
        )
      }
    }

    const stories =
      await prisma.careerStory.findMany({
        where: {
          userId: user.id,
        },
        orderBy: [
          {
            isFavorite: "desc",
          },
          {
            updatedAt: "desc",
          },
        ],
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
              createdAt: true,
            },
          },
        },
      })

    return NextResponse.json({
      stories: stories.map((story) => ({
        ...story,
        linkedToOpportunity:
          opportunityId !== null
            ? story.opportunities.some(
                (link) =>
                  link.opportunityId ===
                  opportunityId,
              )
            : undefined,
      })),
    })
  } catch (error) {
    console.error("[StoryBank][GET]", error)

    return NextResponse.json(
      {
        error: "Unable to load Story Bank",
      },
      {
        status: 500,
      },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser()

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      )
    }

    let body: StoryCreateBody

    try {
      body =
        (await request.json()) as StoryCreateBody
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 },
      )
    }

    let title: string
    let situation: string
    let task: string
    let action: string
    let result: string

    try {
      title = requiredText(
        body.title,
        "title",
        180,
      )

      situation = requiredText(
        body.situation,
        "situation",
        5000,
      )

      task = requiredText(
        body.task,
        "task",
        5000,
      )

      action = requiredText(
        body.action,
        "action",
        10000,
      )

      result = requiredText(
        body.result,
        "result",
        5000,
      )
    } catch (error) {
      return NextResponse.json(
        {
          error:
            error instanceof Error
              ? error.message
              : "Invalid story",
        },
        {
          status: 400,
        },
      )
    }

    const story =
      await prisma.careerStory.create({
        data: {
          userId: user.id,
          title,
          situation,
          task,
          action,
          result,
          skills: stringArray(body.skills),
          tags: stringArray(body.tags),
          metrics:
            body.metrics === undefined
              ? undefined
              : (body.metrics as any),
          source: optionalText(
            body.source,
            200,
          ),
          confidence: confidenceValue(
            body.confidence,
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
        story,
      },
      {
        status: 201,
      },
    )
  } catch (error) {
    console.error("[StoryBank][POST]", error)

    return NextResponse.json(
      {
        error: "Unable to create story",
      },
      {
        status: 500,
      },
    )
  }
}