/**
 * POST /api/interview/realtime-session
 *
 * Crée une session OpenAI Realtime full-duplex (audio ↔ audio).
 * Retourne un token éphémère + session_id HIIOS.
 *
 * Flow :
 *   1. Démarre le kernel HIIOS → génère session_id + première question
 *   2. Crée session OpenAI Realtime avec le system prompt HIIOS
 *   3. Retourne { client_secret, session_id, first_question }
 */

import { NextRequest, NextResponse } from 'next/server'
import { getVerifiedUserWithRetry } from '@/lib/auth/verified-user'
import { getOpenAIKey } from '@/lib/ai/ai-models'
import { KernelState } from '@/application/hiios/layer0-kernel/KernelState'

// ── Store en mémoire (même map que /api/interview/route.ts) ──────────────────
// On exporte pour partager entre les deux routes
export const realtimeSessions = new Map<string, KernelState>()

// ── Helpers ──────────────────────────────────────────────────────────────────

function generateSessionId(): string {
  return `rt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

function initializeDefaultHypotheses(kernel: KernelState): void {
  const defaults = [
    { label: 'Leadership fort sous pression',     node: 'leadership.decision',                  prior: 0.45 },
    { label: 'Communication claire',              node: 'communication.clarte',                 prior: 0.45 },
    { label: 'Exécution fiable sous contrainte',  node: 'execution.livraison',                  prior: 0.45 },
    { label: 'Conscience de soi développée',      node: 'intelligence_emotionnelle.conscienceSoi', prior: 0.40 },
    { label: 'Résilience face à l\'échec',        node: 'intelligence_emotionnelle.resilience', prior: 0.45 },
  ]
  for (const d of defaults) {
    kernel.hypothesis.generate({
      label          : d.label,
      description    : `Hypothèse initiale — ${d.label}`,
      skill_node_id  : d.node,
      prior          : d.prior,
      created_at_turn: 0,
    })
  }
}

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

    // ── 1. Démarrer le kernel HIIOS ──────────────────────────────────────────
    const sessionId = generateSessionId()
    const candidateId = body.candidateId ?? user.id

    const kernel = new KernelState(sessionId, candidateId)
    initializeDefaultHypotheses(kernel)
    realtimeSessions.set(sessionId, kernel)

    const firstQuestion = kernel.questions.selectNext({
      current_turn       : 0,
      interview_state    : 'EXPLORATION',
      empathy_level      : kernel.session.empathy_level,
      pressure_level     : kernel.session.pressure_level,
      active_bias_types  : [],
      candidate_archetype: 'Senior',
    })

    // ── 2. Créer session OpenAI Realtime ─────────────────────────────────────
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

    // ── 3. Retourner les infos au client ─────────────────────────────────────
    return NextResponse.json({
      client_secret  : openaiData.client_secret.value,
      openai_session_id: openaiData.id,
      session_id     : sessionId,        // notre session HIIOS
      first_question : firstQuestion.text,
      question_id    : firstQuestion.id,
    })

  } catch (error: unknown) {
    console.error('[realtime-session]', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

