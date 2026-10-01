/**
 * PATCH  /api/radar/searches/[id] : renomme, change les mots-clés ou active/désactive une recherche.
 * DELETE /api/radar/searches/[id] : la supprime (les correspondances restent, détachées de la recherche).
 * Toutes les requêtes sont filtrées sur l'utilisateur de la session : une recherche d'autrui répond 404.
 */

import { NextRequest, NextResponse } from "next/server"
import { getVerifiedUserWithRetry } from "@/lib/auth/verified-user"
import { prisma } from "@/lib/prisma"
import { logger } from "@/lib/logger"
import { RadarSearchPatchSchema } from "@/lib/radar/schemas"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

type Context = { params: Promise<{ id: string }> }

const json = (body: Record<string, unknown>, status = 200) => NextResponse.json(body, { status })

export async function PATCH(request: NextRequest, { params }: Context) {
  try {
    const { user } = await getVerifiedUserWithRetry()
    if (!user) return json({ error: "Non authentifié" }, 401)
    const { id } = await params

    const parsed = RadarSearchPatchSchema.safeParse(await request.json().catch(() => null))
    if (!parsed.success) return json({ error: "Données invalides", fields: parsed.error.flatten().fieldErrors }, 400)

    const result = await prisma.radarSearch.updateMany({ where: { id, userId: user.id }, data: parsed.data })
    if (result.count === 0) return json({ error: "Introuvable" }, 404)

    const search = await prisma.radarSearch.findFirst({ where: { id, userId: user.id } })
    return json({ search })
  } catch (error) {
    logger.error({ err: error }, "[radar/searches PATCH]")
    return json({ error: "Erreur serveur" }, 500)
  }
}

export async function DELETE(_request: NextRequest, { params }: Context) {
  try {
    const { user } = await getVerifiedUserWithRetry()
    if (!user) return json({ error: "Non authentifié" }, 401)
    const { id } = await params

    const result = await prisma.radarSearch.deleteMany({ where: { id, userId: user.id } })
    if (result.count === 0) return json({ error: "Introuvable" }, 404)
    return json({ success: true })
  } catch (error) {
    logger.error({ err: error }, "[radar/searches DELETE]")
    return json({ error: "Erreur serveur" }, 500)
  }
}
