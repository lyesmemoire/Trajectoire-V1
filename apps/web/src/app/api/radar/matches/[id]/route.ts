/**
 * PATCH /api/radar/matches/[id] : { state: "SEEN" | "SAVED" | "DISMISSED" }.
 * Une correspondance d'un autre utilisateur répond 404.
 */

import { NextRequest, NextResponse } from "next/server"
import { getVerifiedUserWithRetry } from "@/lib/auth/verified-user"
import { prisma } from "@/lib/prisma"
import { logger } from "@/lib/logger"
import { MatchStatePatchSchema } from "@/lib/radar/schemas"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

type Context = { params: Promise<{ id: string }> }

const json = (body: Record<string, unknown>, status = 200) => NextResponse.json(body, { status })

export async function PATCH(request: NextRequest, { params }: Context) {
  try {
    const { user } = await getVerifiedUserWithRetry()
    if (!user) return json({ error: "Non authentifié" }, 401)
    const { id } = await params

    const parsed = MatchStatePatchSchema.safeParse(await request.json().catch(() => null))
    if (!parsed.success) return json({ error: "Données invalides" }, 400)

    const result = await prisma.radarMatch.updateMany({ where: { id, userId: user.id }, data: { state: parsed.data.state } })
    if (result.count === 0) return json({ error: "Introuvable" }, 404)
    return json({ success: true, state: parsed.data.state })
  } catch (error) {
    logger.error({ err: error }, "[radar/matches PATCH]")
    return json({ error: "Erreur serveur" }, 500)
  }
}
