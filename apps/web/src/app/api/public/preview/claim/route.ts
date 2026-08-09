// apps/web/src/app/api/public/preview/claim/route.ts
//
// API endpoint pour claimer une analyse preview et la transférer vers le compte utilisateur
// MVP-007 — ATS Preview Persistence

import { NextRequest, NextResponse } from 'next/server'
import { PreviewTransferService } from '@/lib/preview/PreviewTransferService'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'
import { ClaimPreviewPayload } from '@/types/preview'

export async function POST(req: NextRequest) {
  try {
    // 1. Vérifier l'authentification
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    // 2. Parser le payload
    const payload: ClaimPreviewPayload = await req.json()

    // 3. Validation
    if (!payload.token) {
      return NextResponse.json(
        { error: 'Token requis' },
        { status: 400 }
      )
    }

    // 4. Transférer la preview vers l'utilisateur
    const result = await PreviewTransferService.transferPreviewToUser(
      payload.token,
      user.id
    )

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    logger.info(
      { token: payload.token, userId: user.id, analysisId: result.analysisId },
      'Preview claimed successfully'
    )

    return NextResponse.json(result)
  } catch (error) {
    logger.error({ err: error }, 'Error claiming preview')
    return NextResponse.json(
      { error: 'Erreur lors du claim de la preview' },
      { status: 500 }
    )
  }
}
