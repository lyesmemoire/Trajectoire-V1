import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import {
  previewCleanupJob,
  previewOldCleanupJob,
} from "@/lib/preview-analysis/previewCleanupJob"

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 },
      )
    }

    const { data: dbUser, error: userError } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .maybeSingle()

    if (userError) {
      console.error(
        "[CleanupPreviews] Failed to load user role:",
        userError,
      )

      return NextResponse.json(
        { error: "Erreur lors de la vérification des permissions" },
        { status: 500 },
      )
    }

    const ADMIN_ROLES = [
  "ADMIN_SUPPORT",
  "ADMIN_PRODUCT",
  "ADMIN_FOUNDER",
] as const

if (
  !dbUser ||
  !ADMIN_ROLES.includes(
    dbUser.role as (typeof ADMIN_ROLES)[number],
  )
) {
  return NextResponse.json(
    { error: "Permissions insuffisantes" },
    { status: 403 },
  )
}

    const body = await req.json()
    const type = body?.type

    const result =
      type === "old"
        ? await previewOldCleanupJob()
        : await previewCleanupJob()

    return NextResponse.json(result)
  } catch (error) {
    console.error("[CleanupPreviews] Error:", error)

    return NextResponse.json(
      { error: "Erreur lors du cleanup" },
      { status: 500 },
    )
  }
}