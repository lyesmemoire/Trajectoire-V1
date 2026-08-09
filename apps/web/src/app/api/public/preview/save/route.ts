// apps/web/src/app/api/public/preview/save/route.ts
//
// API endpoint pour sauvegarder une analyse preview
// MVP-007 — ATS Preview Persistence

import { NextRequest, NextResponse } from 'next/server'
import { PreviewStorageService } from '@/lib/preview/PreviewStorageService'
import { generateFingerprint } from '@/lib/security/ip-extraction'
import { checkRateLimit } from '@/lib/rate-limit/upstash-rate-limit'
import { SavePreviewPayload } from '@/types/preview'
import { logger } from '@/lib/logger'

export async function POST(req: NextRequest) {
  try {
    // 1. Rate limiting (5/heure par IP)
    const fingerprint = generateFingerprint(req)
    const rateLimit = await checkRateLimit(`preview-save:${fingerprint}`, 5, 3600)

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

    // 2. Parser le payload
    const payload: SavePreviewPayload = await req.json()

    // 3. Validation basique
    if (!payload.atsResult || !payload.candidateData) {
      return NextResponse.json(
        { error: 'Payload invalide. atsResult et candidateData sont requis.' },
        { status: 400 }
      )
    }

    // 4. Sauvegarder la preview
    const result = await PreviewStorageService.savePreview(
      payload,
      fingerprint,
      fingerprint
    )

    logger.info(
      { token: result.token, expiresAt: result.expiresAt },
      'Preview saved successfully'
    )

    return NextResponse.json(result)
  } catch (error) {
    logger.error({ err: error }, 'Error saving preview')
    return NextResponse.json(
      { error: 'Erreur lors de la sauvegarde de la preview' },
      { status: 500 }
    )
  }
}
