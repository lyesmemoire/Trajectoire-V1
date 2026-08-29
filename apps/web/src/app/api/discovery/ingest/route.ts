import {
  NextResponse,
} from "next/server"

import {
  ingestDiscoveryJobs,
} from "@/lib/discovery/ingestDiscoveryJobs"

import type {
  DiscoveryProvider,
} from "@/lib/discovery/types"

import {
  createClient,
} from "@/lib/supabase/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

type IngestBody = {
  provider?: unknown
  company?: unknown
  boardKey?: unknown
}

const PROVIDERS =
  new Set<DiscoveryProvider>([
    "GREENHOUSE",
    "LEVER",
    "ASHBY",
  ])

function stringValue(
  value: unknown,
): string {
  return typeof value === "string"
    ? value.trim()
    : ""
}

function providerValue(
  value: unknown,
): DiscoveryProvider | null {
  const provider =
    stringValue(value)
      .toUpperCase()

  return PROVIDERS.has(
    provider as DiscoveryProvider,
  )
    ? provider as DiscoveryProvider
    : null
}

export async function POST(
  request: Request,
) {
  const supabase =
    await createClient()

  const {
    data: {
      user,
    },
  } =
    await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json(
      {
        success: false,
        error: "Unauthorized",
      },
      {
        status: 401,
      },
    )
  }

  let body: IngestBody

  try {
    body =
      await request.json()
  }
  catch {
    return NextResponse.json(
      {
        success: false,
        error: "Invalid JSON body",
      },
      {
        status: 400,
      },
    )
  }

  const provider =
    providerValue(
      body.provider,
    )

  const company =
    stringValue(
      body.company,
    )

  const boardKey =
    stringValue(
      body.boardKey,
    )

  if (
    !provider ||
    !company ||
    !boardKey
  ) {
    return NextResponse.json(
      {
        success: false,
        error:
          "provider, company and boardKey are required",
      },
      {
        status: 400,
      },
    )
  }

  if (
    company.length > 200 ||
    boardKey.length > 120
  ) {
    return NextResponse.json(
      {
        success: false,
        error:
          "Discovery source values are too long",
      },
      {
        status: 400,
      },
    )
  }

  try {
    const result =
      await ingestDiscoveryJobs({
        userId:
          user.id,

        provider,
        company,
        boardKey,
      })

    return NextResponse.json({
      success: true,
      result,
    })
  }
  catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Discovery ingestion failed"

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      {
        status: 502,
      },
    )
  }
}