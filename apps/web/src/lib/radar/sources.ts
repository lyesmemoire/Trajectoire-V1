import { FranceTravailSource } from "./clients/france-travail"
import type { OfferSource } from "./types"

/**
 * Sources d'offres réellement configurées, selon les variables d'environnement présentes :
 * - France Travail : `FRANCE_TRAVAIL_CLIENT_ID` et `FRANCE_TRAVAIL_CLIENT_SECRET` ;
 * - La bonne alternance : pas encore branchée (clé d'API et schéma de réponse à confirmer avec la documentation).
 * Tant que la liste est vide, l'exécution d'une recherche répond « sources non configurées » au lieu de simuler
 * des offres.
 */
let franceTravail: FranceTravailSource | null = null
let franceTravailKey = ""

export function getConfiguredSources(): OfferSource[] {
  const sources: OfferSource[] = []

  const clientId = process.env.FRANCE_TRAVAIL_CLIENT_ID?.trim()
  const clientSecret = process.env.FRANCE_TRAVAIL_CLIENT_SECRET?.trim()
  if (clientId && clientSecret) {
    // Instance unique par couple d'identifiants : le jeton OAuth reste en mémoire entre deux recherches.
    const key = `${clientId}:${clientSecret.length}`
    if (!franceTravail || franceTravailKey !== key) {
      franceTravail = new FranceTravailSource({ clientId, clientSecret })
      franceTravailKey = key
    }
    sources.push(franceTravail)
  }

  return sources
}
