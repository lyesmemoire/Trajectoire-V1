// apps/web/src/lib/subscription/check-subscription.ts
//
// RESPONSABILITÉ : dire si un utilisateur a accès aux fonctionnalités payantes.
// SOURCE DE VÉRITÉ : lib/quota/plan-access (table Subscription + User.plan), donc la
// période de grâce `past_due` et l'expiration du Pack y sont déjà appliquées.
// DÉPENDANCES : Prisma uniquement, aucun appel Stripe (le webhook tient la base à jour).

import { isAdminRole, loadPlanAccess } from '@/lib/quota/plan-access'

/**
 * Statut de l'abonnement Stripe tel qu'enregistré (`Subscription.status`), ou `none`
 * quand il n'y a pas d'abonnement (FREE, ou Pack : paiement unique, pas d'abonnement).
 */
export type SubscriptionStatus =
  | 'active'
  | 'past_due'            // paiement échoué, période de grâce : accès maintenu
  | 'canceled'
  | 'unpaid'
  | 'incomplete'
  | 'incomplete_expired'
  | 'paused'
  | 'none'

export interface SubscriptionCheck {
  hasAccess: boolean
  status: SubscriptionStatus
  plan: string | null
}

/** Résultat en cas de doute (erreur de base) : aucun accès. */
export const NO_ACCESS: SubscriptionCheck = { hasAccess: false, status: 'none', plan: null }

/**
 * Accès « premium » = plan effectif PACK ou PRO (mêmes fonctionnalités, seul le
 * quota de simulations diffère). Un Pack expiré, ou un PRO dont l'abonnement n'est ni
 * `active` ni `past_due` (période de grâce), n'ouvre plus d'accès : voir lib/quota/plan-access.
 *
 * Échec fermé : en cas d'erreur, `hasAccess` est faux. Les appelants doivent se fier à
 * `hasAccess` seul, jamais à `plan` (qui vaut `null` en cas d'erreur).
 */
export async function checkUserSubscription(userId: string): Promise<SubscriptionCheck> {
  try {
    const access = await loadPlanAccess(userId)

    // Les admins ont toujours accès
    if (isAdminRole(access.role)) {
      return { hasAccess: true, status: 'active', plan: 'admin' }
    }

    const hasAccess = access.effective === 'PRO' || access.effective === 'PACK'
    const status = (access.subscription?.status ?? 'none') as SubscriptionStatus

    return { hasAccess, status, plan: access.effective }
  } catch {
    return NO_ACCESS
  }
}
