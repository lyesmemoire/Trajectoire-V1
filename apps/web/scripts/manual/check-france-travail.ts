/**
 * TEST MANUEL (non lancé en CI) : appel réel à l'API France Travail « Offres d'emploi v2 ».
 *
 * Valide, un par un, ce que le client du radar suppose sans l'avoir confirmé :
 *   - l'URL du jeton OAuth2 et le scope ;
 *   - les paramètres `sort`, `publieeDepuis`, `natureContrat`, `typeContrat=LIB`, `codeROME`, `departement`, `range` ;
 *   - que `FranceTravailSource` (validation zod comprise) lit une vraie réponse.
 *
 * Usage (depuis la racine du dépôt), avec FRANCE_TRAVAIL_CLIENT_ID et FRANCE_TRAVAIL_CLIENT_SECRET dans
 * apps/web/.env.local :
 *
 *     pnpm --dir apps/web radar:check-ft
 *
 * Le fichier .env.local est chargé par Node (`--env-file`, il doit exister), pas par ce script. Des lignes « [ENV SERVER] Variables invalides » peuvent apparaître si le fichier ne contient pas toutes les variables de l'application : sans importance pour ce test. Aucun secret ni jeton n'est
 * affiché : seulement des statuts, des compteurs et quelques champs d'offres publiques. Environ 12 requêtes,
 * espacées de 200 ms (la limite documentée est de l'ordre de 10 requêtes par seconde). Code de sortie 1 si une
 * vérification échoue.
 */

import { z } from "zod"
import {
  FRANCE_TRAVAIL_SCOPE,
  FRANCE_TRAVAIL_SEARCH_URL,
  FRANCE_TRAVAIL_TOKEN_URL,
  FranceTravailSource,
} from "../../src/lib/radar/clients/france-travail"
import { RadarSourceError } from "../../src/lib/radar/clients/errors"
import type { RadarCriteria } from "../../src/lib/radar/types"

const clientId = process.env.FRANCE_TRAVAIL_CLIENT_ID?.trim()
const clientSecret = process.env.FRANCE_TRAVAIL_CLIENT_SECRET?.trim()

type Check = { label: string; ok: boolean; detail: string }
const checks: Check[] = []

function record(label: string, ok: boolean, detail: string): void {
  checks.push({ label, ok, detail })
  console.log(`${ok ? "OK    " : "ÉCHEC "} ${label} — ${detail}`)
}

const sleep = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms))

const TokenResponse = z.object({ access_token: z.string().min(1), expires_in: z.number(), scope: z.string().optional(), token_type: z.string().optional() })
const SearchResponse = z.object({ resultats: z.array(z.record(z.string(), z.unknown())) })
const ApiError = z.object({ message: z.string().optional(), codeErreur: z.string().optional() }).partial()

async function getToken(): Promise<string | null> {
  const res = await fetch(FRANCE_TRAVAIL_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "client_credentials", client_id: clientId ?? "", client_secret: clientSecret ?? "", scope: FRANCE_TRAVAIL_SCOPE }),
  })
  if (!res.ok) {
    record("Jeton OAuth2", false, `HTTP ${res.status} sur ${FRANCE_TRAVAIL_TOKEN_URL} (identifiants, scope ou URL à revoir)`)
    return null
  }
  const parsed = TokenResponse.safeParse(await res.json().catch(() => null))
  if (!parsed.success) {
    record("Jeton OAuth2", false, "réponse 200 mais format inattendu (access_token / expires_in)")
    return null
  }
  record("Jeton OAuth2", true, `HTTP 200, expire dans ${parsed.data.expires_in} s, scope reçu : « ${parsed.data.scope ?? "non indiqué"} »`)
  return parsed.data.access_token
}

