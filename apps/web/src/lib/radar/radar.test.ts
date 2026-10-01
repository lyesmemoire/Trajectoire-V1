import { describe, it, expect } from "vitest"
import { CLOSED_AFTER_DAYS, STALE_AFTER_DAYS, decideOfferStatus, dedupeOffers, offerFingerprint } from "./dedupe"
import { MAX_RADAR_SEARCHES_PER_USER, MatchStatePatchSchema, RadarSearchInputSchema, RadarSearchPatchSchema } from "./schemas"
import { MIN_CV_CHARS, scoreOffer } from "./scoring"
import type { NormalizedOffer } from "./types"

const offer = (over: Partial<NormalizedOffer> = {}): NormalizedOffer => ({
  source: "FRANCE_TRAVAIL",
  externalId: "A1",
  title: "Développeur TypeScript",
  company: "Acme",
  locationLabel: "Paris",
  department: "75",
  latitude: null,
  longitude: null,
  contractType: "CDI",
  romeCode: "M1805",
  experience: null,
  salaryLabel: null,
  description: "Nous recherchons un développeur TypeScript maîtrisant React et PostgreSQL.",
  sourceUrl: "https://example.test/offre/A1",
  applyUrl: null,
  publishedAt: null,
  ...over,
})

describe("offerFingerprint", () => {
  it("insensible à la casse, aux accents, à la ponctuation et aux espaces", () => {
    const a = offerFingerprint({ title: "Développeur  TypeScript", company: "ACME", locationLabel: "Paris" })
    const b = offerFingerprint({ title: "developpeur typescript", company: "Acme", locationLabel: " paris " })
    expect(a).toBe(b)
  })

  it("distingue entreprise, intitulé et lieu", () => {
    const base = { title: "Développeur", company: "Acme", locationLabel: "Paris" }
    const fp = offerFingerprint(base)
    expect(offerFingerprint({ ...base, company: "Autre" })).not.toBe(fp)
    expect(offerFingerprint({ ...base, title: "Comptable" })).not.toBe(fp)
    expect(offerFingerprint({ ...base, locationLabel: "Lyon" })).not.toBe(fp)
  })
})

describe("dedupeOffers", () => {
  it("fusionne une même annonce vue par deux sources, en gardant celle avec lien de candidature", () => {
    const ft = offer({ source: "FRANCE_TRAVAIL", externalId: "FT1" })
    const lba = offer({ source: "LA_BONNE_ALTERNANCE", externalId: "LBA1", applyUrl: "https://example.test/postuler" })
    const out = dedupeOffers([ft, lba])
    expect(out).toHaveLength(1)
    expect(out[0].externalId).toBe("LBA1")
  })

  it("à égalité de lien, garde la description la plus complète", () => {
    const short = offer({ externalId: "S", description: "court" })
    const long = offer({ source: "LA_BONNE_ALTERNANCE", externalId: "L", description: "beaucoup plus long et détaillé" })
    expect(dedupeOffers([short, long])[0].externalId).toBe("L")
  })

  it("ne répète jamais le même (source, identifiant) et conserve les offres distinctes", () => {
    const out = dedupeOffers([offer(), offer(), offer({ externalId: "B2", title: "Comptable" })])
    expect(out.map(o => o.externalId)).toEqual(["A1", "B2"])
  })
})

describe("decideOfferStatus", () => {
  const now = new Date("2026-10-10T12:00:00Z")
  const ago = (days: number) => new Date(now.getTime() - days * 86_400_000)

  it("vivante, périmée puis fermée selon la dernière vue (pas de fermeture sur une seule absence)", () => {
    expect(decideOfferStatus(ago(0), now)).toBe("LIVE")
    expect(decideOfferStatus(ago(STALE_AFTER_DAYS - 0.5), now)).toBe("LIVE")
    expect(decideOfferStatus(ago(STALE_AFTER_DAYS), now)).toBe("STALE")
    expect(decideOfferStatus(ago(CLOSED_AFTER_DAYS - 0.5), now)).toBe("STALE")
    expect(decideOfferStatus(ago(CLOSED_AFTER_DAYS), now)).toBe("CLOSED")
  })
})

