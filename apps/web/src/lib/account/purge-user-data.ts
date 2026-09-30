/**
 * Suppression des données applicatives d'un utilisateur (table `public.users` de Prisma
 * et tout ce qui en dépend), à la suppression de compte.
 *
 * Pourquoi : supprimer le compte Supabase Auth ne supprime PAS `public.users` (aucune clé
 * étrangère ni déclencheur entre les deux). Sans cette étape, l'e-mail, le nom, le texte
 * des CV, les opportunités, etc. survivent au compte.
 *
 * - `public.users` : ses ~35 relations sont en `ON DELETE CASCADE` (CV, opportunités,
 *   mémoire de carrière, workspaces, abonnement, achats…).
 * - Tables sans clé étrangère : effacées explicitement ci-dessous.
 * - `stripe_events` (journal d'idempotence des webhooks) et `PreviewAnalysis` : conservés,
 *   mais détachés de la personne (`userId` / `claimedByUserId` mis à null).
 * - `AIUsageLog` : passe à null par la base (`SET NULL`).
 * - `AdminAuditLog` est en `RESTRICT` ET contient les actions de TOUS les utilisateurs (`simulation_create`,
 *   `message_send`…), pas seulement des administrateurs : ses lignes sont donc supprimées avec le compte
 *   (sinon aucun utilisateur ayant lancé une simulation ne pouvait supprimer son compte). Un compte
 *   administrateur (rôle autre que USER) n'est pas purgé : `getAccountDeletionBlocker` le refuse en amont,
 *   avant toute action (annulation Stripe comprise), pour conserver la piste d'audit.
 *
 * Idempotent : une ligne déjà absente n'est pas une erreur, on peut réessayer.
 * Une seule transaction : tout ou rien.
 */

import { prisma } from "@/lib/prisma"

/**
 * Raison pour laquelle le compte ne peut pas être supprimé en libre-service, ou `null`.
 * À appeler AVANT toute action irréversible (abonnement Stripe, suppressions).
 */
export async function getAccountDeletionBlocker(userId: string): Promise<string | null> {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } })
  if (user && user.role !== "USER") {
    return "Ce compte dispose de droits d'administration et d'un historique d'audit conservé pour la sécurité du service : contactez le support pour le supprimer."
  }
  return null
}

export async function purgeUserData(userId: string): Promise<void> {
  await prisma.$transaction([
    prisma.adminAuditLog.deleteMany({ where: { adminId: userId } }),
    prisma.creditUsage.deleteMany({ where: { userId } }),
    prisma.cvRewrite.deleteMany({ where: { userId } }),
    prisma.idempotency.deleteMany({ where: { userId } }),
    prisma.premiumInterviewSession.deleteMany({ where: { userId } }),
    prisma.simulationSession.deleteMany({ where: { userId } }),
    prisma.stripeEvent.updateMany({ where: { userId }, data: { userId: null } }),
    prisma.previewAnalysis.updateMany({ where: { claimedByUserId: userId }, data: { claimedByUserId: null } }),
    prisma.user.deleteMany({ where: { id: userId } }),
  ])
}
