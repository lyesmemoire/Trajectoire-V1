/**
 * Radar des offres d'emploi : types communs aux sources (France Travail, La bonne alternance) et au moteur.
 * Aucune entrée/sortie ici ; les clients de sources produisent des `NormalizedOffer`.
 */

export const RADAR_SOURCES = ["FRANCE_TRAVAIL", "LA_BONNE_ALTERNANCE"] as const
export type RadarSource = (typeof RADAR_SOURCES)[number]

export const OFFER_STATUSES = ["LIVE", "STALE", "CLOSED"] as const
export type OfferStatus = (typeof OFFER_STATUSES)[number]

export const MATCH_STATES = ["NEW", "SEEN", "SAVED", "DISMISSED"] as const
export type MatchState = (typeof MATCH_STATES)[number]

/** Offre normalisée, indépendante de la source. Seuls les champs conservés en base y figurent. */
export type NormalizedOffer = {
  source: RadarSource
  externalId: string
  title: string
  company: string | null
  locationLabel: string | null
  /** Code département français (« 75 », « 2A », « 971 »). */
  department: string | null
  latitude: number | null
  longitude: number | null
  contractType: string | null
  romeCode: string | null
  experience: string | null
  /** Libellé de salaire tel que publié (jamais converti ni estimé). */
  salaryLabel: string | null
  description: string
  sourceUrl: string
  applyUrl: string | null
  publishedAt: Date | null
}

/** Critères d'une recherche sauvegardée, tels que transmis aux sources. */
export type RadarCriteria = {
  keywords: string
  romeCodes: string[]
  departments: string[]
  latitude: number | null
  longitude: number | null
  radiusKm: number | null
  contractTypes: string[]
  sources: RadarSource[]
}

/**
 * Contrat d'une source d'offres. Les clients réels (réseau, OAuth) l'implémentent ; les tests utilisent une
 * source simulée. `search` ne renvoie que des offres déjà normalisées et validées.
 */
export interface OfferSource {
  readonly id: RadarSource
  search(criteria: RadarCriteria, options?: { signal?: AbortSignal }): Promise<NormalizedOffer[]>
}
