import { prisma } from "@/lib/prisma"
import { logger } from "@/lib/logger"
import { Prisma } from "@prisma/client"
import { PURGE_CLOSED_AFTER_DAYS, CLOSED_AFTER_DAYS, STALE_AFTER_DAYS, dedupeOffers, offerFingerprint } from "./dedupe"
import { scoreOffer } from "./scoring"
import type { NormalizedOffer, OfferSource, RadarCriteria, RadarSource } from "./types"

/** Offres retenues par recherche et par exécution (borne le volume écrit et le calcul des scores). */
export const MAX_OFFERS_PER_SEARCH_RUN = 200
/** Délai maximal d'une source pour une recherche : une source lente ne bloque pas les autres. */
export const SOURCE_TIMEOUT_MS = 15_000
const UPSERT_CHUNK = 50
const DAY_MS = 86_400_000

export type SearchRecord = {
  id: string
  userId: string
  criteria: RadarCriteria
}

export type SearchRunResult = {
  searchId: string
  fetched: number
  upserted: number
  matched: number
  /** Sources en échec (les autres ont répondu) : exécution partielle. */
  failedSources: Array<{ source: RadarSource; message: string }>
}

function offerData(offer: NormalizedOffer) {
  return {
    title: offer.title,
    company: offer.company,
    locationLabel: offer.locationLabel,
    department: offer.department,
    latitude: offer.latitude,
    longitude: offer.longitude,
    contractType: offer.contractType,
    romeCode: offer.romeCode,
    experience: offer.experience,
    salaryLabel: offer.salaryLabel,
    description: offer.description,
    sourceUrl: offer.sourceUrl,
    applyUrl: offer.applyUrl,
    fingerprint: offerFingerprint(offer),
    publishedAt: offer.publishedAt,
  }
}

/** Écrit ou met à jour les offres du catalogue partagé et retourne leurs identifiants internes, par clé source:externalId. */
export async function upsertOffers(offers: NormalizedOffer[], now: Date): Promise<Map<string, string>> {
  const ids = new Map<string, string>()
  for (let i = 0; i < offers.length; i += UPSERT_CHUNK) {
    const chunk = offers.slice(i, i + UPSERT_CHUNK)
    const rows = await prisma.$transaction(
      chunk.map(offer =>
        prisma.marketOffer.upsert({
          where: { source_externalId: { source: offer.source, externalId: offer.externalId } },
          create: { source: offer.source, externalId: offer.externalId, ...offerData(offer), status: "LIVE", firstSeenAt: now, lastSeenAt: now },
          update: { ...offerData(offer), status: "LIVE", lastSeenAt: now, closedAt: null },
          select: { id: true, source: true, externalId: true },
        }),
      ),
    )
    for (const row of rows) ids.set(`${row.source}:${row.externalId}`, row.id)
  }
  return ids
}

/**
 * Exécute une recherche : interroge ses sources (une panne n'arrête pas les autres), dédoublonne, enregistre
 * les offres dans le catalogue partagé, puis crée ou met à jour les correspondances de l'utilisateur.
 * L'état d'une correspondance existante (vue, enregistrée, écartée) n'est jamais modifié ; seul son score l'est.
 */
export async function runRadarSearch(params: {
  search: SearchRecord
  cvText: string | null
  sources: OfferSource[]
  now?: Date
}): Promise<SearchRunResult> {
  const { search, cvText, sources } = params
  const now = params.now ?? new Date()
  const failedSources: SearchRunResult["failedSources"] = []
  const collected: NormalizedOffer[] = []

  const active = sources.filter(s => search.criteria.sources.includes(s.id))
  await Promise.all(
    active.map(async source => {
      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), SOURCE_TIMEOUT_MS)
      try {
        collected.push(...(await source.search(search.criteria, { signal: controller.signal })))
      } catch (error) {
        const message = error instanceof Error ? error.message : "Erreur inconnue"
        logger.warn({ searchId: search.id, source: source.id, message }, "[radar] source en échec")
        failedSources.push({ source: source.id, message: message.slice(0, 200) })
      } finally {
        clearTimeout(timer)
      }
    }),
  )

  const offers = dedupeOffers(collected).slice(0, MAX_OFFERS_PER_SEARCH_RUN)
  const ids = offers.length > 0 ? await upsertOffers(offers, now) : new Map<string, string>()

  const offerIds = offers.map(o => ids.get(`${o.source}:${o.externalId}`)).filter((id): id is string => Boolean(id))
  const existing = offerIds.length
    ? await prisma.radarMatch.findMany({ where: { userId: search.userId, offerId: { in: offerIds } }, select: { id: true, offerId: true, score: true } })
    : []
  const existingByOffer = new Map(existing.map(m => [m.offerId, m]))

  const toCreate: Prisma.RadarMatchCreateManyInput[] = []
  const updates: Prisma.PrismaPromise<unknown>[] = []
  for (const offer of offers) {
    const offerId = ids.get(`${offer.source}:${offer.externalId}`)
    if (!offerId) continue
    const result = scoreOffer(cvText, offer)
    const found = existingByOffer.get(offerId)
    if (!found) {
      toCreate.push({
        userId: search.userId,
        offerId,
        searchId: search.id,
        score: result.score,
        scoreDetails: result.details as unknown as Prisma.InputJsonValue,
        matchedAt: now,
      })
    } else if (found.score !== result.score) {
      updates.push(
        prisma.radarMatch.update({
          where: { id: found.id },
          data: { score: result.score, scoreDetails: result.details as unknown as Prisma.InputJsonValue },
        }),
      )
    }
  }

  if (toCreate.length > 0) await prisma.radarMatch.createMany({ data: toCreate, skipDuplicates: true })
  if (updates.length > 0) await prisma.$transaction(updates)

  await prisma.radarSearch.update({
    where: { id: search.id },
    data: {
      lastRunAt: now,
      lastRunError: failedSources.length ? failedSources.map(f => `${f.source}: ${f.message}`).join(" | ").slice(0, 500) : null,
    },
  })

  return { searchId: search.id, fetched: collected.length, upserted: offers.length, matched: toCreate.length, failedSources }
}

/**
 * Vieillissement du catalogue : « périmée » après quelques jours sans être revue, « fermée » ensuite, puis
 * suppression des offres fermées anciennes **que personne ne suit** (une correspondance enregistrée garde son offre).
 */
export async function refreshOfferStatuses(now: Date = new Date()): Promise<{ stale: number; closed: number; purged: number }> {
  const before = (days: number) => new Date(now.getTime() - days * DAY_MS)

  const closed = await prisma.marketOffer.updateMany({
    where: { status: { not: "CLOSED" }, lastSeenAt: { lt: before(CLOSED_AFTER_DAYS) } },
    data: { status: "CLOSED", closedAt: now },
  })
  const stale = await prisma.marketOffer.updateMany({
    where: { status: "LIVE", lastSeenAt: { lt: before(STALE_AFTER_DAYS) } },
    data: { status: "STALE" },
  })
  const purged = await prisma.marketOffer.deleteMany({
    where: { status: "CLOSED", closedAt: { lt: before(PURGE_CLOSED_AFTER_DAYS) }, matches: { none: {} } },
  })

  return { stale: stale.count, closed: closed.count, purged: purged.count }
}

/** Texte du dernier CV analysé de l'utilisateur, ou null. Lu seulement pour calculer des scores, jamais renvoyé. */
export async function getLatestCvText(userId: string): Promise<string | null> {
  const row = await prisma.cVAnalysis.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: { originalText: true },
  })
  return row?.originalText ?? null
}
