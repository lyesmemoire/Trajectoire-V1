import { describe, it, expect, vi, beforeEach } from "vitest"

vi.mock("@/lib/logger", () => ({ logger: { warn: vi.fn(), error: vi.fn(), info: vi.fn() } }))

import {
  FRANCE_TRAVAIL_SCOPE,
  FRANCE_TRAVAIL_SEARCH_URL,
  FRANCE_TRAVAIL_TOKEN_URL,
  FranceTravailSource,
  MAX_DEPARTMENTS,
  MAX_PAGES,
  cleanKeywords,
  contractParams,
  departmentFrom,
  haversineKm,
} from "./france-travail"
import { RadarSourceError } from "./errors"
import type { RadarCriteria } from "../types"

const criteria = (over: Partial<RadarCriteria> = {}): RadarCriteria => ({
  keywords: "développeur typescript",
  romeCodes: [],
  departments: [],
  latitude: null,
  longitude: null,
  radiusKm: null,
  contractTypes: [],
  sources: ["FRANCE_TRAVAIL"],
  ...over,
})

const rawOffer = (id: string, over: Record<string, unknown> = {}) => ({
  id,
  intitule: `Développeur ${id}`,
  description: "Description de l'offre.",
  dateCreation: "2026-10-01T08:00:00.000Z",
  lieuTravail: { libelle: "75 - PARIS 08", latitude: 48.87, longitude: 2.31, codePostal: "75008" },
  romeCode: "M1805",
  entreprise: { nom: "Acme" },
  typeContrat: "CDI",
  experienceLibelle: "3 ans",
  salaire: { libelle: "Annuel de 45000 Euros à 55000 Euros" },
  origineOffre: { urlOrigine: "https://example.test/offre/" + id },
  contact: { urlPostulation: "https://example.test/postuler/" + id },
  ...over,
})

const tokenResponse = () => new Response(JSON.stringify({ access_token: "tok", expires_in: 1499 }), { status: 200 })
const page = (items: unknown[], status = 200) => new Response(JSON.stringify({ resultats: items }), { status })

let calls: Array<{ url: string; init?: RequestInit }>
let responses: Array<() => Response>
const fetchMock = vi.fn(async (url: string | URL | Request, init?: RequestInit) => {
  calls.push({ url: String(url), init })
  const next = responses.shift()
  if (!next) throw new Error("réponse simulée manquante pour " + String(url))
  return next()
})

const source = (now = () => 1_000_000) =>
  new FranceTravailSource({ clientId: "id", clientSecret: "secret", fetchImpl: fetchMock as unknown as typeof fetch, now })

beforeEach(() => {
  calls = []
  responses = []
  fetchMock.mockClear()
})

describe("authentification", () => {
  it("demande un jeton client_credentials avec le scope et le réutilise tant qu'il est valable", async () => {
    responses = [tokenResponse, () => page([rawOffer("A")]), () => page([rawOffer("B")])]
    const s = source()
    await s.search(criteria())
    await s.search(criteria())
    const tokenCalls = calls.filter(c => c.url === FRANCE_TRAVAIL_TOKEN_URL)
    expect(tokenCalls).toHaveLength(1)
    const body = tokenCalls[0].init!.body as URLSearchParams
    expect(body.get("grant_type")).toBe("client_credentials")
    expect(body.get("scope")).toBe(FRANCE_TRAVAIL_SCOPE)
    expect((calls[1].init!.headers as Record<string, string>).Authorization).toBe("Bearer tok")
  })

  it("renouvelle le jeton expiré", async () => {
    let clock = 1_000_000
    responses = [tokenResponse, () => page([]), tokenResponse, () => page([])]
    const s = source(() => clock)
    await s.search(criteria())
    clock += 1_500_000 // au-delà de expires_in
    await s.search(criteria())
    expect(calls.filter(c => c.url === FRANCE_TRAVAIL_TOKEN_URL)).toHaveLength(2)
  })

  it("jeton refusé (401) : renouvelé une fois puis la requête est rejouée", async () => {
    responses = [tokenResponse, () => new Response("", { status: 401 }), tokenResponse, () => page([rawOffer("A")])]
    const out = await source().search(criteria())
    expect(out).toHaveLength(1)
  })

  it("identifiants refusés : erreur AUTH sans fuite de secret", async () => {
    responses = [() => new Response('{"error":"invalid_client","secret":"fuite"}', { status: 400 })]
    const err = await source().search(criteria()).catch((e: unknown) => e)
    expect(err).toBeInstanceOf(RadarSourceError)
    expect((err as RadarSourceError).code).toBe("AUTH")
    expect((err as Error).message).not.toMatch(/fuite|secret/)
  })
})

