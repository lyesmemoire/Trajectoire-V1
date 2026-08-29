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

type StoryPatchBody = {
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

function textValue(
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

export async function GET(
  _request: NextRequest,
  context: RouteContext,
) {
  try {
    const user = await getAuthenticatedUser()

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      )
    }

    const { id } = await context.params

    const story =
      await prisma.careerStory.findFirst({
        where: {
          id,
          userId: user.id,
        },
        include: {
          opportunities: {
            select: {
              opportunityId: true,
              relevance: true,
              reason: true,
              selected: true,
            },
          },
        },
      })

    if (!story) {
      return NextResponse.json(
        { error: "Story not found" },
        { status: 404 },
      )
    }

    return NextResponse.json({
      story,
    })
  } catch (error) {
    console.error("[StoryBank][GET_ONE]", error)

    return NextResponse.json(
      {
        error: "Unable to load story",
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
    const user = await getAuthenticatedUser()

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      )
    }

    const { id } = await context.params

    const existing =
      await prisma.careerStory.findFirst({
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
        { error: "Story not found" },
        { status: 404 },
      )
    }

    let body: StoryPatchBody

    try {
      body =
        (await request.json()) as StoryPatchBody
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 },
      )
    }

    const data: Record<string, any> = {}

    const requiredFields: Array<{
      key:
        | "title"
        | "situation"
        | "task"
        | "action"
        | "result"
      maxLength: number
    }> = [
      {
        key: "title",
        maxLength: 180,
      },
      {
        key: "situation",
        maxLength: 5000,
      },
      {
        key: "task",
        maxLength: 5000,
      },
      {
        key: "action",
        maxLength: 10000,
      },
      {
        key: "result",
        maxLength: 5000,
      },
    ]

    for (const field of requiredFields) {
      if (body[field.key] !== undefined) {
        const value = textValue(
          body[field.key],
          field.maxLength,
        )

        if (!value) {
          return NextResponse.json(
            {
              error: `${field.key} cannot be empty`,
            },
            {
              status: 400,
            },
          )
        }

        data[field.key] = value
      }
    }

    if (body.skills !== undefined) {
      data.skills = stringArray(body.skills)
    }

    if (body.tags !== undefined) {
      data.tags = stringArray(body.tags)
    }

    if (body.source !== undefined) {
      data.source = textValue(
        body.source,
        200,
      )
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
            error: "Invalid favorite value",
          },
          {
            status: 400,
          },
        )
      }

      data.isFavorite = body.isFavorite
    }

    if (body.metrics !== undefined) {
      data.metrics = body.metrics as any
    }

    if (body.metadata !== undefined) {
      data.metadata = body.metadata as any
    }

    const story =
      await prisma.careerStory.update({
        where: {
          id: existing.id,
        },
        data,
      })

    return NextResponse.json({
      success: true,
      story,
    })
  } catch (error) {
    console.error("[StoryBank][PATCH]", error)

    return NextResponse.json(
      {
        error: "Unable to update story",
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
    const user = await getAuthenticatedUser()

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      )
    }

    const { id } = await context.params

    const existing =
      await prisma.careerStory.findFirst({
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
        { error: "Story not found" },
        { status: 404 },
      )
    }

    await prisma.careerStory.delete({
      where: {
        id: existing.id,
      },
    })

    return NextResponse.json({
      success: true,
    })
  } catch (error) {
    console.error("[StoryBank][DELETE]", error)

    return NextResponse.json(
      {
        error: "Unable to delete story",
      },
      {
        status: 500,
      },
    )
  }
}