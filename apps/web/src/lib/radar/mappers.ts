import type { Prisma } from "@prisma/client"
import type { RadarCriteria, RadarSource } from "./types"

/** Ligne `radar_searches` → critères transmis aux sources. */
export function criteriaFromSearch(row: {
  keywords: string
  romeCodes: string[]
  departments: string[]
  latitude: number | null
  longitude: number | null
  radiusKm: number | null
  contractTypes: string[]
  sources: string[]
}): RadarCriteria {
  return {
    keywords: row.keywords,
    romeCodes: row.romeCodes,
    departments: row.departments,
    latitude: row.latitude,
    longitude: row.longitude,
    radiusKm: row.radiusKm,
    contractTypes: row.contractTypes,
    sources: row.sources as RadarSource[],
  }
}

export const MATCH_LIST_SELECT = {
  id: true,
  score: true,
  scoreDetails: true,
  state: true,
  matchedAt: true,
  opportunityId: true,
  offer: {
    select: {
      id: true,
      source: true,
      title: true,
      company: true,
      locationLabel: true,
      contractType: true,
      experience: true,
      salaryLabel: true,
      description: true,
      sourceUrl: true,
      applyUrl: true,
      status: true,
      publishedAt: true,
      lastSeenAt: true,
    },
  },
} satisfies Prisma.RadarMatchSelect

type MatchRow = Prisma.RadarMatchGetPayload<{ select: typeof MATCH_LIST_SELECT }>

const SNIPPET_CHARS = 600

/** Ligne de liste : description tronquée (la fiche complète renvoie vers l'offre d'origine). */
export function toMatchListItem(row: MatchRow) {
  return {
    id: row.id,
    score: row.score,
    scoreDetails: row.scoreDetails,
    state: row.state,
    matchedAt: row.matchedAt.toISOString(),
    opportunityId: row.opportunityId,
    offer: {
      ...row.offer,
      description: row.offer.description.slice(0, SNIPPET_CHARS),
      publishedAt: row.offer.publishedAt?.toISOString() ?? null,
      lastSeenAt: row.offer.lastSeenAt.toISOString(),
    },
  }
}
