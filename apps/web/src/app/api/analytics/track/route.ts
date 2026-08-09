// apps/web/src/app/api/analytics/track/route.ts
//
// API endpoint pour enregistrer des événements analytics
// Reçoit les payloads d'événements et les enregistre via EventTrackingService

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { EventTrackingService } from '@/lib/analytics/EventTrackingService'
import { EventPayload } from '@/types/events'
import { logger } from '@/lib/logger'

export async function POST(request: NextRequest) {
  try {
    const payload: EventPayload = await request.json()

    // Vérifier que l'utilisateur est authentifié
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Remplacer l'userId par celui de l'utilisateur authentifié
    payload.userId = user.id

    // Enregistrer l'événement
    const trackedEvent = await EventTrackingService.trackEvent(payload)

    return NextResponse.json({ success: true, event: trackedEvent })
  } catch (error) {
    logger.error({ err: error }, 'Error tracking event')
    return NextResponse.json(
      { error: 'Failed to track event' },
      { status: 500 }
    )
  }
}
