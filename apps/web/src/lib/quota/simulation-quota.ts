/**
 * Simulation Quota
 *
 * Source de vÃ©ritÃ© : `interview_sessions` (COUNT par userId + createdAt dans la pÃ©riode).
 *
 * PROPRIÃ‰TÃ‰S DES OFFRES :
 * - FREE : 1 simulation totale (lifetime).
 * - INTERVIEW_PACK : 5 simulations totales depuis la date d'achat (lifetime).
 * - PRO : 20 simulations par pÃ©riode d'abonnement (mensuel).
 */

import { prisma } from "@/lib/prisma"
import { SubscriptionService } from "@/lib/authorization/SubscriptionService"
import { SubscriptionPlan } from "@/types/subscription"

export interface SimulationQuota {
  plan: string
  resource: "simulations"
  limit: number | null
  used: number
  remaining: number | null
  isUnlimited: boolean
  periodStart: Date
  periodEnd: Date | null
  allowed: boolean
}

/**
 * Retourne le quota de simulations de l'utilisateur.
 * PrioritÃ© : PRO > INTERVIEW_PACK > FREE
 */
export async function checkSimulationQuota(userId: string): Promise<SimulationQuota> {
  // 1. Charger l'utilisateur avec son abonnement PRO Ã©ventuel et son (dernier) achat de pack
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      plan: true,
      Subscription: {
        select: { status: true, currentPeriodEnd: true, plan: true }
      },
      UserPurchase: {
        where: { type: "INTERVIEW_PACK", status: "ACTIVE" },
        orderBy: { activatedAt: "desc" },
        take: 1
      }
    },
  })

  // === SI PRO ACTIF ===
  const hasActivePro = user?.Subscription?.status === "active" &&
    (user.Subscription.plan === "PRO" || user.Subscription.plan === "EXPERT")

  if (hasActivePro) {
    const planRaw = user.Subscription!.plan
    // Limite depuis SubscriptionService (PRO=20, EXPERT=illimitÃ©)
    const limit = planRaw === "EXPERT" ? null :
      SubscriptionService.getMonthlyQuota(SubscriptionPlan.PRO, "simulations") ?? 20

    const periodEnd = user.Subscription!.currentPeriodEnd
    const periodStart = new Date(periodEnd)
    periodStart.setMonth(periodStart.getMonth() - 1)

    const used = await prisma.interviewSession.count({
      where: { userId, createdAt: { gte: periodStart, lt: periodEnd } }
    })

    const isUnlimited = limit === null
    const remaining = isUnlimited ? null : Math.max(0, limit - used)

    return {
      plan: planRaw,
      resource: "simulations",
      limit,
      used,
      remaining,
      isUnlimited,
      periodStart,
      periodEnd,
      allowed: isUnlimited || (remaining !== null && remaining > 0)
    }
  }

  // === SI INTERVIEW_PACK ACTIF ===
  const latestPack = user?.UserPurchase?.[0]
  if (latestPack) {
    const limit = 5
    const periodStart = latestPack.activatedAt
    const periodEnd = null // lifetime pour ce pack

    const used = await prisma.interviewSession.count({
      where: { userId, createdAt: { gte: periodStart } }
    })

    const remaining = Math.max(0, limit - used)

    return {
      plan: "INTERVIEW_PACK",
      resource: "simulations",
      limit,
      used,
      remaining,
      isUnlimited: false,
      periodStart,
      periodEnd,
      allowed: remaining > 0
    }
  }

  // === SINON FREE ===
  const limit = 1
  const periodStart = new Date(0) // depuis toujours
  const periodEnd = null // lifetime

  const used = await prisma.interviewSession.count({
    where: { userId } // depuis le dÃ©but du compte
  })

  const remaining = Math.max(0, limit - used)

  return {
    plan: "FREE",
    resource: "simulations",
    limit,
    used,
    remaining,
    isUnlimited: false,
    periodStart,
    periodEnd,
    allowed: remaining > 0
  }
}