/** Une requête de recherche isolée : on teste UN paramètre à la fois pour savoir lequel est refusé. */
async function probe(token: string, label: string, params: Record<string, string>): Promise<void> {
  await sleep(200)
  const url = `${FRANCE_TRAVAIL_SEARCH_URL}?${new URLSearchParams({ range: "0-4", ...params })}`
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}`, Accept: "application/json" } })
  const contentRange = res.headers.get("content-range") ?? "absent"

  if (res.status === 204) return record(label, true, "HTTP 204 (paramètre accepté, aucun résultat)")
  if (res.status === 200 || res.status === 206) {
    const body = SearchResponse.safeParse(await res.json().catch(() => null))
    return record(label, body.success, body.success ? `HTTP ${res.status}, ${body.data.resultats.length} offre(s), Content-Range : ${contentRange}` : `HTTP ${res.status} mais enveloppe « resultats » absente`)
  }
  const apiError = ApiError.safeParse(await res.json().catch(() => null))
  const hint = apiError.success && apiError.data.message ? ` — ${apiError.data.message.slice(0, 160)}` : ""
  return record(label, false, `HTTP ${res.status}${hint}`)
}

async function endToEnd(): Promise<void> {
  const source = new FranceTravailSource({ clientId: clientId ?? "", clientSecret: clientSecret ?? "" })
  const criteria: RadarCriteria = {
    keywords: "développeur",
    romeCodes: [],
    departments: ["75"],
    latitude: null,
    longitude: null,
    radiusKm: null,
    contractTypes: ["CDI"],
    sources: ["FRANCE_TRAVAIL"],
  }
  try {
    const offers = await source.search(criteria)
    if (offers.length === 0) return record("Client du radar (zod)", false, "aucune offre normalisée (réponse vide ou toutes rejetées : voir les avertissements ci-dessus)")

    const count = (predicate: (o: (typeof offers)[number]) => boolean) => offers.filter(predicate).length
    record("Client du radar (zod)", true, `${offers.length} offre(s) normalisée(s) pour « développeur », CDI, dép. 75`)
    console.log(
      `        couverture : description ${count(o => o.description.length > 0)}/${offers.length}, salaire ${count(o => o.salaryLabel !== null)}, lien de candidature ${count(o => o.applyUrl !== null)}, coordonnées ${count(o => o.latitude !== null)}, département ${count(o => o.department !== null)}`,
    )
    const sample = offers[0]
    console.log(`        exemple : « ${sample.title} » — ${sample.company ?? "entreprise non indiquée"} — ${sample.locationLabel ?? "lieu non indiqué"} — ${sample.contractType ?? "contrat ?"} — ${new URL(sample.sourceUrl).host}`)
  } catch (error) {
    const detail = error instanceof RadarSourceError ? `${error.code} : ${error.message}` : error instanceof Error ? error.message : "erreur inconnue"
    record("Client du radar (zod)", false, detail)
  }
}

async function main(): Promise<void> {
  if (!clientId || !clientSecret) {
    console.error("FRANCE_TRAVAIL_CLIENT_ID et FRANCE_TRAVAIL_CLIENT_SECRET doivent être définis dans apps/web/.env.local.")
    process.exit(2)
  }
  console.log("Test manuel France Travail (appels réels, aucun secret affiché)\n")

  const token = await getToken()
  if (!token) return

  await probe(token, "Recherche de base (motsCles)", { motsCles: "développeur" })
  await probe(token, "sort=1 (plus récentes d'abord)", { motsCles: "développeur", sort: "1" })
  await probe(token, "publieeDepuis=31", { motsCles: "développeur", publieeDepuis: "31" })
  await probe(token, "natureContrat=E1,E2 (alternance)", { natureContrat: "E1,E2" })
  await probe(token, "typeContrat=LIB (freelance)", { motsCles: "consultant", typeContrat: "LIB" })
  await probe(token, "typeContrat=CDI,CDD", { motsCles: "développeur", typeContrat: "CDI,CDD" })
  await probe(token, "codeROME=M1805", { codeROME: "M1805" })
  await probe(token, "departement=75", { motsCles: "développeur", departement: "75" })
  await probe(token, "range=150-154 (page suivante)", { motsCles: "développeur", range: "150-154" })

  await endToEnd()

  const failed = checks.filter(c => !c.ok)
  console.log(`\n${checks.length - failed.length}/${checks.length} vérifications réussies.`)
  if (failed.length > 0) {
    console.log("À corriger dans lib/radar/clients/france-travail.ts :")
    for (const c of failed) console.log(` - ${c.label}`)
    process.exitCode = 1
  }
}

main().catch((error: unknown) => {
  console.error("Échec inattendu :", error instanceof Error ? error.message : "erreur inconnue")
  process.exit(1)
})
