import { NextRequest, NextResponse } from "next/server"

import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"
import { findOpportunityInterview } from "@/lib/interview/session-reader"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const READINESS_VALUES = new Set([
  "SETUP",
  "IN_PROGRESS",
  "READY",
  "INTERVIEWING",
  "COMPLETED",
  "ARCHIVED",
])

type RouteContext = {
  params: Promise<{
    id: string
  }>
}

type WorkspacePatch = {
  readiness?: string
  selectedCVAnalysisId?: string | null
  interviewSessionId?: string | null
  companyResearch?: unknown
  preparation?: unknown
  tasks?: unknown
  notes?: string | null
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

async function getOwnedOpportunity(
  opportunityId: string,
  userId: string,
) {
  return prisma.opportunity.findFirst({
    where: {
      id: opportunityId,
      userId,
    },
    select: {
      id: true,
      userId: true,
      title: true,
      company: true,
      status: true,
      matchScore: true,
      recommendation: true,
      recommendationLabel: true,
      nextAction: true,
      nextActionAt: true,
    },
  })
}

async function getOrCreateWorkspace(
  opportunityId: string,
  userId: string,
) {
  const workspace = await prisma.applicationWorkspace.upsert({
    where: {
      opportunityId,
    },
    update: {},
    create: {
      opportunityId,
      userId,
    },
    include: {
      selectedCVAnalysis: {
        select: {
          id: true,
          fileName: true,
          atsScoreBefore: true,
          atsScoreAfter: true,
          createdAt: true,
        },
      },
    },
  })

  // L'entretien préparé pour cette offre est celui que la simulation a lié à l'opportunité
  // (interview_sessions.opportunityId). La colonne application_workspaces.interviewSessionId, qui pointe vers
  // l'ancienne table InterviewSession, n'est plus utilisée.
  const interviewSession = await findOpportunityInterview(userId, opportunityId)

  return { ...workspace, interviewSession }
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

    const opportunity = await getOwnedOpportunity(id, user.id)

    if (!opportunity) {
      return NextResponse.json(
        { error: "Opportunity not found" },
        { status: 404 },
      )
    }

    const workspace = await getOrCreateWorkspace(
      opportunity.id,
      user.id,
    )

    return NextResponse.json({
      opportunity,
      workspace,
    })
  } catch (error) {
    console.error("[ApplicationWorkspace][GET]", error)

    return NextResponse.json(
      { error: "Unable to load application workspace" },
      { status: 500 },
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

    const opportunity = await getOwnedOpportunity(id, user.id)

    if (!opportunity) {
      return NextResponse.json(
        { error: "Opportunity not found" },
        { status: 404 },
      )
    }

    let body: WorkspacePatch

    try {
      body = (await request.json()) as WorkspacePatch
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 },
      )
    }

    const data: {
      readiness?: any
      selectedCVAnalysisId?: string | null
      companyResearch?: any
      preparation?: any
      tasks?: any
      notes?: string | null
      metadata?: any
      lastActivityAt: Date
    } = {
      lastActivityAt: new Date(),
    }

    if (body.readiness !== undefined) {
      if (
        typeof body.readiness !== "string" ||
        !READINESS_VALUES.has(body.readiness)
      ) {
        return NextResponse.json(
          { error: "Invalid workspace readiness" },
          { status: 400 },
        )
      }

      data.readiness = body.readiness
    }

    if (body.notes !== undefined) {
      if (
        body.notes !== null &&
        typeof body.notes !== "string"
      ) {
        return NextResponse.json(
          { error: "Invalid notes" },
          { status: 400 },
        )
      }

      data.notes =
        typeof body.notes === "string"
          ? body.notes.slice(0, 20000)
          : null
    }

    if (body.selectedCVAnalysisId !== undefined) {
      if (body.selectedCVAnalysisId === null) {
        data.selectedCVAnalysisId = null
      } else {
        if (typeof body.selectedCVAnalysisId !== "string") {
          return NextResponse.json(
            { error: "Invalid CV analysis id" },
            { status: 400 },
          )
        }

        const cv = await prisma.cVAnalysis.findFirst({
          where: {
            id: body.selectedCVAnalysisId,
            userId: user.id,
          },
          select: {
            id: true,
          },
        })

        if (!cv) {
          return NextResponse.json(
            { error: "CV analysis not found" },
            { status: 404 },
          )
        }

        data.selectedCVAnalysisId = cv.id
      }
    }

    if (body.interviewSessionId !== undefined) {
      // Plus pris en charge : l'entretien est lié à l'offre par interview_sessions.opportunityId, renseigné
      // à la création de la simulation. Aucun client n'envoyait ce champ ; on refuse plutôt que d'ignorer
      // en silence.
      return NextResponse.json(
        {
          error: "interviewSessionId n'est plus pris en charge : l'entretien est lié à l'opportunité par la simulation.",
          code: "INTERVIEW_SESSION_LINK_UNSUPPORTED",
        },
        { status: 400 },
      )
    }

    if (body.companyResearch !== undefined) {
      data.companyResearch = body.companyResearch
    }

    if (body.preparation !== undefined) {
      data.preparation = body.preparation
    }

    if (body.tasks !== undefined) {
      data.tasks = body.tasks
    }

    if (body.metadata !== undefined) {
      data.metadata = body.metadata
    }

    await prisma.applicationWorkspace.upsert({
      where: {
        opportunityId: opportunity.id,
      },
      update: data,
      create: {
        userId: user.id,
        opportunityId: opportunity.id,
        ...data,
      },
    })

    const workspace = await getOrCreateWorkspace(
      opportunity.id,
      user.id,
    )

    return NextResponse.json({
      success: true,
      workspace,
    })
  } catch (error) {
    console.error("[ApplicationWorkspace][PATCH]", error)

    return NextResponse.json(
      { error: "Unable to update application workspace" },
      { status: 500 },
    )
  }
}