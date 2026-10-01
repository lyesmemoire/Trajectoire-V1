import type { PlanId } from "@/lib/plans"
import type { PaidPlan } from "./checkout-plan"

export type PaymentStatus = "activated" | "pending"

/**
 * Le paiement est-il pris en compte par l'application ? Décidé uniquement sur le plan EFFECTIF lu en base
 * (que le webhook Stripe met à jour), jamais sur l'adresse de retour : ouvrir la page sans avoir payé ne peut
 * pas afficher un faux succès.
 *
 * - FREE : le webhook n'est pas encore passé (ou aucun paiement) → en attente ;
 * - achat de PRO attendu : tant que le plan effectif n'est pas PRO (un porteur de Pack qui passe à Pro attend
 *   l'activation de l'abonnement) → en attente ;
 * - achat de Pack attendu (ou indice absent) : un plan payant, Pack ou Pro, suffit.
 */
export function resolvePaymentStatus(input: { expected: PaidPlan | null; effectivePlan: PlanId }): PaymentStatus {
  if (input.effectivePlan === "FREE") return "pending"
  if (input.expected === "PRO" && input.effectivePlan !== "PRO") return "pending"
  return "activated"
}
