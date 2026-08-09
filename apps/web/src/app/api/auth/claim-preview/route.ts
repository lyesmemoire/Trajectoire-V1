// apps/web/src/app/api/auth/claim-preview/route.ts
//
// API pour revendiquer une preview analysis après création de compte
// MVP-012 — Preview Analysis System

import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { previewAnalysisService } from "@/lib/preview-analysis/PreviewAnalysisService"
import { logger } from "@/lib/logger"
import * as Sentry from "@sentry/nextjs"

export async function POST(req: NextRequest) {
  try {
    // 1. Vérifier l'authentification
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      )
    }

    // 2. Récupérer le preview token depuis le body ou le cookie
    const body = await req.json()
    const previewToken = body.previewToken || req.cookies.get('preview_token')?.value

    if (!previewToken) {
      return NextResponse.json(
        { error: "Preview token manquant" },
        { status: 400 }
      )
    }

    // 3. Revendiquer la preview analysis
    await previewAnalysisService.claimPreview(previewToken, user.id)

    // 4. Supprimer le cookie
    const response = NextResponse.json({
      success: true,
      message: "Preview analysis revendiquée avec succès",
    })

    response.cookies.delete('preview_token')

    return response

  } catch (error) {
    Sentry.captureException(error, {
      tags: { route: "claim-preview" },
    })
    logger.error({ err: error, route: "/api/auth/claim-preview" }, "Claim preview failed")

    if (error instanceof Error) {
      if (error.message === 'Invalid or expired preview token') {
        return NextResponse.json(
          { error: "Token invalide ou expiré" },
          { status: 400 }
        )
      }
      if (error.message === 'Preview analysis not found') {
        return NextResponse.json(
          { error: "Analyse preview non trouvée" },
          { status: 404 }
        )
      }
      if (error.message === 'Preview analysis already claimed') {
        return NextResponse.json(
          { error: "Analyse déjà revendiquée" },
          { status: 409 }
        )
      }
    }

    return NextResponse.json(
      { error: "Erreur lors de la revendication" },
      { status: 500 }
    )
  }
}
