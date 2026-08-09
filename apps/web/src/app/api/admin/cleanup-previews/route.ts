// apps/web/src/app/api/admin/cleanup-previews/route.ts
//
// API admin pour déclencher le cleanup des previews expirées
// MVP-012 — Preview Analysis System

import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { previewCleanupJob, previewOldCleanupJob } from "@/lib/preview-analysis/previewCleanupJob"

export async function POST(req: NextRequest) {
  try {
    // Vérifier l'authentification et les permissions admin
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      )
    }

    // Verify admin permissions - check if user has admin role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json(
        { error: "Permissions insuffisantes" },
        { status: 403 }
      )
    }

    const { type } = await req.json()

    let result
    if (type === 'old') {
      result = await previewOldCleanupJob()
    } else {
      result = await previewCleanupJob()
    }

    return NextResponse.json(result)

  } catch (error) {
    console.error('[CleanupPreviews] Error:', error)
    return NextResponse.json(
      { error: "Erreur lors du cleanup" },
      { status: 500 }
    )
  }
}
