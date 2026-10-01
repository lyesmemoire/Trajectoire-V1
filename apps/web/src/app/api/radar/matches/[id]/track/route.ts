/**
 * POST /api/radar/matches/[id]/track : transforme l'offre en opportunité suivie (pipeline, simulation,
 * workspace de candidature). Idempotent : si la correspondance est déjà liée à une opportunité, celle-ci est
 * renvoyée sans en créer une seconde.
 */

import { NextRequest, NextResponse } from "next/server"
import { getVerifiedUserWithRetry } from "@/lib/auth/verified-user"
import { prisma } from "@/lib/prisma"
import { logger } from "@/lib/logger"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

type Context = { params: Promise<{ id: string }> }

const json = (body: Record<string, unknown>, status = 200) => NextResponse.json(body, { status })

export async function POST(_request: NextRequest, { params }: Context) {
  try {
    const { user } = await getVerifiedUserWithRetry()
    if (!user) return json({ error: "Non authentifié" }, 401)
    const { id } = await params

    const outcome = await prisma.$transaction(async tx => {
      const match = await tx.radarMatch.findFirst({
        where: { id, userId: user.id },
        select: {
          opportunityId: true,
          offer: { select: { title: true, company: true, locationLabel: true, sourceUrl: true, source: true, description: true } },
        },
      })
      if (!match) return { notFound: true as const }
      if (match.opportunityId) return { opportunityId: match.opportunityId, created: false }

      const opportunity = await tx.opportunity.create({
        data: {
          userId: user.id,
          title: match.offer.title,
          company: match.offer.company,
          location: match.offer.locationLabel,
          sourceUrl: match.offer.sourceUrl,
          source: `radar:${match.offer.source}`,
          description: match.offer.description,
        },
        select: { id: true },
      })
      await tx.radarMatch.update({ where: { id }, data: { opportunityId: opportunity.id, state: "SAVED" } })
      return { opportunityId: opportunity.id, created: true }
    })

    if ("notFound" in outcome) return json({ error: "Introuvable" }, 404)
    return json({ opportunityId: outcome.opportunityId }, outcome.created ? 201 : 200)
  } catch (error) {
    logger.error({ err: error }, "[radar/matches track]")
    return json({ error: "Erreur serveur" }, 500)
  }
}
