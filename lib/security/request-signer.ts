import { createHmac } from "crypto";
import { envServer } from "@/lib/env.server";

/**
 * Génère un jeton de session éphémère pour les routes sensibles.
 */
export function signRoute(pathname: string, sessionId: string): string {
  const secret = envServer.ROUTE_SIGNING_SECRET || "fallback-secret";
  const timestamp = Math.floor(Date.now() / 1000 / 600); // 10 min window

  return createHmac("sha256", secret)
    .update(`${pathname}:${sessionId}:${timestamp}`)
    .digest("hex")
    .slice(0, 16);
}

/**
 * Vérifie si une requête API provient d'un flux légitime et non d'un scraper direct.
 */
export function verifyRequestSignature(
  token: string,
  pathname: string,
  sessionId: string,
): boolean {
  const expected = signRoute(pathname, sessionId);
  return token === expected;
}
