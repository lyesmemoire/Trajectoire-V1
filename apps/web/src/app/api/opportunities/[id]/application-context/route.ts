import {
  CareerMemoryStatus,
} from "@prisma/client"
import { NextResponse } from "next/server"

import {
  buildApplicationContext,
} from "@/lib/opportunities/buildApplicationContext"
import { prisma } from "@/lib/prisma"
import { createClient } from "@/lib/supabase/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

type RouteContext = {
  params: Promise<{
    id: string
  }>
}

export async function GET(
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
          location: true,
          description: true,
          matchScore: true,
          recommendation: true,
          strengths: true,
          gaps: true,

          stories: {
            where: {
              selected: true,
            },
            orderBy: [
              {
                relevance: "desc",
              },
              {
                updatedAt: "desc",
              },
            ],
            select: {
              relevance: true,
              reason: true,

              story: {
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
              },
            },
          },

          memories: {
            where: {
              selected: true,

              memory: {
                userId: user.id,
                status:
                  CareerMemoryStatus.CONFIRMED,
              },
            },
            orderBy: [
              {
                relevance: "desc",
              },
              {
                updatedAt: "desc",
              },
            ],
            select: {
              relevance: true,
              reason: true,

              memory: {
                select: {
                  id: true,
                  category: true,
                  key: true,
                  value: true,
                  origin: true,
                  confidence: true,
                  status: true,
                },
              },
            },
          },
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

    const applicationContext =
      buildApplicationContext({
        opportunity: {
          id: opportunity.id,
          title: opportunity.title,
          company: opportunity.company,
          location: opportunity.location,
          description:
            opportunity.description,
          matchScore:
            opportunity.matchScore,
          recommendation:
            opportunity.recommendation,
          strengths:
            opportunity.strengths,
          gaps:
            opportunity.gaps,
        },

        stories:
          opportunity.stories.map(
            (link) => ({
              ...link.story,
              relevance:
                link.relevance,
              reason:
                link.reason,
            }),
          ),

        memories:
          opportunity.memories.map(
            (link) => ({
              id: link.memory.id,
              category:
                link.memory.category,
              key:
                link.memory.key,
              value:
                link.memory.value,
              origin:
                link.memory.origin,
              confidence:
                link.memory.confidence,
              relevance:
                link.relevance,
              reason:
                link.reason,
            }),
          ),
      })

    return NextResponse.json({
      success: true,
      context:
        applicationContext,
    })
  } catch (error) {
    console.error(
      "[ApplicationContext][GET]",
      error,
    )

    return NextResponse.json(
      {
        error:
          "Unable to build application context",
      },
      {
        status: 500,
      },
    )
  }
}