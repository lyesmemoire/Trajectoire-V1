import {
  CareerMemoryStatus,
} from "@prisma/client"
import { NextResponse } from "next/server"

import { prisma } from "@/lib/prisma"
import {
  scoreMemoryForOpportunity,
} from "@/lib/memories/scoreMemoryForOpportunity"
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
    const supabase =
      await createClient()

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error || !user) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        },
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

    // Only confirmed memories are eligible
    // for contextual recommendation.
    const memories =
      await prisma.careerMemory.findMany({
        where: {
          userId: user.id,
          status:
            CareerMemoryStatus.CONFIRMED,
        },
        select: {
          id: true,
          category: true,
          key: true,
          value: true,
          confidence: true,
          isFavorite: true,
        },
      })

    const scored =
      memories
        .map((memory) => ({
          memory,
          score:
            scoreMemoryForOpportunity(
              memory,
              opportunity,
            ),
        }))
        .sort(
          (a, b) =>
            b.score.relevance -
            a.score.relevance,
        )

    for (const item of scored) {
      const existing =
        await prisma.opportunityMemory.findUnique({
          where: {
            opportunityId_memoryId: {
              opportunityId:
                opportunity.id,
              memoryId:
                item.memory.id,
            },
          },
          select: {
            id: true,
            selected: true,
          },
        })

      if (existing) {
        await prisma.opportunityMemory.update({
          where: {
            id: existing.id,
          },
          data: {
            relevance:
              item.score.relevance,
            reason:
              item.score.reason,

            // Human-in-loop contract:
            // recommendation never changes
            // the user's current selection.
            selected:
              existing.selected,

            metadata: {
              matchedTerms:
                item.score.matchedTerms,
              engine:
                "memory-relevance-v1",
            },
          },
        })
      } else {
        await prisma.opportunityMemory.create({
          data: {
            opportunityId:
              opportunity.id,
            memoryId:
              item.memory.id,
            relevance:
              item.score.relevance,
            reason:
              item.score.reason,

            // New recommendations are
            // never auto-selected.
            selected: false,

            metadata: {
              matchedTerms:
                item.score.matchedTerms,
              engine:
                "memory-relevance-v1",
            },
          },
        })
      }
    }

    return NextResponse.json({
      success: true,
      recommendations:
        scored.map((item) => ({
          memoryId:
            item.memory.id,
          relevance:
            item.score.relevance,
          reason:
            item.score.reason,
          matchedTerms:
            item.score.matchedTerms,
        })),
      recommendedCount:
        scored.filter(
          (item) =>
            item.score.relevance >= 50,
        ).length,
    })
  } catch (error) {
    console.error(
      "[CareerMemory][RECOMMEND]",
      error,
    )

    return NextResponse.json(
      {
        error:
          "Unable to recommend career memories",
      },
      {
        status: 500,
      },
    )
  }
}