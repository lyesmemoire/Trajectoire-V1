import { NextResponse } from "next/server"
import { OpportunityStatus } from "@prisma/client"

import { prisma } from "@/lib/prisma"
import { createClient } from "@/lib/supabase/server"

export const runtime = "nodejs"

type RouteContext = {
  params: Promise<{
    id: string
  }>
}

type UpdateOpportunityBody = {
  title?: unknown
  company?: unknown
  location?: unknown
  sourceUrl?: unknown
  source?: unknown
  description?: unknown
  status?: unknown
  metadata?: unknown
  nextAction?: unknown
  nextActionAt?: unknown
}

function cleanOptionalString(
  value: unknown,
  maxLength = 500,
): string | null {
  if (typeof value !== "string") {
    return null
  }

  const cleaned = value.trim()

  if (!cleaned) {
    return null
  }

  return cleaned.slice(0, maxLength)
}

function parseOptionalDate(
  value: unknown,
): Date | null {
  if (
    typeof value !== "string" ||
    !value.trim()
  ) {
    return null
  }

  const date = new Date(value)

  return Number.isNaN(date.getTime())
    ? null
    : date
}

function parseStatus(
  value: unknown,
): OpportunityStatus | null {
  if (
    typeof value === "string" &&
    Object.values(OpportunityStatus).includes(
      value as OpportunityStatus,
    )
  ) {
    return value as OpportunityStatus
  }

  return null
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

export async function GET(
  _request: Request,
  context: RouteContext,
) {
  try {
    const user = await getAuthenticatedUser()

    if (!user) {
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

    return NextResponse.json({
      opportunity,
    })
  } catch (error) {
    console.error(
      "[Opportunity GET] Unexpected error:",
      error,
    )

    return NextResponse.json(
      {
        error: "Failed to load opportunity",
      },
      {
        status: 500,
      },
    )
  }
}

export async function PATCH(
  request: Request,
  context: RouteContext,
) {
  try {
    const user = await getAuthenticatedUser()

    if (!user) {
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

    const existing =
      await prisma.opportunity.findFirst({
        where: {
          id,
          userId: user.id,
        },
        select: {
          id: true,
          status: true,
        },
      })

    if (!existing) {
      return NextResponse.json(
        {
          error: "Opportunity not found",
        },
        {
          status: 404,
        },
      )
    }

    let body: UpdateOpportunityBody

    try {
      body =
        (await request.json()) as UpdateOpportunityBody
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

    const data: Record<string, unknown> = {}

    if ("title" in body) {
      const title =
        cleanOptionalString(
          body.title,
          200,
        )

      if (!title) {
        return NextResponse.json(
          {
            error: "title cannot be empty",
          },
          {
            status: 400,
          },
        )
      }

      data.title = title
    }

    if ("company" in body) {
      data.company =
        cleanOptionalString(
          body.company,
          200,
        )
    }

    if ("location" in body) {
      data.location =
        cleanOptionalString(
          body.location,
          200,
        )
    }

    if ("sourceUrl" in body) {
      data.sourceUrl =
        cleanOptionalString(
          body.sourceUrl,
          2_000,
        )
    }

    if ("source" in body) {
      data.source =
        cleanOptionalString(
          body.source,
          100,
        )
    }

    if ("description" in body) {
      if (
        typeof body.description !== "string" ||
        !body.description.trim()
      ) {
        return NextResponse.json(
          {
            error:
              "description cannot be empty",
          },
          {
            status: 400,
          },
        )
      }

      if (
        body.description.length >
        50_000
      ) {
        return NextResponse.json(
          {
            error:
              "description must contain at most 50000 characters",
          },
          {
            status: 413,
          },
        )
      }

      data.description =
        body.description.trim()
    }

    if ("status" in body) {
      const status =
        parseStatus(body.status)

      if (!status) {
        return NextResponse.json(
          {
            error:
              "Invalid opportunity status",
          },
          {
            status: 400,
          },
        )
      }

      data.status = status

      const now = new Date()

      if (
        status ===
        OpportunityStatus.TO_APPLY
      ) {
        data.nextAction =
          "Adapter mon CV puis envoyer ma candidature"
      }

      if (
        status ===
        OpportunityStatus.APPLIED
      ) {
        data.appliedAt = now
        data.nextAction =
          "Préparer le prochain entretien"
      }

      if (
        status ===
        OpportunityStatus.INTERVIEW
      ) {
        data.interviewAt = now
        data.nextAction =
          "Préparer et suivre mes entretiens"
      }

      if (
        status ===
        OpportunityStatus.OFFER
      ) {
        data.offerAt = now
        data.nextAction =
          "Évaluer l'offre reçue"
      }

      if (
        status ===
        OpportunityStatus.REJECTED
      ) {
        data.rejectedAt = now
        data.nextAction =
          "Capitaliser sur les enseignements"
      }

      if (
        status ===
        OpportunityStatus.ARCHIVED
      ) {
        data.archivedAt = now
        data.nextAction = null
      }

      if (
        status ===
        OpportunityStatus.TO_ANALYZE
      ) {
        data.nextAction =
          "Analyser cette opportunité avec mon profil"
      }

      if (
        status ===
        OpportunityStatus.DISCOVERED
      ) {
        data.nextAction =
          "Qualifier cette opportunité"
      }
    }

    if ("metadata" in body) {
      data.metadata =
        body.metadata ?? null
    }

    if ("nextAction" in body) {
      data.nextAction =
        cleanOptionalString(
          body.nextAction,
          500,
        )
    }

    if ("nextActionAt" in body) {
      data.nextActionAt =
        parseOptionalDate(
          body.nextActionAt,
        )
    }

    if (
      Object.keys(data).length === 0
    ) {
      return NextResponse.json(
        {
          error:
            "No supported fields to update",
        },
        {
          status: 400,
        },
      )
    }

    const opportunity =
      await prisma.opportunity.update({
        where: {
          id: existing.id,
        },
        data,
      })

    return NextResponse.json({
      opportunity,
    })
  } catch (error) {
    console.error(
      "[Opportunity PATCH] Unexpected error:",
      error,
    )

    return NextResponse.json(
      {
        error:
          "Failed to update opportunity",
      },
      {
        status: 500,
      },
    )
  }
}

export async function DELETE(
  _request: Request,
  context: RouteContext,
) {
  try {
    const user = await getAuthenticatedUser()

    if (!user) {
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

    const existing =
      await prisma.opportunity.findFirst({
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
          error:
            "Opportunity not found",
        },
        {
          status: 404,
        },
      )
    }

    await prisma.opportunity.delete({
      where: {
        id: existing.id,
      },
    })

    return NextResponse.json({
      success: true,
    })
  } catch (error) {
    console.error(
      "[Opportunity DELETE] Unexpected error:",
      error,
    )

    return NextResponse.json(
      {
        error:
          "Failed to delete opportunity",
      },
      {
        status: 500,
      },
    )
  }
}