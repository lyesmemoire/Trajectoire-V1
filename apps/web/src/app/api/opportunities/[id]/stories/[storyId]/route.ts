import { NextRequest, NextResponse } from "next/server"

import { prisma } from "@/lib/prisma"
import { createClient } from "@/lib/supabase/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

type RouteContext = {
  params: Promise<{
    id: string
    storyId: string
  }>
}

type LinkStoryBody = {
  relevance?: unknown
  reason?: unknown
  selected?: unknown
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

async function validateOwnership(
  opportunityId: string,
  storyId: string,
  userId: string,
) {
  const [opportunity, story] =
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
      prisma.careerStory.findFirst({
        where: {
          id: storyId,
          userId,
        },
        select: {
          id: true,
        },
      }),
    ])

  if (!opportunity || !story) {
    return null
  }

  return {
    opportunity,
    story,
  }
}

export async function PUT(
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

    const {
      id: opportunityId,
      storyId,
    } = await context.params

    const owned = await validateOwnership(
      opportunityId,
      storyId,
      user.id,
    )

    if (!owned) {
      return NextResponse.json(
        {
          error:
            "Opportunity or story not found",
        },
        {
          status: 404,
        },
      )
    }

    let body: LinkStoryBody = {}

    try {
      body =
        (await request.json()) as LinkStoryBody
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
        ? body.reason.trim().slice(0, 2000) ||
          null
        : null

    const selected =
      typeof body.selected === "boolean"
        ? body.selected
        : true

    const link =
      await prisma.opportunityStory.upsert({
        where: {
          opportunityId_storyId: {
            opportunityId:
              owned.opportunity.id,
            storyId: owned.story.id,
          },
        },
        update: {
          relevance,
          reason,
          selected,
          metadata:
            body.metadata === undefined
              ? undefined
              : (body.metadata as any),
        },
        create: {
          opportunityId:
            owned.opportunity.id,
          storyId: owned.story.id,
          relevance,
          reason,
          selected,
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
      "[StoryBank][LINK]",
      error,
    )

    return NextResponse.json(
      {
        error:
          "Unable to link story to opportunity",
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

    const {
      id: opportunityId,
      storyId,
    } = await context.params

    const owned = await validateOwnership(
      opportunityId,
      storyId,
      user.id,
    )

    if (!owned) {
      return NextResponse.json(
        {
          error:
            "Opportunity or story not found",
        },
        {
          status: 404,
        },
      )
    }

    await prisma.opportunityStory.deleteMany({
      where: {
        opportunityId:
          owned.opportunity.id,
        storyId: owned.story.id,
      },
    })

    return NextResponse.json({
      success: true,
    })
  } catch (error) {
    console.error(
      "[StoryBank][UNLINK]",
      error,
    )

    return NextResponse.json(
      {
        error:
          "Unable to unlink story from opportunity",
      },
      {
        status: 500,
      },
    )
  }
}