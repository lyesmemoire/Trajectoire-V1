import { getStrictUser } from "@/lib/auth/session-logic";
import { NextResponse } from "next/server";

/**
 * Guard centralisé pour sécuriser de manière stricte les routes `/api/admin`.
 * Doit être appelé en tout premier dans chaque route API d'administration.
 * @returns L'utilisateur authentifié si c'est un admin, sinon throw une Response 403.
 */
export async function requireAdmin() {
  const { user, isAdmin } = await getStrictUser();

  if (!user || !isAdmin) {
    throw new Error("FORBIDDEN_ADMIN_ACCESS");
  }

  return user;
}

/**
 * Helper optionnel pour envelopper les routes API d'administration
 * et attraper l'erreur `FORBIDDEN_ADMIN_ACCESS` pour renvoyer une 403.
 */
export function handleAdminError(error: unknown) {
  if (error instanceof Error && error.message === "FORBIDDEN_ADMIN_ACCESS") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  console.error("[Admin API Error]", error);
  return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
}

import { AuditService } from "@/lib/db/audit.service";

/**
 * Hook minimal d'audit trail pour consigner les actions destructrices ou sensibles.
 * @param adminId L'ID de l'admin qui effectue l'action
 * @param action L'action effectuée (ex: "ban_user", "restore_credits")
 * @param targetId L'ID de l'utilisateur ou entité cible de l'action
 * @param metadata Métadonnées optionnelles (ex: montant de crédits, raison)
 */
export async function logAdminAction(adminId: string, action: string, targetId: string, metadata?: Record<string, _unknown>) {
  try {
    await AuditService.createLog({
      adminId,
      action: `ADMIN_${action.toUpperCase()}`,
      ipAddress: "127.0.0.1",
      metadata: {
        target_id: targetId,
        ...metadata,
      },
    });
  } catch (error) {
    console.error("[Audit Log Failed]", error);
    // On ne bloque pas l'action si le log échoue dans cette version minimale,
    // mais on alerte fortement.
  }
}
