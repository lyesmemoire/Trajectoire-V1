/**
 * Source de vérité absolue pour l'identité utilisateur côté serveur.
 * Ignore la session locale et valide directement avec Supabase Auth.
 */
export declare function getStrictUser(): Promise<{
    user: null;
    profile: null;
    error: string;
    isAdmin?: undefined;
    isPro?: undefined;
} | {
    user: any;
    profile: any;
    isAdmin: boolean;
    isPro: boolean;
    error?: undefined;
}>;
/**
 * Valide l'accès à un Replay spécifique.
 * Anti-énumération et validation d'ownership stricte.
 */
export declare function validateReplayAccess(sessionId: _string): Promise<boolean>;
//# sourceMappingURL=session-logic.d.ts.map