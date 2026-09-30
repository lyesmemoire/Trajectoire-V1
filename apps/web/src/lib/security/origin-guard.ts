// lib/security/origin-guard.ts
//
// Contrôle d'`Origin` global sur les requêtes d'écriture de l'API (défense en profondeur
// contre le CSRF, en plus de SameSite). Fonction pure : le middleware fournit les en-têtes.
//
// Règle : on ne refuse que si le navigateur a signalé une origine qui n'est pas la nôtre.
// Un `Origin` absent est accepté (appels serveur à serveur, ex. simulation/end → report/generate,
// webhooks) ; sauf si `Sec-Fetch-Site: cross-site` révèle une requête inter-sites.

import { validateOrigin } from "./csrf";

const WRITE_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

/** Routes appelées par des services externes (signature propre, pas de navigateur). */
const EXEMPT_PATHS = new Set(["/api/stripe/webhook"]);

export type OriginCheck = { allowed: true } | { allowed: false; reason: string };

export function checkRequestOrigin(input: {
  method: string;
  pathname: string;
  origin: string | null;
  /** `x-forwarded-host` si présent, sinon `host`. */
  host: string | null;
  secFetchSite: string | null;
  allowedOrigins: string[];
}): OriginCheck {
  const { method, pathname, origin, host, secFetchSite, allowedOrigins } = input;

  if (!WRITE_METHODS.has(method.toUpperCase())) return { allowed: true };
  if (!(pathname === "/api" || pathname.startsWith("/api/"))) return { allowed: true };
  if (EXEMPT_PATHS.has(pathname)) return { allowed: true };

  if (!origin) {
    return secFetchSite === "cross-site"
      ? { allowed: false, reason: "cross_site_without_origin" }
      : { allowed: true };
  }

  if (validateOrigin(origin, allowedOrigins)) return { allowed: true };

  // Même hôte que la requête : le site lui-même, même si NEXT_PUBLIC_APP_URL est absent
  // ou diffère (www / apex, port).
  try {
    if (host && new URL(origin).host.toLowerCase() === host.toLowerCase()) {
      return { allowed: true };
    }
  } catch {
    /* origine illisible ("null"…) : refusée ci-dessous */
  }

  return { allowed: false, reason: "origin_not_allowed" };
}
