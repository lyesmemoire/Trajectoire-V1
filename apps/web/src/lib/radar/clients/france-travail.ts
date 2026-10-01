import { z } from "zod"
import { logger } from "@/lib/logger"
import { RadarSourceError } from "./errors"
import type { NormalizedOffer, OfferSource, RadarCriteria } from "../types"

/**
 * Client de l'API « Offres d'emploi v2 » de France Travail.
 *
 * - OAuth2 `client_credentials` (jeton gardé en mémoire jusqu'à son expiration, renouvelé une fois sur 401).
 * - Recherche `GET …/offres/search` : pages de 150 résultats (le premier élément du `range` est plafonné à 1000
 *   par l'API), 200 ou 206 = résultats, 204 = aucun résultat. On borne volontairement à `MAX_PAGES` pages par
 *   département : le radar n'a pas besoin de tout le catalogue.
 * - Les réponses sont validées par zod ; une offre invalide est écartée (comptée dans les journaux), jamais
 *   devinée. Les champs lus sont ceux de la documentation publique (`resultats`, `id`, `intitule`, `lieuTravail`,
 *   `entreprise`, `typeContrat`, `salaire`, `origineOffre`, `contact`, `dateCreation`).
 *
 * Aucune clé ni aucun jeton n'apparaît dans les messages d'erreur ni dans les journaux.
 */

export const FRANCE_TRAVAIL_TOKEN_URL = "https://francetravail.io/connexion/oauth2/access_token?realm=/partenaire"
export const FRANCE_TRAVAIL_SEARCH_URL = "https://api.francetravail.io/partenaire/offresdemploi/v2/offres/search"
export const FRANCE_TRAVAIL_SCOPE = "api_offresdemploiv2 o2dsoffre"
const OFFER_PUBLIC_URL = "https://candidat.francetravail.fr/offres/recherche/detail/"

const PAGE_SIZE = 150
export const MAX_PAGES = 2
export const MAX_DEPARTMENTS = 3
/** Marge avant expiration du jeton, pour ne pas l'utiliser à la limite. */
const TOKEN_MARGIN_MS = 60_000

const TokenSchema = z.object({ access_token: z.string().min(1), expires_in: z.number().positive() })

const Str = z.string().optional().nullable()

const RawOfferSchema = z.object({
  id: z.string().min(1),
  intitule: z.string().min(1),
  description: Str,
  dateCreation: Str,
  lieuTravail: z.object({ libelle: Str, latitude: z.number().nullish(), longitude: z.number().nullish(), codePostal: Str }).nullish(),
  romeCode: Str,
  entreprise: z.object({ nom: Str }).nullish(),
  typeContrat: Str,
  experienceLibelle: Str,
  salaire: z.object({ libelle: Str }).nullish(),
  origineOffre: z.object({ urlOrigine: Str }).nullish(),
  contact: z.object({ urlPostulation: Str }).nullish(),
})

const ResponseSchema = z.object({ resultats: z.array(z.unknown()) })

type RawOffer = z.infer<typeof RawOfferSchema>

/** Lien http(s) uniquement : jamais de `javascript:` ni de schéma exotique renvoyé par une source. */
function safeUrl(value: string | null | undefined): string | null {
  if (!value) return null
  try {
    const url = new URL(value)
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : null
  } catch {
    return null
  }
}

/** Code département : préfixe du libellé (« 75 - PARIS 08 »), sinon code postal (Corse non déductible : null). */
export function departmentFrom(libelle: string | null | undefined, codePostal: string | null | undefined): string | null {
  const fromLabel = /^\s*(\d{2,3}|2[AB])\s*-/.exec(libelle ?? "")?.[1]
  if (fromLabel) return fromLabel
  const cp = (codePostal ?? "").trim()
  if (!/^\d{5}$/.test(cp)) return null
  if (cp.startsWith("97") || cp.startsWith("98")) return cp.slice(0, 3)
  return cp.startsWith("20") ? null : cp.slice(0, 2)
}

