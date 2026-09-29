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
}

/**
 * Retourne le quota de simulations de l'utilisateur.
 */
export async function checkSimulationQuota(userId: string): Promise<SimulationQuota> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      plan: true,
      simulationsUsed: true,
      packExpiresAt: true,
      Subscription: {
        select: { status: true, currentPeriodEnd: true },
      },
    },
  })

  // PRO n'est valable que si l'abonnement Stripe est actif ; sinon on ne
  // conserve rien de plus que le plan gratuit.
  const proActive = user?.plan === "PRO" && user.Subscription?.status === "active"

  const planUser: PlanUser = {
    plan: proActive ? "PRO" : user?.plan === "PACK" ? "PACK" : "FREE",
    simulationsUsed: user?.simulationsUsed ?? 0,
    packExpiresAt: user?.packExpiresAt ?? null,
  }

  const effective = getEffectivePlanId(planUser)
  const plan = PLANS[effective]
  const remaining = getRemainingSimulations(planUser)
  const expired = isExpired(planUser)

  const periodEnd =
    planUser.plan === "PRO"
      ? (user?.Subscription?.currentPeriodEnd ?? null)
      : planUser.plan === "PACK"
        ? (user?.packExpiresAt ?? null)
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
