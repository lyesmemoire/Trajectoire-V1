/**
 * POST /api/interview/realtime-session
 *
 * Prépare une conversation vocale avec l'API Realtime d'OpenAI (version GA, WebRTC) :
 *   1. vérifie que la séance appartient à l'utilisateur et est en cours (elle a déjà été décomptée du quota) ;
 *   2. construit les consignes de la recruteuse à partir de la séance (poste, niveau, durée, type) et du
 *      contexte de l'entretien texte (CV, offre, compétences à vérifier, priorités) ;
 *   3. crée un jeton éphémère : POST /v1/realtime/client_secrets avec la session complète.
 * Le navigateur se connecte ensuite directement à OpenAI (POST /v1/realtime/calls, voir le hook).
 *
 * Retourne { client_secret, expires_at, session_id, first_question, opening_persisted, resumed, mandatory_question, duration_seconds }.
 */

import { NextRequest, NextResponse } from 'next/server'
import { getVerifiedUserWithRetry } from '@/lib/auth/verified-user'
import { getOpenAIKey } from '@/lib/ai/ai-models'
import { Container, ServiceTokens } from '@/infrastructure/di'
import { initializeContainer } from '@/infrastructure/di/bootstrap'
import type { MessageRepository, SessionRepository } from '@/infrastructure/repositories'
import { UnifiedInterviewContextService } from '@/application/interview-context/UnifiedInterviewContextService'
import { createClient } from '@/lib/supabase/server'
import { rateLimit } from '@/lib/rate-limiting/rate-limit.middleware'
import { RouteType, RateLimitScope } from '@/lib/rate-limiting/centralized-rate-limit.service'
import {
  REALTIME_CLIENT_SECRETS_URL,
  REALTIME_CLIENT_SECRET_TTL_SECONDS,
  REALTIME_MODEL,
  REALTIME_TRANSCRIPTION_LANGUAGE,
  REALTIME_TRANSCRIPTION_MODEL,
  REALTIME_VOICE,
} from '@/lib/interview/realtime-config'
import { buildRealtimeInstructions, isResumedSession } from '@/lib/interview/realtime-instructions'
import { mandatoryQuestionAsked, readSessionSetup } from '@/lib/interview/session-setup'
import { logger } from '@/lib/logger'

// Question d'ouverture de repli (séance sans question enregistrée) : une par type d'entretien.
const OPENING_QUESTIONS: Record<string, string> = {
  RH: "Pouvez-vous me parler de votre parcours et de ce qui vous amène à candidater aujourd'hui ?",
  Technique: 'Pouvez-vous décrire un problème technique complexe que vous avez résolu récemment, et la démarche que vous avez suivie ?',
  Manager: 'Racontez-moi une situation où vous avez dû prendre une décision difficile concernant votre équipe.',
}

const DEFAULT_OPENING_QUESTION = OPENING_QUESTIONS.RH

function json(body: Record<string, unknown>, status: number) {
  return NextResponse.json(body, { status })
}

