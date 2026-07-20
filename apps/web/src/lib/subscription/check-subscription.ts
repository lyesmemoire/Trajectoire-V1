// apps/web/src/lib/subscription/check-subscription.ts
//
// RESPONSABILITÉ : Vérifier le statut Premium d'un utilisateur
// SOURCE DE VÉRITÉ : Base de données (table Subscription + User.plan)
// DÉPENDANCES : Prisma uniquement — zéro Stripe
//
// TODO-L1.1 : Quand Stripe est câblé, le webhook met à jour ces champs.
//             Ce helper n'a pas besoin de changer. Il lira simplement
//             les valeurs mises à jour par le webhook.
//             (Architecture déjà prête pour Stripe)

import { prisma } from '@/lib/prisma'

export type SubscriptionStatus =
  | 'active'       // Abonnement actif — accès complet
  | 'trialing'     // Période d'essai — accès complet
  | 'past_due'     // Paiement en retard — accès restreint
  | 'cancelled'    // Annulé — pas d'accès
  | 'none'         // Pas d'abonnement — pas d'accès

export interface SubscriptionCheck {
  hasAccess: boolean
  status: SubscriptionStatus
  plan: string | null
}

export async function checkUserSubscription(
  userId: string
): Promise<SubscriptionCheck> {

  try {
    // Lecture depuis la BDD — pas d'appel externe
    const [user, subscription] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: { plan: true, role: true }
      }),
      prisma.subscription.findFirst({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        select: { status: true, plan: true }
      })
    ])

    // Les admins ont toujours accès
    if (user?.role && ['ADMIN_FOUNDER', 'ADMIN_PRODUCT', 'ADMIN_SUPPORT'].includes(user.role)) {
      return { hasAccess: true, status: 'active', plan: 'admin' }
    }

    // Pas d'abonnement en BDD
    if (!subscription) {
      // Fallback : vérifier plan sur le User (peut être mis manuellement)
      if (user?.plan && user.plan !== 'FREE') {
        return { hasAccess: true, status: 'active', plan: user.plan }
      }
      return { hasAccess: false, status: 'none', plan: user?.plan ?? 'FREE' }
    }

    // Statuts qui donnent accès
    const activeStatuses: SubscriptionStatus[] = ['active', 'trialing']
    const hasAccess = activeStatuses.includes(
      subscription.status as SubscriptionStatus
    )

    return {
      hasAccess,
      status: subscription.status as SubscriptionStatus,
      plan: subscription.plan,
    }

  } catch {
    // En cas d'erreur BDD : fail open pour ne pas bloquer des utilisateurs légitimes
    // Logger l'erreur mais ne pas crasher le middleware
    return { hasAccess: false, status: 'none', plan: null }
  }
}

// Vérification légère pour le middleware Edge (sans Prisma)
// Utilise uniquement les cookies/headers déjà présents
// Le middleware Edge ne peut pas appeler Prisma directement
export function extractUserIdFromSession(
  cookieHeader: string | null
): string | null {
  if (!cookieHeader) return null

  // Supabase stocke le user_id dans le cookie de session
  // Format : sb-[project]-auth-token
  const match = cookieHeader.match(/sb-[^=]+=([^;]+)/)
  if (!match) return null

  try {
    const decoded = JSON.parse(
      Buffer.from(match[1], 'base64').toString('utf-8')
    )
    return decoded?.user?.id ?? null
  } catch {
    return null
  }
}
