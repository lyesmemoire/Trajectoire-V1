/**
 * Guard centralisé pour sécuriser de manière stricte les routes `/api/admin`.
 * Doit être appelé en tout premier dans chaque route API d'administration.
 * @returns L'utilisateur authentifié si c'est un admin, sinon throw une Response 403.
 */
export declare function requireAdmin(): Promise<any>;
/**
 * Helper optionnel pour envelopper les routes API d'administration
 * et attraper l'erreur `FORBIDDEN_ADMIN_ACCESS` pour renvoyer une 403.
 */
export declare function handleAdminError(error: unknown): any;
/**
 * Hook minimal d'audit trail pour consigner les actions destructrices ou sensibles.
 * @param adminId L'ID de l'admin qui effectue l'action
 * @param action L'action effectuée (ex: "ban_user", "restore_credits")
 * @param targetId L'ID de l'utilisateur ou entité cible de l'action
 * @param metadata Métadonnées optionnelles (ex: montant de crédits, raison)
 */
export declare function logAdminAction(adminId: string, action: string, targetId: string, metadata?: Record<string, _unknown>): Promise<void>;
//# sourceMappingURL=security.d.ts.map