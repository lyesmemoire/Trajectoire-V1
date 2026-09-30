/**
 * Simulation Quota
 *
 * Les droits viennent de lib/plans.ts (source de vérité de la grille) :
 * - FREE : 0 simulation.
 * - PACK : 5 simulations, valables 3 mois à compter de l'achat. Le compteur est
 *          `users.simulationsUsed`, l'échéance `users.packExpiresAt` (posés par le
 *          webhook Stripe).
 * - PRO  : illimité, tant que l'abonnement Stripe est actif.
 *
 * Un Pack expiré retombe sur FREE (cf. getEffectivePlanId).
 *
 * `checkSimulationQuota` est une lecture. La consommation d'une simulation se
 * fait par `consumeSimulation`, atomique côté base : deux créations simultanées
 * ne peuvent pas dépasser la limite du Pack.
 */

import { prisma } from "@/lib/prisma"
import { loadPlanAccess } from "./plan-access"
import {
  PLANS,
  canSimulate,
  getEffectivePlanId,
  getRemainingSimulations,
  isExpired,
  type PlanId,
  type PlanUser,
} from "@/lib/plans"

export interface SimulationQuota {
  /** Plan effectif : un Pack expiré est déjà ramené à FREE. */
  plan: PlanId
  resource: "simulations"
  limit: number | null
  used: number
  remaining: number | null
  isUnlimited: boolean
  periodStart: Date | null
  /** Expiration du Pack, ou fin de période de l'abonnement PRO. */
  periodEnd: Date | null
  allowed: boolean
  /** Vrai si le Pack de l'utilisateur est arrivé à échéance. */
  expired: boolean
  /** Vrai pour un PRO dont le dernier paiement a échoué (période de grâce, `past_due`). */
  paymentPastDue: boolean
}

/**
 * Retourne le quota de simulations de l'utilisateur.
 */
export async function checkSimulationQuota(userId: string): Promise<SimulationQuota> {
  const { planUser, subscription } = await loadPlanAccess(userId)

  const effective = getEffectivePlanId(planUser)
  const plan = PLANS[effective]
  const remaining = getRemainingSimulations(planUser)
  const expired = isExpired(planUser)

  const periodEnd =
    planUser.plan === "PRO"
      ? (subscription?.currentPeriodEnd ?? null)
      : planUser.plan === "PACK"
        ? planUser.packExpiresAt
          ? new Date(planUser.packExpiresAt)
          : null
        : null

  return {
    plan: effective,
    resource: "simulations",
    limit: plan.simulationLimit,
    used: effective === "PACK" ? planUser.simulationsUsed : 0,
    remaining,
    isUnlimited: plan.simulationLimit === null,
    periodStart: null,
    periodEnd,
    allowed: canSimulate(planUser),
    expired,
    paymentPastDue: planUser.plan === "PRO" && subscription?.status === "past_due",
  }
}

/**
 * Consomme une simulation. À appeler juste avant de créer la session.
 *
 * - PRO : rien à décompter.
 * - PACK : incrément atomique conditionné à « il reste des simulations » et
 *   « le Pack n'a pas expiré » — un compteur déjà à 5 ne peut jamais passer à 6,
 *   même avec deux requêtes concurrentes.
 * - FREE : refus.
 */
export async function consumeSimulation(
  userId: string,
): Promise<{ ok: boolean; quota: SimulationQuota }> {
  const quota = await checkSimulationQuota(userId)
  if (!quota.allowed) return { ok: false, quota }
  if (quota.plan !== "PACK") return { ok: true, quota }

  const limit = PLANS.PACK.simulationLimit ?? 0
  const { count } = await prisma.user.updateMany({
    where: {
      id: userId,
      plan: "PACK",
      simulationsUsed: { lt: limit },
      OR: [{ packExpiresAt: null }, { packExpiresAt: { gt: new Date() } }],
    },
    data: { simulationsUsed: { increment: 1 } },
  })

  if (count === 0) {
    // Course perdue (dernière simulation prise entre-temps) ou Pack expiré.
    return { ok: false, quota: await checkSimulationQuota(userId) }
  }
  return { ok: true, quota }
}

/**
 * Rend une simulation consommée quand la création a échoué juste après
 * `consumeSimulation`. Sans effet hors Pack (compteur jamais négatif).
 */
export async function releaseSimulation(userId: string): Promise<void> {
  await prisma.user.updateMany({
    where: { id: userId, plan: "PACK", simulationsUsed: { gt: 0 } },
    data: { simulationsUsed: { decrement: 1 } },
  })
}