describe("scoreOffer", () => {
  const cv = (
    "Développeur full stack avec huit ans d'expérience. Maîtrise de TypeScript, React, Node.js et PostgreSQL. " +
    "Conception d'API REST, tests automatisés, intégration continue, revue de code et mentorat d'équipes. " +
    "Missions de migration vers le cloud et d'optimisation de requêtes pour des applications à fort trafic."
  )

  it("CV absent ou trop court : score null, raison explicite, aucune valeur inventée", () => {
    for (const text of [null, undefined, "", "x".repeat(MIN_CV_CHARS - 1)]) {
      const s = scoreOffer(text, offer())
      expect(s.score).toBeNull()
      expect(s.details.reason).toBe("cv_missing")
    }
  })

  it("offre sans exigence exploitable : score null", () => {
    const s = scoreOffer(cv, offer({ title: "Poste", description: "Rejoignez-nous." }))
    expect(s.score).toBeNull()
    expect(s.details.reason).toBe("offer_too_vague")
  })

  it("CV qui couvre l'offre : score élevé, mots retrouvés détaillés", () => {
    const s = scoreOffer(cv, offer({ description: "Nous cherchons un développeur TypeScript, React, Node.js et PostgreSQL, avec tests automatisés et API REST." }))
    expect(s.score).not.toBeNull()
    expect(s.score!).toBeGreaterThanOrEqual(60)
    expect(s.details.matched.length).toBeGreaterThan(0)
    expect(s.details.reason).toBeNull()
  })

  it("CV sans rapport avec l'offre : score nettement plus bas, mots manquants listés", () => {
    const close = scoreOffer(cv, offer({ description: "Développeur TypeScript, React, PostgreSQL, API REST, tests automatisés." }))
    const far = scoreOffer(cv, offer({ title: "Infirmier diplômé d'État", description: "Soins infirmiers, prélèvements, pansements, diplôme d'État infirmier, gestes d'urgence, hygiène hospitalière." }))
    expect(far.score).not.toBeNull()
    expect(far.score!).toBeLessThan(close.score!)
    expect(far.details.missing.length).toBeGreaterThan(0)
  })

  it("déterministe : même entrée, même score", () => {
    const o = offer()
    expect(scoreOffer(cv, o)).toEqual(scoreOffer(cv, o))
  })
})

describe("RadarSearchInputSchema", () => {
  const valid = { name: "Dev Paris", keywords: "développeur typescript" }

  it("applique les valeurs par défaut", () => {
    const r = RadarSearchInputSchema.parse(valid)
    expect(r.sources).toEqual(["FRANCE_TRAVAIL", "LA_BONNE_ALTERNANCE"])
    expect(r.enabled).toBe(true)
    expect(r.departments).toEqual([])
  })

  it("refuse un champ inconnu (un userId client est rejeté)", () => {
    expect(RadarSearchInputSchema.safeParse({ ...valid, userId: "x" }).success).toBe(false)
  })

  it("valide départements et codes ROME", () => {
    expect(RadarSearchInputSchema.safeParse({ ...valid, departments: ["75", "2A", "971"] }).success).toBe(true)
    expect(RadarSearchInputSchema.safeParse({ ...valid, departments: ["99"] }).success).toBe(false)
    expect(RadarSearchInputSchema.safeParse({ ...valid, romeCodes: ["M1805"] }).success).toBe(true)
    expect(RadarSearchInputSchema.safeParse({ ...valid, romeCodes: ["Z1234"] }).success).toBe(false)
  })

  it("rayon : demande un point de départ ; latitude et longitude vont ensemble", () => {
    expect(RadarSearchInputSchema.safeParse({ ...valid, radiusKm: 30 }).success).toBe(false)
    expect(RadarSearchInputSchema.safeParse({ ...valid, latitude: 48.85, longitude: 2.35, radiusKm: 30 }).success).toBe(true)
    expect(RadarSearchInputSchema.safeParse({ ...valid, latitude: 48.85 }).success).toBe(false)
    expect(RadarSearchInputSchema.safeParse({ ...valid, latitude: 48.85, longitude: 2.35, radiusKm: 500 }).success).toBe(false)
  })

  it("exige au moins une source, un nom et des mots-clés", () => {
    expect(RadarSearchInputSchema.safeParse({ ...valid, sources: [] }).success).toBe(false)
    expect(RadarSearchInputSchema.safeParse({ ...valid, name: " " }).success).toBe(false)
    expect(RadarSearchInputSchema.safeParse({ ...valid, keywords: "a" }).success).toBe(false)
  })

  it("plafond de recherches par utilisateur défini", () => {
    expect(MAX_RADAR_SEARCHES_PER_USER).toBe(5)
  })
})

describe("schémas de mise à jour", () => {
  it("recherche : modification partielle, rien d'inconnu, jamais vide", () => {
    expect(RadarSearchPatchSchema.safeParse({ enabled: false }).success).toBe(true)
    expect(RadarSearchPatchSchema.safeParse({}).success).toBe(false)
    expect(RadarSearchPatchSchema.safeParse({ userId: "x" }).success).toBe(false)
  })

  it("état d'une correspondance : on ne peut pas remettre « NEW » ni inventer un état", () => {
    expect(MatchStatePatchSchema.safeParse({ state: "SAVED" }).success).toBe(true)
    expect(MatchStatePatchSchema.safeParse({ state: "NEW" }).success).toBe(false)
    expect(MatchStatePatchSchema.safeParse({ state: "DELETED" }).success).toBe(false)
  })
})
