import { createHash } from "node:crypto"
import { normalize } from "@/lib/cv-analysis/text"
import type { NormalizedOffer, OfferStatus } from "./types"

/**
 * Empreinte d'une offre : entreprise + intitulé + localité, normalisés (casse, accents, ponctuation, espaces).
 * La même annonce publiée par deux sources, ou republiée avec une casse différente, a la même empreinte.
 * Sans entreprise ni lieu, l'empreinte est quand même stable mais moins discriminante : le regroupement
 * ne fusionne alors que des offres strictement identiques sur le reste.
 */
export function offerFingerprint(offer: Pick<NormalizedOffer, "title" | "company" | "locationLabel">): string {
  const parts = [offer.company ?? "", offer.title, offer.locationLabel ?? ""].map(p => normalize(p).replace(/\s+/g, " ").trim())
  return createHash("sha256").update(parts.join("|")).digest("hex").slice(0, 32)
}

/** Meilleure représentation d'un groupe : lien de candidature présent, puis description la plus complète, puis la plus récente. */
function better(a: NormalizedOffer, b: NormalizedOffer): NormalizedOffer {
  if (Boolean(a.applyUrl) !== Boolean(b.applyUrl)) return a.applyUrl ? a : b
  if (a.description.length !== b.description.length) return a.description.length > b.description.length ? a : b
  return (a.publishedAt?.getTime() ?? 0) >= (b.publishedAt?.getTime() ?? 0) ? a : b
}

/**
 * Regroupe des offres identiques entre sources. Retourne une offre canonique par empreinte (ordre de première
 * apparition conservé). Une même `(source, externalId)` n'apparaît jamais deux fois.
 */
export function dedupeOffers(offers: NormalizedOffer[]): NormalizedOffer[] {
  const seenIds = new Set<string>()
  const byFingerprint = new Map<string, NormalizedOffer>()
  for (const offer of offers) {
    const idKey = `${offer.source}:${offer.externalId}`
    if (seenIds.has(idKey)) continue
    seenIds.add(idKey)
    const fp = offerFingerprint(offer)
    const current = byFingerprint.get(fp)
    byFingerprint.set(fp, current ? better(current, offer) : offer)
  }
  return [...byFingerprint.values()]
}

export const STALE_AFTER_DAYS = 3
export const CLOSED_AFTER_DAYS = 7
/** Une offre fermée n'est supprimée qu'après ce délai, et seulement si personne ne la suit. */
export const PURGE_CLOSED_AFTER_DAYS = 30

const DAY_MS = 24 * 60 * 60 * 1000

/**
 * Statut d'une offre selon la dernière fois qu'une synchronisation l'a revue : on ne la ferme pas sur une seule
 * absence (une synchronisation partielle ou une panne de source ne doit pas vider le catalogue).
 */
export function decideOfferStatus(lastSeenAt: Date, now: Date): OfferStatus {
  const days = (now.getTime() - lastSeenAt.getTime()) / DAY_MS
  if (days >= CLOSED_AFTER_DAYS) return "CLOSED"
  if (days >= STALE_AFTER_DAYS) return "STALE"
  return "LIVE"
}
