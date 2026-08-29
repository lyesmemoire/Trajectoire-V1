import { NextResponse } from "next/server"

import { prisma } from "@/lib/prisma"
import {
  scoreStoryForOpportunity,
} from "@/lib/stories/scoreStoryForOpportunity"
import { createClient } from "@/lib/supabase/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

type RouteContext = {
  params: Promise<{
    id: string
  }>
}

export async function POST(
  _request: Request,
  context: RouteContext,
) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      )
    }

    const { id } = await context.params

    const opportunity =
      await prisma.opportunity.findFirst({
        where: {
          id,
          userId: user.id,
        },
        select: {
          id: true,
          title: true,
          company: true,
          description: true,
          strengths: true,
          gaps: true,
          analysis: true,
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

    const stories =
      await prisma.careerStory.findMany({
        where: {
          userId: user.id,
        },
        select: {
          id: true,
          title: true,
          situation: true,
          task: true,
          action: true,
          result: true,
          skills: true,
          tags: true,
        },
      })

    const recommendations =
      stories
        .map((story) => {
          const relevance =
            scoreStoryForOpportunity(
              story,
              opportunity,
            )

          return {
            storyId: story.id,
            title: story.title,
            relevance: relevance.score,
            reason: relevance.reason,
            matchedTerms:
              relevance.matchedTerms,
          }
        })
        .sort(
          (a, b) =>
            b.relevance - a.relevance,
        )

    await Promise.all(
      recommendations.map(
        (recommendation) =>
          prisma.opportunityStory.upsert({
            where: {
              opportunityId_storyId: {
                opportunityId:
                  opportunity.id,
                storyId:
                  recommendation.storyId,
              },
            },
            update: {
              relevance:
                recommendation.relevance,
              reason:
                recommendation.reason,
            },
            create: {
              opportunityId:
                opportunity.id,
              storyId:
                recommendation.storyId,
              relevance:
                recommendation.relevance,
              reason:
                recommendation.reason,

              // Human-in-loop:
              // recommendation does not select
              // the story automatically.
              selected: false,
            },
          }),
      ),
    )

    return NextResponse.json({
      success: true,
      recommendations,
      recommended:
        recommendations.filter(
          (item) =>
            item.relevance >= 50,
        ).length,
    })
  } catch (error) {
    console.error(
      "[StoryIntelligence][RECOMMEND]",
      error,
    )

    return NextResponse.json(
      {
        error:
          "Unable to recommend stories",
      },
      {
        status: 500,
      },
    )
  }
}