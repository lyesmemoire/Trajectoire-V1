import type { PlanId } from "@/lib/plans"

/**
 * Plans payants que l'on peut acheter par Stripe. Liste blanche unique : tout ce qui n'y figure pas (FREE,
 * valeur inconnue, chaîne vide) est ignoré. Utilisée par la page de retour de paiement et par la conservation
 * du plan choisi à l'inscription.
 */
export const PAID_PLANS = ["PACK", "PRO"] as const satisfies readonly PlanId[]
export type PaidPlan = (typeof PAID_PLANS)[number]

export function parsePaidPlan(value: unknown): PaidPlan | null {
  return PAID_PLANS.includes(value as PaidPlan) ? (value as PaidPlan) : null
}

/**
 * Adresses de retour de Stripe Checkout. Le plan figure dans l'adresse de succès comme simple indice d'affichage
 * (ce que la page attend du webhook) : l'accès réel ne dépend jamais de ce paramètre.
 */
export function buildCheckoutReturnUrls(appUrl: string, plan: PaidPlan): { successUrl: string; cancelUrl: string } {
  const base = appUrl.replace(/\/+$/, "")
  return {
    successUrl: `${base}/billing/success?plan=${plan}`,
    cancelUrl: `${base}/pricing?checkout=cancelled`,
  }
}
