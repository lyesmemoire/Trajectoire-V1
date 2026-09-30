/**
 * Résumé d'abonnement affiché sur /settings.
 *
 * Fonction pure (aucun accès base) : elle transforme le quota de
 * `checkSimulationQuota` en textes et en indicateurs d'affichage. Les prix et
 * les limites viennent de lib/plans.ts.
 */

import { PLANS, type PlanId } from "@/lib/plans"
import type { SimulationQuota } from "./simulation-quota"

export interface SubscriptionSummary {
  /** Plan effectif (un Pack expiré est déjà ramené à FREE). */
  plan: PlanId
  planName: string
  priceLabel: string
  headline: string
  detail: string | null
  /** Barre de progression du Pack (null hors Pack actif). */
  progress: { used: number; limit: number } | null
  /** Portail Stripe : PACK, PRO, et Pack expiré (historique de facturation). */
  showPortal: boolean
  /** Offres : FREE, Pack expiré ou épuisé. */
  showUpgrade: boolean
}

const dateFormat = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Europe/Paris",
})

function formatDate(value: Date | string): string {
  return dateFormat.format(typeof value === "string" ? new Date(value) : value)
}

function priceLabel(planId: PlanId): string {
  const plan = PLANS[planId]
  if (plan.price === 0) return "Gratuit"
  const price = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: plan.currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(plan.price)
  return plan.interval === "month"
    ? `${price} TTC / mois`
    : `${price} TTC · paiement unique`
}

export function buildSubscriptionSummary(quota: SimulationQuota): SubscriptionSummary {
  const plan = PLANS[quota.plan]
  const base = {
    plan: quota.plan,
    planName: plan.name,
    priceLabel: priceLabel(quota.plan),
    showPortal: quota.plan !== "FREE" || quota.expired,
    showUpgrade: false,
  }

  if (quota.expired) {
    return {
      ...base,
      showUpgrade: true,
      headline: `Votre ${PLANS.PACK.name} a expiré`,
      detail: quota.periodEnd
        ? `Expiré le ${formatDate(quota.periodEnd)}. Les simulations non utilisées ne sont plus disponibles.`
        : null,
      progress: null,
    }
  }

  if (quota.plan === "PRO") {
    return {
      ...base,
      headline: "Simulations illimitées",
      // Période de grâce : le paiement a échoué, l'accès est maintenu le temps des relances.
      detail: quota.paymentPastDue
        ? "Votre dernier paiement a échoué. Mettez à jour votre moyen de paiement depuis le portail pour éviter la coupure de votre accès."
        : quota.periodEnd
          ? `Période en cours jusqu'au ${formatDate(quota.periodEnd)}`
          : null,
      progress: null,
    }
  }

  if (quota.plan === "PACK") {
    const limit = quota.limit ?? 0
    const remaining = quota.remaining ?? 0
    const exhausted = remaining === 0
    return {
      ...base,
      showUpgrade: exhausted,
      headline: exhausted
        ? `Vous avez utilisé vos ${limit} simulations`
        : `${remaining} simulation${remaining > 1 ? "s" : ""} restante${remaining > 1 ? "s" : ""} sur ${limit}`,
      detail: quota.periodEnd
        ? `Valable jusqu'au ${formatDate(quota.periodEnd)}`
        : null,
      progress: { used: Math.min(quota.used, limit), limit },
    }
  }

  return {
    ...base,
    showUpgrade: true,
    headline: "Aucune simulation incluse",
    detail: "Passez au Pack Entretien ou à Pro pour lancer des simulations.",
    progress: null,
  }
}
