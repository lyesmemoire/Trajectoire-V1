/**
 * POST /api/interview/realtime-message
 *
 * Persiste un tour de conversation (candidat ou IA) d'un entretien Realtime.
 * Appelée une fois par transcription finale (`final: true`) depuis
 * useRealtimeInterview — jamais via ConversationService.sendMessage, qui
 * déclencherait une génération IA redondante (OpenAI a déjà répondu en
 * vocal, notre backend ne fait qu'enregistrer la trace texte).
 */

import { NextRequest, NextResponse } from 'next/server'
import { getVerifiedUserWithRetry } from '@/lib/auth/verified-user'
import { Container, ServiceTokens } from '@/infrastructure/di'
import { initializeContainer } from '@/infrastructure/di/bootstrap'
import type { SessionRepository } from '@/infrastructure/repositories'
import type { MessageRepository } from '@/infrastructure/repositories'
import { rateLimit } from '@/lib/rate-limiting/rate-limit.middleware'
import { RouteType, RateLimitScope } from '@/lib/rate-limiting/centralized-rate-limit.service'
import { REALTIME_MAX_MESSAGE_CHARS } from '@/lib/interview/realtime-config'

async function handleRealtimeMessage(request: NextRequest) {
  try {
    const { user } = await getVerifiedUserWithRetry()
    if (!user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const body = await request.json().catch(() => ({})) as {
      sessionId?: string
      role?: string
      content?: string
    }

    if (
      typeof body.sessionId !== 'string' ||
      typeof body.content !== 'string' ||
      !body.sessionId ||
      !body.content.trim()
    ) {
      return NextResponse.json(
        { error: 'sessionId et content requis' },
        { status: 400 },
      )
    }

    if (body.role !== 'user' && body.role !== 'assistant') {
      return NextResponse.json(
        { error: 'role doit être "user" ou "assistant"' },
        { status: 400 },
      )
    }

    initializeContainer()

    const sessionRepository = (await Container.resolve(
      ServiceTokens.SessionRepository,
    )) as SessionRepository

    const session = await sessionRepository.findById(body.sessionId)
    if (!session) {
      return NextResponse.json({ error: 'Session introuvable' }, { status: 404 })
    }
    if (session.user_id !== user.id) {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
    }
    // Pas d'écriture dans une session terminée : le rapport lit ces messages.
    if (session.status !== 'in_progress') {
      return NextResponse.json({ error: 'Cette session est terminée' }, { status: 409 })
    }

    const messageRepository = (await Container.resolve(
      ServiceTokens.MessageRepository,
    )) as MessageRepository

    await messageRepository.create({
      session_id: body.sessionId,
      role: body.role,
      content: body.content.slice(0, REALTIME_MAX_MESSAGE_CHARS),
    })

    return NextResponse.json({ success: true })

  } catch (error: unknown) {
    console.error('[realtime-message]', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// Une requête par réplique : bucket dédié, par utilisateur (un entretien de 45 min en compte ~100).
export const POST = rateLimit(RouteType.INTERVIEW_TURN, handleRealtimeMessage, {
  scopes: [RateLimitScope.USER],
})
