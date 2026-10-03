/**
 * POST /api/radar/searches/[id]/run : exécute une recherche maintenant (en plus de la tâche planifiée).
 *
 * - recherche de l'utilisateur uniquement (404 sinon) ;
 * - 503 `SOURCES_NOT_CONFIGURED` tant qu'aucune source d'offres n'est branchée (aucune offre simulée) ;
 * - 429 si la recherche a déjà été exécutée il y a moins de RUN_COOLDOWN_MINUTES minutes ;
 * - limite de débit par utilisateur (chaque exécution appelle des API externes).
 */

import { NextRequest, NextResponse } from "next/server"
import { getVerifiedUserWithRetry } from "@/lib/auth/verified-user"
import { prisma } from "@/lib/prisma"
import { logger } from "@/lib/logger"
import { rateLimit } from "@/lib/rate-limiting/rate-limit.middleware"
import { RouteType, RateLimitScope } from "@/lib/rate-limiting/centralized-rate-limit.service"
import { criteriaFromSearch } from "@/lib/radar/mappers"
import { getConfiguredSources } from "@/lib/radar/sources"
import { getLatestCvText, runRadarSearch } from "@/lib/radar/sync"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const maxDuration = 60

export const RUN_COOLDOWN_MINUTES = 10

type Context = { params: Promise<{ id: string }> }

const json = (body: Record<string, unknown>, status = 200) => NextResponse.json(body, { status })

async function handle(_request: NextRequest, { params }: Context) {
  try {
    const { user } = await getVerifiedUserWithRetry()
    if (!user) return json({ error: "Non authentifié" }, 401)
    const { id } = await params

    const search = await prisma.radarSearch.findFirst({ where: { id, userId: user.id } })
    if (!search) return json({ error: "Introuvable" }, 404)

    const sources = getConfiguredSources()
    if (sources.length === 0) return json({ error: "SOURCES_NOT_CONFIGURED", message: "Les sources d'offres ne sont pas encore branchées." }, 503)

    if (search.lastRunAt && Date.now() - search.lastRunAt.getTime() < RUN_COOLDOWN_MINUTES * 60_000) {
      return json({ error: "TOO_SOON", message: `Cette recherche a été actualisée il y a moins de ${RUN_COOLDOWN_MINUTES} minutes.` }, 429)
    }

    const result = await runRadarSearch({
      search: { id: search.id, userId: user.id, criteria: criteriaFromSearch(search) },
      cvText: await getLatestCvText(user.id),
      sources,
    })
    return json({ result })
  } catch (error) {
    logger.error({ err: error }, "[radar/searches run]")
    return json({ error: "Erreur serveur" }, 500)
  }
}

export const POST = rateLimit(RouteType.AI, handle, { scopes: [RateLimitScope.USER] })