/** Mots-clés : lettres, chiffres, espaces et quelques signes courants ; six mots au plus. */
export function cleanKeywords(keywords: string): string {
  return keywords
    .replace(/[^\p{L}\p{N}\s+#.-]/gu, " ")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 6)
    .join(" ")
}

/** Types de contrat du radar → paramètres France Travail. `null` si la source ne couvre pas la demande. */
export function contractParams(contractTypes: string[]): { typeContrat?: string; natureContrat?: string } | null {
  if (contractTypes.length === 0) return {}
  const types = new Set<string>()
  let nature = false
  for (const c of contractTypes) {
    if (c === "CDI" || c === "CDD" || c === "MIS") types.add(c)
    else if (c === "FREELANCE") types.add("LIB")
    else if (c === "ALTERNANCE") nature = true
    // STAGE : non couvert par cette API.
  }
  if (types.size === 0 && !nature) return null
  return {
    ...(types.size ? { typeContrat: [...types].join(",") } : {}),
    ...(nature ? { natureContrat: "E1,E2" } : {}),
  }
}

export function toNormalizedOffer(raw: RawOffer): NormalizedOffer {
  const lieu = raw.lieuTravail
  return {
    source: "FRANCE_TRAVAIL",
    externalId: raw.id,
    title: raw.intitule.trim(),
    company: raw.entreprise?.nom?.trim() || null,
    locationLabel: lieu?.libelle?.trim() || null,
    department: departmentFrom(lieu?.libelle, lieu?.codePostal),
    latitude: lieu?.latitude ?? null,
    longitude: lieu?.longitude ?? null,
    contractType: raw.typeContrat?.trim() || null,
    romeCode: raw.romeCode?.trim() || null,
    experience: raw.experienceLibelle?.trim() || null,
    salaryLabel: raw.salaire?.libelle?.trim() || null,
    description: (raw.description ?? "").trim(),
    sourceUrl: safeUrl(raw.origineOffre?.urlOrigine) ?? `${OFFER_PUBLIC_URL}${encodeURIComponent(raw.id)}`,
    applyUrl: safeUrl(raw.contact?.urlPostulation),
    publishedAt: raw.dateCreation && !Number.isNaN(Date.parse(raw.dateCreation)) ? new Date(raw.dateCreation) : null,
  }
}

/** Distance à vol d'oiseau en km. */
export function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const rad = (d: number) => (d * Math.PI) / 180
  const a = Math.sin(rad(lat2 - lat1) / 2) ** 2 + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(rad(lon2 - lon1) / 2) ** 2
  return 6371 * 2 * Math.asin(Math.sqrt(a))
}

export type FranceTravailOptions = {
  clientId: string
  clientSecret: string
  fetchImpl?: typeof fetch
  now?: () => number
}

export class FranceTravailSource implements OfferSource {
  readonly id = "FRANCE_TRAVAIL" as const
  private token: { value: string; expiresAt: number } | null = null
  private readonly fetchImpl: typeof fetch
  private readonly now: () => number

  constructor(private readonly options: FranceTravailOptions) {
    this.fetchImpl = options.fetchImpl ?? fetch
    this.now = options.now ?? Date.now
  }

  private async getToken(signal?: AbortSignal, forceRefresh = false): Promise<string> {
    if (!forceRefresh && this.token && this.token.expiresAt > this.now()) return this.token.value

    const res = await this.fetchImpl(FRANCE_TRAVAIL_TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: this.options.clientId,
        client_secret: this.options.clientSecret,
        scope: FRANCE_TRAVAIL_SCOPE,
      }),
      signal,
    }).catch((error: unknown) => {
      throw this.networkError(error)
    })

    if (!res.ok) throw new RadarSourceError("AUTH", `France Travail a refusé l'authentification (${res.status})`, res.status)
    const parsed = TokenSchema.safeParse(await res.json().catch(() => null))
    if (!parsed.success) throw new RadarSourceError("INVALID_RESPONSE", "Réponse d'authentification France Travail invalide")

    this.token = { value: parsed.data.access_token, expiresAt: this.now() + parsed.data.expires_in * 1000 - TOKEN_MARGIN_MS }
    return this.token.value
  }

  private networkError(error: unknown): RadarSourceError {
    if (error instanceof Error && error.name === "AbortError") return new RadarSourceError("TIMEOUT", "Délai dépassé pour France Travail")
    return new RadarSourceError("UPSTREAM", "France Travail injoignable")
  }

  private async fetchPage(params: URLSearchParams, signal?: AbortSignal): Promise<{ status: number; body: unknown }> {
    for (let attempt = 0; attempt < 2; attempt += 1) {
      const token = await this.getToken(signal, attempt > 0)
      const res = await this.fetchImpl(`${FRANCE_TRAVAIL_SEARCH_URL}?${params}`, {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
        signal,
      }).catch((error: unknown) => {
        throw this.networkError(error)
      })

      if (res.status === 401 && attempt === 0) continue // jeton révoqué : on le renouvelle une fois
      if (res.status === 204) return { status: 204, body: null }
      if (res.status === 200 || res.status === 206) return { status: res.status, body: await res.json().catch(() => null) }
      if (res.status === 401) throw new RadarSourceError("AUTH", "Jeton France Travail refusé", 401)
      if (res.status === 429) throw new RadarSourceError("RATE_LIMITED", "Limite de débit France Travail atteinte", 429)
      if (res.status === 400) throw new RadarSourceError("BAD_REQUEST", "Paramètres de recherche refusés par France Travail", 400)
      throw new RadarSourceError("UPSTREAM", `France Travail a répondu ${res.status}`, res.status)
    }
    throw new RadarSourceError("AUTH", "Jeton France Travail refusé", 401)
  }

  async search(criteria: RadarCriteria, options: { signal?: AbortSignal } = {}): Promise<NormalizedOffer[]> {
    const contract = contractParams(criteria.contractTypes)
    if (contract === null) return [] // demande non couverte (stage seul) : rien à chercher ici

    const base = new URLSearchParams({ sort: "1", publieeDepuis: "31" })
    const keywords = cleanKeywords(criteria.keywords)
    if (keywords) base.set("motsCles", keywords)
    if (criteria.romeCodes.length) base.set("codeROME", criteria.romeCodes.join(","))
    for (const [key, value] of Object.entries(contract)) base.set(key, value)

    // L'API accepte un département par requête : on en interroge au plus MAX_DEPARTMENTS.
    const departments = criteria.departments.length ? criteria.departments.slice(0, MAX_DEPARTMENTS) : [null]
    const offers: NormalizedOffer[] = []
    let rejected = 0

    for (const department of departments) {
      for (let page = 0; page < MAX_PAGES; page += 1) {
        const params = new URLSearchParams(base)
        if (department) params.set("departement", department)
        params.set("range", `${page * PAGE_SIZE}-${page * PAGE_SIZE + PAGE_SIZE - 1}`)

        const { status, body } = await this.fetchPage(params, options.signal)
        if (status === 204) break

        const envelope = ResponseSchema.safeParse(body)
        if (!envelope.success) throw new RadarSourceError("INVALID_RESPONSE", "Réponse de recherche France Travail invalide")

        for (const item of envelope.data.resultats) {
          const parsed = RawOfferSchema.safeParse(item)
          if (parsed.success) offers.push(toNormalizedOffer(parsed.data))
          else rejected += 1
        }
        if (status === 200 || envelope.data.resultats.length < PAGE_SIZE) break // dernière page
      }
    }

    if (rejected > 0) logger.warn({ source: "FRANCE_TRAVAIL", rejected }, "[radar] offres invalides écartées")

    // Rayon : l'API filtre par commune, pas par coordonnées. On filtre ici les offres géolocalisées ;
    // une offre sans coordonnées est conservée (position inconnue, pas hors zone).
    const { latitude, longitude, radiusKm } = criteria
    if (latitude !== null && longitude !== null && radiusKm !== null) {
      return offers.filter(o => o.latitude === null || o.longitude === null || haversineKm(latitude, longitude, o.latitude, o.longitude) <= radiusKm)
    }
    return offers
  }
}
