import { createHmac } from "crypto";
/**
 * Génère un jeton de session éphémère pour les routes sensibles.
 */
export function signRoute(pathname, sessionId) {
    const secret = process.env.ROUTE_SIGNING_SECRET || "fallback-secret";
    const timestamp = Math.floor(Date.now() / 1000 / 600); // 10 min window
    return createHmac("sha256", secret)
        .update(`${pathname}:${sessionId}:${timestamp}`)
        .digest("hex")
        .slice(0, 16);
}
/**
 * Vérifie si une requête API provient d'un flux légitime et non d'un scraper direct.
 */
export function verifyRequestSignature(token, pathname, sessionId) {
    const expected = signRoute(pathname, sessionId);
    return token === expected;
}
//# sourceMappingURL=request-signer.js.map