describe("recherche", () => {
  it("construit la requête : mots-clés nettoyés, ROME, contrats, département, plage, tri récent", async () => {
    responses = [tokenResponse, () => page([])]
    await source().search(
      criteria({ keywords: "développeur <script>typescript</script>!", romeCodes: ["M1805"], departments: ["75"], contractTypes: ["CDI", "ALTERNANCE", "FREELANCE"] }),
    )
    const url = new URL(calls[1].url)
    expect(`${url.origin}${url.pathname}`).toBe(FRANCE_TRAVAIL_SEARCH_URL)
    const q = url.searchParams
    expect(q.get("motsCles")).toBe("développeur script typescript script")
    expect(q.get("codeROME")).toBe("M1805")
    expect(q.get("departement")).toBe("75")
    expect(q.get("typeContrat")).toBe("CDI,LIB")
    expect(q.get("natureContrat")).toBe("E1,E2")
    expect(q.get("range")).toBe("0-149")
    expect(q.get("sort")).toBe("1")
  })

  it("204 : aucun résultat ; pagination : 206 puis 200, deux pages au plus", async () => {
    responses = [tokenResponse, () => new Response(null, { status: 204 })]
    expect(await source().search(criteria())).toEqual([])

    calls = []
    const full = Array.from({ length: 150 }, (_, i) => rawOffer("P" + i))
    responses = [tokenResponse, () => page(full, 206), () => page(full, 206), () => page(full, 206)]
    const out = await source().search(criteria())
    expect(calls.filter(c => c.url.startsWith(FRANCE_TRAVAIL_SEARCH_URL))).toHaveLength(MAX_PAGES)
    expect(out).toHaveLength(150 * MAX_PAGES)
    expect(new URL(calls[calls.length - 1].url).searchParams.get("range")).toBe("150-299")
  })

  it("une requête par département, plafonnée", async () => {
    responses = [tokenResponse, ...Array.from({ length: 5 }, () => () => page([]))]
    await source().search(criteria({ departments: ["75", "92", "93", "94", "95"] }))
    const deps = calls.filter(c => c.url.startsWith(FRANCE_TRAVAIL_SEARCH_URL)).map(c => new URL(c.url).searchParams.get("departement"))
    expect(deps).toEqual(["75", "92", "93"].slice(0, MAX_DEPARTMENTS))
  })

  it("stage seul : source non concernée, aucun appel réseau", async () => {
    expect(await source().search(criteria({ contractTypes: ["STAGE"] }))).toEqual([])
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it("normalise une offre et écarte celles qui sont invalides sans tout rejeter", async () => {
    responses = [tokenResponse, () => page([rawOffer("OK"), { id: "", intitule: "x" }, { pas: "une offre" }, rawOffer("OK2", { entreprise: null, salaire: null })])]
    const out = await source().search(criteria())
    expect(out.map(o => o.externalId)).toEqual(["OK", "OK2"])
    expect(out[0]).toMatchObject({
      source: "FRANCE_TRAVAIL",
      title: "Développeur OK",
      company: "Acme",
      department: "75",
      contractType: "CDI",
      romeCode: "M1805",
      salaryLabel: "Annuel de 45000 Euros à 55000 Euros",
      sourceUrl: "https://example.test/offre/OK",
      applyUrl: "https://example.test/postuler/OK",
    })
    expect(out[0].publishedAt?.toISOString()).toBe("2026-10-01T08:00:00.000Z")
    expect(out[1].company).toBeNull()
    expect(out[1].salaryLabel).toBeNull()
  })

  it("liens non http(s) rejetés ; lien public de repli construit depuis l'identifiant", async () => {
    responses = [tokenResponse, () => page([rawOffer("L1", { origineOffre: { urlOrigine: "javascript:alert(1)" }, contact: { urlPostulation: "ftp://x" } })])]
    const [o] = await source().search(criteria())
    expect(o.sourceUrl).toBe("https://candidat.francetravail.fr/offres/recherche/detail/L1")
    expect(o.applyUrl).toBeNull()
  })

  it("rayon : filtre les offres géolocalisées hors zone, garde celles sans coordonnées", async () => {
    const lyon = { libelle: "69 - LYON 03", latitude: 45.76, longitude: 4.85, codePostal: "69003" }
    const sansGeo = { libelle: "75 - PARIS", latitude: null, longitude: null, codePostal: "75001" }
    responses = [tokenResponse, () => page([rawOffer("PAR"), rawOffer("LYO", { lieuTravail: lyon }), rawOffer("NOGEO", { lieuTravail: sansGeo })])]
    const out = await source().search(criteria({ latitude: 48.85, longitude: 2.35, radiusKm: 30 }))
    expect(out.map(o => o.externalId)).toEqual(["PAR", "NOGEO"])
  })
})

describe("erreurs de la source", () => {
  it.each([
    [429, "RATE_LIMITED"],
    [400, "BAD_REQUEST"],
    [500, "UPSTREAM"],
  ] as const)("statut %i → %s", async (status, code) => {
    responses = [tokenResponse, () => new Response("corps secret", { status })]
    const err = (await source().search(criteria()).catch((e: unknown) => e)) as RadarSourceError
    expect(err.code).toBe(code)
    expect(err.message).not.toMatch(/corps secret/)
  })

  it("enveloppe invalide : INVALID_RESPONSE ; réseau coupé : UPSTREAM", async () => {
    responses = [tokenResponse, () => new Response(JSON.stringify({ autre: 1 }), { status: 200 })]
    expect(((await source().search(criteria()).catch((e: unknown) => e)) as RadarSourceError).code).toBe("INVALID_RESPONSE")

    fetchMock.mockImplementationOnce(async () => {
      throw new TypeError("fetch failed")
    })
    expect(((await source().search(criteria()).catch((e: unknown) => e)) as RadarSourceError).code).toBe("UPSTREAM")
  })
})

describe("utilitaires", () => {
  it("departmentFrom : libellé, code postal, outre-mer, Corse", () => {
    expect(departmentFrom("75 - PARIS 08", null)).toBe("75")
    expect(departmentFrom("2A - AJACCIO", null)).toBe("2A")
    expect(departmentFrom(null, "97411")).toBe("974")
    expect(departmentFrom(null, "31000")).toBe("31")
    expect(departmentFrom(null, "20000")).toBeNull()
    expect(departmentFrom("France", null)).toBeNull()
  })

  it("contractParams : STAGE seul non couvert", () => {
    expect(contractParams([])).toEqual({})
    expect(contractParams(["STAGE"])).toBeNull()
    expect(contractParams(["CDD", "STAGE"])).toEqual({ typeContrat: "CDD" })
  })

  it("cleanKeywords et haversineKm", () => {
    expect(cleanKeywords("a b c d e f g h")).toBe("a b c d e f")
    expect(Math.round(haversineKm(48.8566, 2.3522, 45.764, 4.8357))).toBeGreaterThan(380)
    expect(Math.round(haversineKm(48.8566, 2.3522, 45.764, 4.8357))).toBeLessThan(400)
  })
})
