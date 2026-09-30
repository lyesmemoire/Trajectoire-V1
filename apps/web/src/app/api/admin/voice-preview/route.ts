/**
 * GET /api/admin/voice-preview?persona=…&voice=…
 *
 * Aperçu audio d'une voix de la recruteuse, réservé aux administrateurs (page /admin/voix). Phrase d'essai
 * fixe (aucun texte client), paramètres validés contre des listes fermées, réponse mise en cache côté
 * navigateur pour ne pas refacturer une réécoute. La règle `/api/admin` d'AuthorizationV2 protège déjà la
 * route ; le rôle est revérifié ici.
 */

import { NextRequest, NextResponse } from "next/server"
import { getVerifiedUserWithRetry } from "@/lib/auth/verified-user"
import { getOpenAIKey } from "@/lib/ai/ai-models"
import { rateLimit } from "@/lib/rate-limiting/rate-limit.middleware"
import { RouteType, RateLimitScope } from "@/lib/rate-limiting/centralized-rate-limit.service"
import {
  AUDITION_MODEL,
  AUDITION_SAMPLES,
  AUDITION_URL,
  parseAuditionVoice,
  parsePersona,
} from "@/lib/interview/voice-audition"
import { logger } from "@/lib/logger"

const json = (body: Record<string, unknown>, status: number) => NextResponse.json(body, { status })

async function handle(request: NextRequest) {
  try {
    const { user } = await getVerifiedUserWithRetry()
    if (!user) return json({ error: "Non authentifié" }, 401)

    const { AuthorizationModule } = await import("@/lib/authorization/AuthorizationModule")
    const auth = await AuthorizationModule.create(user.id)
    if (!auth.isAdmin()) return json({ error: "Introuvable" }, 404)

    const apiKey = getOpenAIKey()
    if (!apiKey) return json({ error: "Service non configuré" }, 503)

    const persona = parsePersona(request.nextUrl.searchParams.get("persona"))
    const voice = parseAuditionVoice(request.nextUrl.searchParams.get("voice"), persona)
    const sample = AUDITION_SAMPLES[persona]

    const res = await fetch(AUDITION_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: AUDITION_MODEL, voice, input: sample.text, instructions: sample.tone, response_format: "mp3" }),
    })

    if (!res.ok) {
      const errorText = await res.text().catch(() => "")
      logger.error({ status: res.status, voice, errorText: errorText.slice(0, 300) }, "[voice-preview] OpenAI a refusé")
      return json({ error: "Aperçu indisponible" }, 502)
    }

    return new NextResponse(await res.arrayBuffer(), {
      status: 200,
      headers: { "Content-Type": "audio/mpeg", "Cache-Control": "private, max-age=3600" },
    })
  } catch (error) {
    logger.error({ err: error }, "[voice-preview]")
    return json({ error: "Erreur serveur" }, 500)
  }
}

export const maxDuration = 30

export const GET = rateLimit(RouteType.AI, handle, { scopes: [RateLimitScope.USER] })
