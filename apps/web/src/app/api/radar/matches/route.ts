/**
 * GET /api/radar/matches?state=ACTIVE|NEW|SEEN|SAVED|DISMISSED&limit=30&cursor=<id>
 *
 * Correspondances de l'utilisateur, les mieux notées d'abord (les offres non évaluées en dernier), puis les
 * plus récentes. Par défaut « ACTIVE » : tout sauf les offres écartées.
 */

import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { getVerifiedUserWithRetry } from "@/lib/auth/verified-user"
import { prisma } from "@/lib/prisma"
import { logger } from "@/lib/logger"
import { MATCH_LIST_SELECT, toMatchListItem } from "@/lib/radar/mappers"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const QuerySchema = z.object({
  state: z.enum(["ACTIVE", "NEW", "SEEN", "SAVED", "DISMISSED"]).default("ACTIVE"),
  limit: z.coerce.number().int().min(1).max(100).default(30),
  cursor: z.string().min(1).max(64).optional(),
})

const json = (body: Record<string, unknown>, status = 200) => NextResponse.json(body, { status })

export async function GET(request: NextRequest) {
  try {
    const { user } = await getVerifiedUserWithRetry()
    if (!user) return json({ error: "Non authentifié" }, 401)

    const query = QuerySchema.safeParse(Object.fromEntries(request.nextUrl.searchParams))
    if (!query.success) return json({ error: "Paramètres invalides" }, 400)
    const { state, limit, cursor } = query.data

    const rows = await prisma.radarMatch.findMany({
      where: { userId: user.id, ...(state === "ACTIVE" ? { state: { not: "DISMISSED" } } : { state }) },
      orderBy: [{ score: { sort: "desc", nulls: "last" } }, { matchedAt: "desc" }, { id: "asc" }],
      take: limit + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      select: MATCH_LIST_SELECT,
    })

    const page = rows.slice(0, limit)
    return json({ matches: page.map(toMatchListItem), nextCursor: rows.length > limit ? page[page.length - 1].id : null })
  } catch (error) {
    logger.error({ err: error }, "[radar/matches GET]")
    return json({ error: "Erreur serveur" }, 500)
  }
}
