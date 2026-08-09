/**
 * Génère un jeton de session éphémère pour les routes sensibles.
 */
export declare function signRoute(pathname: string, sessionId: string): string;
/**
 * Vérifie si une requête API provient d'un flux légitime et non d'un scraper direct.
 */
export declare function verifyRequestSignature(token: string, pathname: string, sessionId: string): boolean;
//# sourceMappingURL=request-signer.d.ts.map