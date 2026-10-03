/**
 * GET  /api/radar/searches : recherches sauvegardées de l'utilisateur.
 * POST /api/radar/searches : en crée une (au plus MAX_RADAR_SEARCHES_PER_USER). L'identité vient de la session.
 */

import { NextRequest, NextResponse } from "next/server"
import { getVerifiedUserWithRetry } from "@/lib/auth/verified-user"
import { prisma } from "@/lib/prisma"
import { logger } from "@/lib/logger"
import { MAX_RADAR_SEARCHES_PER_USER, RadarSearchInputSchema } from "@/lib/radar/schemas"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const json = (body: Record<string, unknown>, status = 200) => NextResponse.json(body, { status })

export async function GET() {
  try {
    const { user } = await getVerifiedUserWithRetry()
    if (!user) return json({ error: "Non authentifié" }, 401)

    const searches = await prisma.radarSearch.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "asc" },
    })
    return json({ searches, max: MAX_RADAR_SEARCHES_PER_USER })
  } catch (error) {
    logger.error({ err: error }, "[radar/searches GET]")
    return json({ error: "Erreur serveur" }, 500)
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user } = await getVerifiedUserWithRetry()
    if (!user) return json({ error: "Non authentifié" }, 401)

    const parsed = RadarSearchInputSchema.safeParse(await request.json().catch(() => null))
    if (!parsed.success) {
      return json({ error: "Données invalides", fields: parsed.error.flatten().fieldErrors }, 400)
    }

    const count = await prisma.radarSearch.count({ where: { userId: user.id } })
    if (count >= MAX_RADAR_SEARCHES_PER_USER) {
      return json({ error: "LIMIT_REACHED", message: `Vous pouvez enregistrer ${MAX_RADAR_SEARCHES_PER_USER} recherches au plus.` }, 409)
    }

    const search = await prisma.radarSearch.create({ data: { ...parsed.data, userId: user.id } })
    return json({ search }, 201)
  } catch (error) {
    logger.error({ err: error }, "[radar/searches POST]")
    return json({ error: "Erreur serveur" }, 500)
  }
}
