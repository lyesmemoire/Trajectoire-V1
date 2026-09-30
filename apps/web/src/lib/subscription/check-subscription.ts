// apps/web/src/lib/subscription/check-subscription.ts
//
// RESPONSABILITÉ : Vérifier le statut Premium d'un utilisateur
// SOURCE DE VÉRITÉ : Base de données (table Subscription + User.plan)
// DÉPENDANCES : Prisma uniquement — zéro Stripe
//

//             Ce helper n'a pas besoin de changer. Il lira simplement
//             les valeurs mises à jour par le webhook.
//             (Architecture déjà prête pour Stripe)

import { isAdminRole, loadPlanAccess } from '@/lib/quota/plan-access'

export type SubscriptionStatus =
  | 'active'       // Abonnement actif — accès complet
  | 'trialing'     // Période d'essai — accès complet
  | 'past_due'     // Paiement en retard — période de grâce : accès maintenu
  | 'cancelled'    // Annulé — pas d'accès
  | 'none'         // Pas d'abonnement — pas d'accès

export interface SubscriptionCheck {
  hasAccess: boolean
  status: SubscriptionStatus
  plan: string | null
}

/**
 * Accès « premium » = plan effectif PACK ou PRO (mêmes fonctionnalités, seul le
 * quota de simulations diffère). Un Pack expiré, ou un PRO dont l'abonnement n'est ni
 * `active` ni `past_due` (période de grâce), n'ouvre plus d'accès : voir lib/quota/plan-access.
 */
export async function checkUserSubscription(userId: string): Promise<SubscriptionCheck> {

  try {
    const access = await loadPlanAccess(userId)

    // Les admins ont toujours accès
    if (isAdminRole(access.role)) {
      return { hasAccess: true, status: 'active', plan: 'admin' }
    }

    const hasAccess = access.effective === 'PRO' || access.effective === 'PACK'

    const status: SubscriptionStatus = access.subscription
      ? (access.subscription.status as SubscriptionStatus)
      : hasAccess
        ? 'active'
        : 'none'

    return { hasAccess, status, plan: access.effective }

  } catch {
    // En cas d'erreur BDD : accès refusé (fail closed), sans faire échouer la page
    return { hasAccess: false, status: 'none', plan: null }
  }
}

// Vérification légère pour le middleware Edge (sans Prisma)
// Utilise uniquement les cookies/headers déjà présents
// Le middleware Edge ne peut pas appeler Prisma directement
export function extractUserIdFromSession(cookieHeader: string | null): string | null {
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
