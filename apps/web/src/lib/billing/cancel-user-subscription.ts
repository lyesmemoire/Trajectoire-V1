/**
 * Annule immédiatement l'abonnement Stripe d'un utilisateur.
 *
 * Utilisé à la suppression de compte : sans cela, l'abonnement resterait actif
 * et Stripe continuerait de prélever une personne qui n'a plus de compte.
 *
 * - Aucun abonnement connu (ligne absente, ou `stripeSubId` vidé par le webhook
 *   `customer.subscription.deleted`) : rien à faire.
 * - Abonnement introuvable ou déjà terminé côté Stripe : considéré comme réglé.
 * - Toute autre erreur est relancée : l'appelant doit interrompre la suppression
 *   plutôt que de laisser un abonnement actif sans compte.
 *
 * Le client Stripe (`customer`) et l'historique de facturation ne sont pas
 * supprimés : Stripe conserve les factures, obligation comptable.
 */

import { prisma } from "@/lib/prisma"
import { stripe } from "@/lib/stripe"
import { logger } from "@/lib/logger"

export async function cancelUserSubscription(
  userId: string,
): Promise<{ cancelled: boolean }> {
  const subscription = await prisma.subscription.findUnique({
    where: { userId },
    select: { stripeSubId: true },
  })

  const subscriptionId = subscription?.stripeSubId
  if (!subscriptionId) return { cancelled: false }

  try {
    await stripe.subscriptions.cancel(subscriptionId)
    logger.info({ userId, subscriptionId }, "[billing] abonnement Stripe annulé (suppression de compte)")
    return { cancelled: true }
  } catch (error) {
    if ((error as { code?: string }).code === "resource_missing") {
      return { cancelled: false }
    }

    // Déjà annulé : Stripe refuse une seconde annulation. On vérifie l'état réel.
    try {
      const current = await stripe.subscriptions.retrieve(subscriptionId)
      if (current.status === "canceled") return { cancelled: false }
    } catch {
      // Lecture impossible : on relance l'erreur d'origine ci-dessous.
    }

    throw error
  }
}
