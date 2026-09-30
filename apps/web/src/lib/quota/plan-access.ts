/**
 * Accès par plan — source unique du « plan effectif » d'un utilisateur.
 *
 * Règles (lib/plans.ts est la grille) :
 * - PRO n'est valable que si l'abonnement Stripe est `active` ou `past_due`
 *   (`Subscription.status`). `past_due` = période de grâce : Stripe relance encore le
 *   paiement, l'abonné est de bonne foi, on ne coupe pas. Les autres statuts (`canceled`,
 *   `unpaid`, `incomplete`, `incomplete_expired`, `paused`…) ramènent à FREE immédiatement.
 *   La fin de la grâce est décidée par Stripe (réglage des relances) : il envoie ensuite
 *   `unpaid` ou `customer.subscription.deleted`.
 * - PACK n'est valable que tant que `packExpiresAt` n'est pas dépassé.
 * - Sinon : FREE (aperçu de l'analyse de CV uniquement, aucune simulation).
 *
 * Utilisé par le quota de simulations, `checkUserSubscription` et les routes
 * réservées aux offres payantes (analyse complète, réécriture du CV).
 */

import { NextResponse } from "next/server"

import { prisma } from "@/lib/prisma"
import {
  PLANS,
  canFullCVAnalysis,
  getEffectivePlanId,
  isExpired,
  type PlanId,
  type PlanUser,
} from "@/lib/plans"

export interface PlanAccess {
  planUser: PlanUser
  /** Plan réellement applicable (un Pack expiré est déjà ramené à FREE). */
  effective: PlanId
  /** Vrai si le Pack de l'utilisateur est arrivé à échéance. */
  expired: boolean
  role: string | null
  subscription: { status: string; currentPeriodEnd: Date } | null
}

const ADMIN_ROLES = ["ADMIN_FOUNDER", "ADMIN_PRODUCT", "ADMIN_SUPPORT"]

/** Statuts d'abonnement Stripe qui donnent accès à PRO (`past_due` = période de grâce). */
export const PRO_ACCESS_STATUSES = ["active", "past_due"] as const

export function isProAccessStatus(status: string | null | undefined): boolean {
  return !!status && (PRO_ACCESS_STATUSES as readonly string[]).includes(status)
}

export function isAdminRole(role: string | null | undefined): boolean {
  return !!role && ADMIN_ROLES.includes(role)
}

export async function loadPlanAccess(userId: string): Promise<PlanAccess> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      plan: true,
      role: true,
      simulationsUsed: true,
      packExpiresAt: true,
      Subscription: {
        select: { status: true, currentPeriodEnd: true },
      },
    },
  })

  const proActive = user?.plan === "PRO" && isProAccessStatus(user.Subscription?.status)

  const planUser: PlanUser = {
    plan: proActive ? "PRO" : user?.plan === "PACK" ? "PACK" : "FREE",
    simulationsUsed: user?.simulationsUsed ?? 0,
    packExpiresAt: user?.packExpiresAt ?? null,
  }

  return {
    planUser,
    effective: getEffectivePlanId(planUser),
    expired: isExpired(planUser),
    role: user?.role ?? null,
    subscription: user?.Subscription ?? null,
  }
}

/** Analyse de CV complète : PACK ou PRO actifs (et administrateurs). */
export async function hasFullCvAnalysis(userId: string): Promise<boolean> {
  const access = await loadPlanAccess(userId)
  return isAdminRole(access.role) || canFullCVAnalysis(access.planUser)
}

/**
 * Garde de route : `null` si l'accès est autorisé, sinon la réponse 403 à
 * renvoyer (avant tout appel IA ou toute écriture).
 */
export async function requireFullCvAnalysis(
  userId: string,
): Promise<NextResponse | null> {
  const access = await loadPlanAccess(userId)

  if (isAdminRole(access.role) || canFullCVAnalysis(access.planUser)) {
    return null
  }

  return NextResponse.json(
    {
      error: "PLAN_REQUIRED",
      message: access.expired
        ? `Votre ${PLANS.PACK.name} a expiré. Reprenez un Pack ou passez Pro pour retrouver l'analyse complète du CV.`
        : `L'analyse complète du CV est réservée au ${PLANS.PACK.name} et à Pro.`,
      requiredPlans: ["PACK", "PRO"],
      upgradeUrl: "/pricing",
    },
    { status: 403 },
  )
}
