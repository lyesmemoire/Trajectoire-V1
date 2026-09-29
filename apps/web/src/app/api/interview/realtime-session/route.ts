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

export async function POST(request: NextRequest) {
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

    // ── Choisir la question d'ouverture ──────────────────────────────────────
    // `candidateId` est en réalité l'id de la session `interview_sessions`
    // (voir useRealtimeInterview.ts) : on l'utilise pour retrouver le type
    // d'entretien choisi à la création. Si la session est introuvable ou
    // n'appartient pas à l'utilisateur, on retombe sur une question par défaut
    // plutôt que de bloquer la connexion Realtime.
    let firstQuestion = DEFAULT_OPENING_QUESTION

    if (body.candidateId) {
      try {
        initializeContainer()
        const sessionRepository = (await Container.resolve(
          ServiceTokens.SessionRepository,
        )) as SessionRepository

        const session = await sessionRepository.findById(body.candidateId)
        if (session && session.user_id === user.id) {
          firstQuestion = OPENING_QUESTIONS[session.interview_type] ?? DEFAULT_OPENING_QUESTION
        }
      } catch (err) {
        console.error('[realtime-session] lookup session:', err)
      }
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
