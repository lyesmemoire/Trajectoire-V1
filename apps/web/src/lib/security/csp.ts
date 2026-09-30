// lib/security/csp.ts
//
// Content-Security-Policy de production (appliquée par le middleware, désactivée en dev).
// Fonction pure : testable sans navigateur.

/**
 * - script-src : nonce + 'strict-dynamic'. Avec 'strict-dynamic', les navigateurs modernes ignorent
 *   les listes d'hôtes : les scripts chargés dynamiquement (PostHog…) sont autorisés parce qu'ils
 *   sont lancés par un script portant le nonce. Inutile d'y ajouter PostHog.
 * - style-src : balises <style> et feuilles par nonce uniquement.
 * - style-src-attr : attributs `style="…"` autorisés. Le HTML rendu côté serveur contient des
 *   `style` dynamiques (largeurs de barres de score…) que 'nonce' ne peut pas couvrir : sans cette
 *   directive le navigateur les bloque (barres à largeur nulle). Un attribut style n'exécute pas de
 *   code ; les <style> et le JavaScript restent protégés.
 * - connect-src : Supabase, OpenAI (SDP Realtime), Sentry et PostHog (ingestion de l'UE ou des US).
 */
export function buildContentSecurityPolicy(scriptNonce: string, styleNonce: string): string {
  return [
    "default-src 'self';",
    `script-src 'self' 'nonce-${scriptNonce}' 'strict-dynamic' https://cdn.jsdelivr.net;`,
    `style-src 'self' 'nonce-${styleNonce}' https://cdn.jsdelivr.net;`,
    "style-src-attr 'unsafe-inline';",
    "img-src 'self' data: https:;",
    "font-src 'self' https://cdn.jsdelivr.net;",
    "connect-src 'self' https://*.supabase.co https://api.openai.com https://*.sentry.io https://*.posthog.com;",
    "frame-ancestors 'none';",
    "object-src 'none';",
    "upgrade-insecure-requests;",
  ].join(" ");
}
