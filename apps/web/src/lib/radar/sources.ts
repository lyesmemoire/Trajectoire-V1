import type { OfferSource } from "./types"

/**
 * Sources d'offres réellement configurées. Les clients France Travail (OAuth2 client_credentials) et
 * La bonne alternance seront ajoutés ici quand leurs identifiants d'application existeront ; tant que la
 * liste est vide, l'exécution d'une recherche répond « sources non configurées » au lieu de simuler des offres.
 */
export function getConfiguredSources(): OfferSource[] {
  return []
}
