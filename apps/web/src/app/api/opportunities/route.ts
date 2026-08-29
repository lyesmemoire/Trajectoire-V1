import { NextResponse } from "next/server"
import { OpportunityStatus } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import { createClient } from "@/lib/supabase/server"

export const runtime = "nodejs"

const MAX_DESCRIPTION_LENGTH = 50_000

type CreateOpportunityBody = {
  title?: unknown
  company?: unknown
  location?: unknown
  sourceUrl?: unknown
  source?: unknown
  description?: unknown
  status?: unknown
  nextAction?: unknown
  nextActionAt?: unknown
}

function cleanOptionalString(value: unknown, maxLength = 500): string | null {
  if (typeof value !== "string") return null

  const cleaned = value.trim()

  if (!cleaned) return null

  return cleaned.slice(0, maxLength)
}

function parseStatus(value: unknown): OpportunityStatus {
  if (
    typeof value === "string" &&
    Object.values(OpportunityStatus).includes(value as OpportunityStatus)
  ) {
    return value as OpportunityStatus
  }

  return OpportunityStatus.DISCOVERED
}

function parseOptionalDate(value: unknown): Date | null {
  if (typeof value !== "string" || !value.trim()) return null

  const date = new Date(value)

  return Number.isNaN(date.getTime()) ? null : date
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

export async function GET() {
  try {
    const user = await getAuthenticatedUser()

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      )
    }

    const opportunities = await prisma.opportunity.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        updatedAt: "desc",
      },
    })

    return NextResponse.json({
      opportunities,
    })
  } catch (error) {
    console.error("[Opportunities GET] Unexpected error:", error)

    return NextResponse.json(
      { error: "Failed to load opportunities" },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser()

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      )
    }

    let body: CreateOpportunityBody

    try {
      body = (await request.json()) as CreateOpportunityBody
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 },
      )
    }

    const title = cleanOptionalString(body.title, 200)
    const description =
      typeof body.description === "string"
        ? body.description.trim()
        : ""

    if (!title) {
      return NextResponse.json(
        { error: "title is required" },
        { status: 400 },
      )
    }

    if (!description) {
      return NextResponse.json(
        { error: "description is required" },
        { status: 400 },
      )
    }

    if (description.length > MAX_DESCRIPTION_LENGTH) {
      return NextResponse.json(
        {
          error: `description must contain at most ${MAX_DESCRIPTION_LENGTH} characters`,
        },
        { status: 413 },
      )
    }

    const opportunity = await prisma.opportunity.create({
      data: {
        userId: user.id,
        title,
        company: cleanOptionalString(body.company, 200),
        location: cleanOptionalString(body.location, 200),
        sourceUrl: cleanOptionalString(body.sourceUrl, 2_000),
        source: cleanOptionalString(body.source, 100),
        description,
        status: parseStatus(body.status),
        nextAction: cleanOptionalString(body.nextAction, 500),
        nextActionAt: parseOptionalDate(body.nextActionAt),
      },
    })

    return NextResponse.json(
      { opportunity },
      { status: 201 },
    )
  } catch (error) {
    console.error("[Opportunities POST] Unexpected error:", error)

    return NextResponse.json(
      { error: "Failed to create opportunity" },
      { status: 500 },
    )
  }
}