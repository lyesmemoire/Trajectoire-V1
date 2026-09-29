// apps/web/src/lib/plans.ts
//
// Source de vérité unique de la grille tarifaire : page /pricing, checkout,
// webhook, quotas et page /settings lisent tous ce fichier. Aucun prix ni
// aucune limite ne doit être écrit en dur ailleurs.
//
// Module pur : aucune dépendance (ni Prisma, ni Supabase, ni env) — utilisable
// côté serveur comme côté client. Les identifiants de prix Stripe, eux, vivent
// dans les variables d'environnement et sont résolus côté serveur (checkout).
//
// Attention : `PlanId` reprend les valeurs de l'enum Prisma `Plan`
// (FREE | PACK | PRO) mais les deux types sont indépendants.

export type PlanId = "FREE" | "PACK" | "PRO"

export type CvAnalysisLevel = "none" | "preview" | "full"

export type PlanInterval = "one_time" | "month" | null

export interface PlanFeature {
  label: string
  included: boolean
}

export interface Plan {
  id: PlanId
  name: string
  /** Prix TTC en euros. */
  price: number
  currency: "EUR"
  /** `null` : gratuit. `one_time` : paiement unique. `month` : récurrent. */
  interval: PlanInterval
  /** Nombre de simulations incluses. `null` : illimité. */
  simulationLimit: number | null
  /** Durée de validité des simulations après achat. `null` : sans limite. */
  simulationExpiry: { months: number } | null
  cvAnalysis: CvAnalysisLevel
  /** Nombre maximal de remarques en mode aperçu (`null` si non applicable). */
  cvPreviewRemarksMax: number | null
  features: PlanFeature[]
  /** Offre mise en avant sur /pricing. */
  highlighted: boolean
  /**
   * Emplacement réservé : l'identifiant de prix Stripe dépend de
   * l'environnement (test / live) et est lu côté serveur depuis les variables
   * d'environnement, jamais depuis ce fichier.
   */
  stripePriceId: string | null
}

export const PLANS: Record<PlanId, Plan> = {
  FREE: {
    id: "FREE",
    name: "Gratuit",
    price: 0,
    currency: "EUR",
    interval: null,
    simulationLimit: 0,
    simulationExpiry: null,
    cvAnalysis: "preview",
    cvPreviewRemarksMax: 3,
    features: [
      { label: "Analyse de CV en aperçu (score + 3 remarques)", included: true },
      { label: "Simulations d'entretien", included: false },
      { label: "Analyse de CV complète", included: false },
      { label: "Rapport détaillé d'entretien", included: false },
    ],
    highlighted: false,
    stripePriceId: null,
  },
  PACK: {
    id: "PACK",
    name: "Pack Entretien",
    price: 29,
    currency: "EUR",
    interval: "one_time",
    simulationLimit: 5,
    simulationExpiry: { months: 3 },
    cvAnalysis: "full",
    cvPreviewRemarksMax: null,
    features: [
      { label: "5 simulations d'entretien", included: true },
      { label: "Valables 3 mois", included: true },
      { label: "Rapport détaillé après chaque simulation", included: true },
      { label: "Analyse de CV complète", included: true },
      { label: "Paiement unique, sans renouvellement", included: true },
    ],
    highlighted: true,
    stripePriceId: null,
  },
  PRO: {
    id: "PRO",
    name: "Pro",
    price: 19,
    currency: "EUR",
    interval: "month",
    simulationLimit: null,
    simulationExpiry: null,
    cvAnalysis: "full",
    cvPreviewRemarksMax: null,
    features: [
      { label: "Simulations d'entretien illimitées", included: true },
      { label: "Rapport détaillé après chaque simulation", included: true },
      { label: "Analyse de CV complète", included: true },
      { label: "Résiliable à tout moment", included: true },
    ],
    highlighted: false,
    stripePriceId: null,
  },
}

/** Sous-ensemble de l'utilisateur dont dépendent les droits (colonnes `users`). */
export interface PlanUser {
  plan: PlanId
  simulationsUsed: number
  packExpiresAt: Date | string | null
}

export function getPlan(id: PlanId): Plan {
  return PLANS[id]
}

function toTime(value: Date | string | null): number | null {
  if (value === null) return null
  const time = value instanceof Date ? value.getTime() : Date.parse(value)
  return Number.isNaN(time) ? null : time
}

/**
 * Vrai si le Pack de l'utilisateur est arrivé à échéance. Seul le plan PACK
 * expire. Un PACK sans date d'expiration (donnée incohérente) n'est PAS
 * considéré comme expiré : on ne verrouille pas un client payant à cause d'un
 * défaut de données.
 */
export function isExpired(user: PlanUser, now: Date = new Date()): boolean {
  if (user.plan !== "PACK") return false
  const expiresAt = toTime(user.packExpiresAt)
  return expiresAt !== null && expiresAt <= now.getTime()
}

/** Plan réellement applicable : un Pack expiré retombe sur le plan gratuit. */
export function getEffectivePlanId(
  user: PlanUser,
  now: Date = new Date(),
): PlanId {
  return isExpired(user, now) ? "FREE" : user.plan
}

/**
 * Simulations restantes. `null` = illimité (PRO). Jamais négatif.
 */
export function getRemainingSimulations(
  user: PlanUser,
  now: Date = new Date(),
): number | null {
  const plan = getPlan(getEffectivePlanId(user, now))
  if (plan.simulationLimit === null) return null
  return Math.max(0, plan.simulationLimit - user.simulationsUsed)
}

export function canSimulate(user: PlanUser, now: Date = new Date()): boolean {
  const remaining = getRemainingSimulations(user, now)
  return remaining === null || remaining > 0
}

export function canFullCVAnalysis(
  user: PlanUser,
  now: Date = new Date(),
): boolean {
  return getPlan(getEffectivePlanId(user, now)).cvAnalysis === "full"
}

/**
 * Date d'expiration d'un Pack acheté à `from` (ajoute `simulationExpiry`).
 * `null` si le plan n'expire pas.
 */
export function computePackExpiry(
  planId: PlanId,
  from: Date = new Date(),
): Date | null {
  const expiry = getPlan(planId).simulationExpiry
  if (!expiry) return null
  const date = new Date(from.getTime())
  date.setMonth(date.getMonth() + expiry.months)
  return date
}