async function handleRealtimeSession(request: NextRequest) {
  try {
    const { user } = await getVerifiedUserWithRetry()
    if (!user) return json({ error: 'Non authentifié' }, 401)

    const apiKey = getOpenAIKey()
    if (!apiKey) return json({ error: 'Service vocal non configuré' }, 503)

    const body = (await request.json().catch(() => ({}))) as { candidateId?: string }

    // ── Session obligatoire ──────────────────────────────────────────────────
    // `candidateId` est l'id de la session `interview_sessions`. Elle n'existe que si `/api/simulation/create`
    // l'a acceptée, donc après contrôle et décompte du quota (FREE : aucune simulation, Pack épuisé ou
    // expiré : refus). Exiger une session à soi, encore en cours, empêche d'obtenir des jetons payants en
    // contournant le quota. Le quota n'est pas revérifié ici : la simulation est déjà décomptée.
    if (!body.candidateId || typeof body.candidateId !== 'string') return json({ error: 'Session requise' }, 400)

    let instructions: string
    let openingQuestion: string
    let openingPersisted = false
    let resumed = false
    let pendingMandatoryQuestion: string | null = null
    let durationSeconds: number

    try {
      initializeContainer()
      const sessionRepository = (await Container.resolve(ServiceTokens.SessionRepository)) as SessionRepository
      const session = await sessionRepository.findById(body.candidateId)
      // Même réponse pour « absente » et « à un autre » : pas d'oracle d'existence.
      if (!session || session.user_id !== user.id) return json({ error: 'Session introuvable' }, 404)
      if (session.status !== 'in_progress') return json({ error: 'Cette session est terminée' }, 409)

      // Question d'ouverture : celle déjà générée et enregistrée à la création de la séance (avec le CV et
      // l'offre), sinon la question de repli du type. La recruteuse pose exactement celle-là : la
      // transcription enregistrée et le rapport restent cohérents.
      const messageRepository = (await Container.resolve(ServiceTokens.MessageRepository)) as MessageRepository
      const messages = await messageRepository.getBySessionId(session.id)
      const stored = messages.find(m => m.role === 'assistant' && m.content.trim())
      const history = messages.map(m => ({ role: m.role, content: m.content }))
      openingQuestion = stored?.content.trim() ?? OPENING_QUESTIONS[session.interview_type] ?? DEFAULT_OPENING_QUESTION
      // Ouverture déjà enregistrée : seulement pour une séance neuve (un seul message, la question). Sinon
      // (page rechargée en cours d'entretien), la recruteuse reprend au lieu de rouvrir.
      openingPersisted = Boolean(stored) && messages.length === 1
      resumed = isResumedSession(history)

      // Réglages choisis à la création : difficulté et question imposée (à poser une seule fois).
      const setup = readSessionSetup(session.analysis)
      pendingMandatoryQuestion = mandatoryQuestionAsked(setup.mandatoryQuestion, history) ? null : setup.mandatoryQuestion

      // Même contexte que l'entretien texte. Son échec n'empêche pas la séance : consignes sans CV ni offre.
      let context = null
      try {
        const supabase = await createClient()
        context = await new UnifiedInterviewContextService(supabase).build({ userId: user.id, sessionId: session.id })
      } catch (error) {
        logger.warn({ err: error, sessionId: session.id }, '[realtime-session] contexte de l\'entretien indisponible')
      }

      durationSeconds = session.duration_seconds
      instructions = buildRealtimeInstructions({
        jobTitle: session.job_title,
        level: session.level,
        interviewType: session.interview_type,
        durationMinutes: Math.round(session.duration_seconds / 60),
        openingQuestion,
        difficulty: setup.difficulty,
        hasMandatoryQuestion: Boolean(pendingMandatoryQuestion),
        history,
        cvText: context?.candidate.cvText,
        jobDescription: context?.job.description,
        matchedSkills: context?.matching.matchedSkills,
        missingSkills: context?.matching.missingSkills,
        priorities: context?.topRisks.map(r => ({ title: r.title, reason: r.reason, competency: r.competency })),
      })
    } catch (err) {
      // Échec fermé : sans vérification de la session, pas de jeton.
      logger.error({ err }, '[realtime-session] lookup session')
      return json({ error: 'Vérification de la session impossible' }, 503)
    }

    // ── Jeton éphémère (API Realtime GA) ─────────────────────────────────────
    const model = process.env.OPENAI_REALTIME_MODEL?.trim() || REALTIME_MODEL

    const openaiRes = await fetch(REALTIME_CLIENT_SECRETS_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        expires_after: { anchor: 'created_at', seconds: REALTIME_CLIENT_SECRET_TTL_SECONDS },
        session: {
          type: 'realtime',
          model,
          instructions,
          audio: {
            input: {
              transcription: { model: REALTIME_TRANSCRIPTION_MODEL, language: REALTIME_TRANSCRIPTION_LANGUAGE },
              // Un entretien laisse réfléchir : détection sémantique de fin de parole, patiente.
              turn_detection: { type: 'semantic_vad', eagerness: 'low', create_response: true, interrupt_response: true },
              noise_reduction: { type: 'near_field' },
            },
            output: { voice: REALTIME_VOICE },
          },
        },
      }),
    })

    if (!openaiRes.ok) {
      // Le texte d'erreur d'OpenAI reste dans les journaux : il n'est jamais renvoyé au navigateur.
      const errorText = await openaiRes.text().catch(() => '')
      logger.error({ status: openaiRes.status, model, errorText: errorText.slice(0, 500) }, '[realtime-session] OpenAI a refusé la session')
      return json({ error: 'Service vocal momentanément indisponible' }, 502)
    }

    const created = (await openaiRes.json()) as { value?: string; expires_at?: number }
    if (!created.value) {
      logger.error({ model }, '[realtime-session] réponse OpenAI sans jeton')
      return json({ error: 'Service vocal momentanément indisponible' }, 502)
    }

    return NextResponse.json({
      client_secret: created.value,
      expires_at: created.expires_at ?? null,
      session_id: body.candidateId,
      first_question: openingQuestion,
      opening_persisted: openingPersisted,
      resumed,
      mandatory_question: pendingMandatoryQuestion,
      duration_seconds: durationSeconds,
    })
  } catch (error: unknown) {
    logger.error({ err: error }, '[realtime-session]')
    return json({ error: 'Erreur serveur' }, 500)
  }
}

// Limite de débit par utilisateur et par IP : chaque appel ouvre une session OpenAI facturée.
export const POST = rateLimit(RouteType.SIMULATION, handleRealtimeSession, {
  scopes: [RateLimitScope.USER, RateLimitScope.IP],
})
