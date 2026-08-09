// apps/web/src/app/api/public/preview/[token]/route.ts
//
// API endpoint pour récupérer une analyse preview par son token
// MVP-007 — ATS Preview Persistence

import { NextRequest, NextResponse } from 'next/server'
import { PreviewStorageService } from '@/lib/preview/PreviewStorageService'
import { checkRateLimit } from '@/lib/rate-limit/upstash-rate-limit'
import { logger } from '@/lib/logger'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params

    // 1. Rate limiting (10/heure par IP)
    const rateLimit = await checkRateLimit(`preview-get:${token}`, 10, 3600)

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Trop de requêtes. Réessayez plus tard.' },
        {
          status: 429,
          headers: {
            'Retry-After': Math.ceil((rateLimit.reset - Date.now()) / 1000).toString(),
          },
        }
      )
    }

    // 2. Récupérer la preview
    const preview = await PreviewStorageService.getPreviewByToken(token)

    if (!preview) {
      return NextResponse.json(
        { error: 'Preview non trouvée, expirée ou déjà consommée' },
        { status: 404 }
      )
    }

    logger.info({ token }, 'Preview retrieved successfully')

    return NextResponse.json(preview)
  } catch (error) {
    const { token } = await params
    logger.error({ err: error, token }, 'Error retrieving preview')
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de la preview' },
      { status: 500 }
    )
  }
}
