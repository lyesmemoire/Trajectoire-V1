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
 * - `AdminAuditLog` est en `RESTRICT` : pour un administrateur qui a des entrées, la
 *   transaction échoue et la suppression est interrompue (journal d'audit à préserver).
 *
 * Idempotent : une ligne déjà absente n'est pas une erreur, on peut réessayer.
 * Une seule transaction : tout ou rien.
 */

import { prisma } from "@/lib/prisma"

export async function purgeUserData(userId: string): Promise<void> {
  await prisma.$transaction([
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
