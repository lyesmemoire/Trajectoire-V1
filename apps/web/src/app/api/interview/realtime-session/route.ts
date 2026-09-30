/**
 * POST /api/interview/realtime-session
 *
 * Crée une session OpenAI Realtime full-duplex (audio ↔ audio).
 * Retourne un token éphémère + une question d'ouverture.
 *
 * Flow :
 *   1. Choisit la question d'ouverture selon le type d'entretien (session DB)
 *   2. Crée session OpenAI Realtime avec le system prompt correspondant
 *   3. Retourne { client_secret, session_id, first_question }
 */

import { NextRequest, NextResponse } from 'next/server'
import { getVerifiedUserWithRetry } from '@/lib/auth/verified-user'
import { getOpenAIKey } from '@/lib/ai/ai-models'
import { Container, ServiceTokens } from '@/infrastructure/di'
import { initializeContainer } from '@/infrastructure/di/bootstrap'
import type { SessionRepository } from '@/infrastructure/repositories'
import { rateLimit } from '@/lib/rate-limiting/rate-limit.middleware'
import { RouteType, RateLimitScope } from '@/lib/rate-limiting/centralized-rate-limit.service'

// ── Question d'ouverture ─────────────────────────────────────────────────────
// Il n'y a plus de kernel HIIOS ici : celui qui existait avant n'était jamais
// relu par la suite du flux (voir .claude/tasks.md, diagnostic 2026-09-29) —
// une question fixe par type d'entretien suffit pour amorcer la conversation.

const OPENING_QUESTIONS: Record<string, { id: string; text: string }> = {
  RH: {
    id  : 'opening_rh',
    text: "Pouvez-vous me parler de votre parcours et de ce qui vous amène à candidater aujourd'hui ?",
  },
  Technique: {
    id  : 'opening_technique',
    text: 'Pouvez-vous décrire un problème technique complexe que vous avez résolu récemment, et la démarche que vous avez suivie ?',
  },
  Manager: {
    id  : 'opening_manager',
    text: 'Racontez-moi une situation où vous avez dû prendre une décision difficile concernant votre équipe.',
  },
}

const DEFAULT_OPENING_QUESTION = OPENING_QUESTIONS.RH

// ── Helpers ──────────────────────────────────────────────────────────────────

function buildRealtimeSystemPrompt(
  firstQuestion: string,
  jobTitle?: string,
): string {
  return `Tu es Alexandra, une intervieweuse professionnelle expérimentée qui conduit un entretien de recrutement pour le poste de ${jobTitle ?? 'professionnel'}.

RÈGLES ABSOLUES :
1. Tu parles UNIQUEMENT en français.
2. Tu es humaine, directe, professionnelle. Jamais de listes à puces.
3. Tes interventions sont courtes : maximum 2-3 phrases.
4. Tu écoutes attentivement et tu rebondis sur ce que dit le candidat.
5. Tu poses UNE seule question à la fois.
6. Si le candidat s'éloigne du sujet, tu le recadres poliment.
7. Tu n'es PAS un assistant IA — tu es une vraie recruteuse.
8. Après chaque réponse du candidat, tu analyses et poses la question suivante logique.

STRUCTURE DE L'ENTRETIEN :
- Phase 1 (tours 1-2) : Exploration du parcours
- Phase 2 (tours 3-4) : Compétences et expériences clés
- Phase 3 (tours 5-6) : Mise en situation et pression
- Phase 4 (tour 7+)   : Questions du candidat + clôture

PREMIÈRE QUESTION À POSER :
"${firstQuestion}"

Commence immédiatement par cette question. Ne te présente pas longuement.`
}

// ── Route principale ─────────────────────────────────────────────────────────

async function handleRealtimeSession(request: NextRequest) {
  try {
    // Auth
    const { user } = await getVerifiedUserWithRetry()
    if (!user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const apiKey = getOpenAIKey()
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenAI non configuré' },
        { status: 503 },
      )
    }

    // Body optionnel
    const body = await request.json().catch(() => ({})) as {
      jobTitle?: string
      candidateId?: string
    }

    // ── Session obligatoire ──────────────────────────────────────────────────
    // `candidateId` est l'id de la session `interview_sessions` (voir
    // useRealtimeInterview.ts). Cette session n'existe que si `/api/simulation/create`
    // l'a acceptée, donc après contrôle et décompte du quota (FREE : aucune simulation,
    // Pack épuisé ou expiré : refus). Exiger une session à soi, encore en cours, empêche
    // d'obtenir des jetons Realtime (payants) en contournant le quota. On ne re-vérifie
    // pas le quota ici : la simulation est déjà décomptée, un Pack à sa dernière
    // simulation serait sinon bloqué à tort.
    if (!body.candidateId || typeof body.candidateId !== 'string') {
      return NextResponse.json({ error: 'Session requise' }, { status: 400 })
    }

    let firstQuestion = DEFAULT_OPENING_QUESTION
    try {
      initializeContainer()
      const sessionRepository = (await Container.resolve(
        ServiceTokens.SessionRepository,
      )) as SessionRepository

      const session = await sessionRepository.findById(body.candidateId)
      // Même réponse pour « absente » et « à un autre » : pas d'oracle d'existence.
      if (!session || session.user_id !== user.id) {
        return NextResponse.json({ error: 'Session introuvable' }, { status: 404 })
      }
      if (session.status !== 'in_progress') {
        return NextResponse.json({ error: 'Cette session est terminée' }, { status: 409 })
      }
      firstQuestion = OPENING_QUESTIONS[session.interview_type] ?? DEFAULT_OPENING_QUESTION
    } catch (err) {
      // Échec fermé : sans vérification de la session, pas de jeton.
      console.error('[realtime-session] lookup session:', err)
      return NextResponse.json({ error: 'Vérification de la session impossible' }, { status: 503 })
    }

    // ── Créer session OpenAI Realtime ─────────────────────────────────────────
    const systemPrompt = buildRealtimeSystemPrompt(
      firstQuestion.text,
      body.jobTitle,
    )

    const openaiRes = await fetch('https://api.openai.com/v1/realtime/sessions', {
      method : 'POST',
      headers: {
        Authorization  : `Bearer ${apiKey}`,
        'Content-Type' : 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-realtime-preview-2025-06-03',
        voice: 'alloy',
        instructions: systemPrompt,
        modalities: ['audio', 'text'],
        turn_detection: {
          type                : 'server_vad',
          silence_duration_ms : 800,
          threshold           : 0.5,
          prefix_padding_ms   : 300,
        },
        input_audio_transcription: {
          model: 'whisper-1',
        },
        temperature: 0.8,
      }),
    })

    if (!openaiRes.ok) {
      const errorText = await openaiRes.text()
      console.error('[realtime-session] OpenAI error:', errorText)
      return NextResponse.json(
        { error: errorText },
        { status: 502 },
      )
    }

    const openaiData = await openaiRes.json()

    // ── Retourner les infos au client ─────────────────────────────────────────
    return NextResponse.json({
      client_secret     : openaiData.client_secret.value,
      openai_session_id : openaiData.id,
      session_id        : body.candidateId ?? null,
      first_question    : firstQuestion.text,
      question_id       : firstQuestion.id,
    })

  } catch (error: unknown) {
    console.error('[realtime-session]', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// Limite de débit par utilisateur et par IP : chaque appel ouvre une session OpenAI facturée.
export const POST = rateLimit(RouteType.SIMULATION, handleRealtimeSession, {
  scopes: [RateLimitScope.USER, RateLimitScope.IP],
})
