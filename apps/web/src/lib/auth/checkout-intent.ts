import { parsePaidPlan, type PaidPlan } from "@/lib/billing/checkout-plan"

/**
 * Conservation du plan choisi sur /pricing par un visiteur non connecté.
 *
 * `/pricing` pose un témoin court (`checkout_intent`) avant d'envoyer vers l'inscription ; une fois connecté
 * (inscription avec session immédiate, confirmation d'e-mail dans un autre onglet, détour OAuth ou connexion par
 * mot de passe), l'utilisateur est ramené sur `/pricing?resume=<plan>`, où un récapitulatif lui laisse confirmer
 * le paiement lui-même (Stripe n'est jamais lancé automatiquement).
 *
 * Le témoin n'est qu'un indice de navigation, posé côté client donc non fiable : il passe par la liste blanche
 * `parsePaidPlan`, la destination est construite ici (jamais copiée d'une valeur du client), et
 * `POST /api/stripe/checkout` revérifie l'utilisateur et le plan.
 */

export const CHECKOUT_INTENT_COOKIE = "checkout_intent"
export const CHECKOUT_INTENT_MAX_AGE_SECONDS = 60 * 60

/** Destination par défaut après connexion, la seule que l'intention de paiement remplace. */
export const DEFAULT_POST_AUTH_PATH = "/dashboard"

export function resumeDestination(plan: PaidPlan): string {
  return `/pricing?resume=${plan}`
}

/**
 * Destination après authentification. L'intention de paiement ne remplace que la destination par défaut :
 * un `next` explicite (réinitialisation de mot de passe, page demandée avant la connexion) reste prioritaire.
 */
export function resolvePostAuthDestination(next: string, cookieValue: string | undefined | null): string {
  if (next !== DEFAULT_POST_AUTH_PATH) return next
  const plan = parsePaidPlan(cookieValue)
  return plan ? resumeDestination(plan) : next
}

// ─── Côté navigateur ───────────────────────────────────────────────────────────

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null
  for (const part of document.cookie.split(";")) {
    const [key, ...rest] = part.trim().split("=")
    if (key === name) return decodeURIComponent(rest.join("="))
  }
  return null
}

function writeCookie(name: string, value: string, maxAgeSeconds: number): void {
  if (typeof document === "undefined") return
  const secure = typeof window !== "undefined" && window.location.protocol === "https:" ? "; Secure" : ""
  document.cookie = `${name}=${encodeURIComponent(value)}; Max-Age=${maxAgeSeconds}; Path=/; SameSite=Lax${secure}`
}

export function setCheckoutIntent(plan: PaidPlan): void {
  writeCookie(CHECKOUT_INTENT_COOKIE, plan, CHECKOUT_INTENT_MAX_AGE_SECONDS)
}

/** Lit l'intention et la supprime (à usage unique). Valeur absente ou invalide : null. */
export function takeCheckoutIntent(): PaidPlan | null {
  const plan = parsePaidPlan(readCookie(CHECKOUT_INTENT_COOKIE))
  if (readCookie(CHECKOUT_INTENT_COOKIE) !== null) writeCookie(CHECKOUT_INTENT_COOKIE, "", 0)
  return plan
}

/** Destination d'un utilisateur qui vient de s'authentifier côté client (sans passer par le callback serveur). */
export function postAuthPathFromIntent(fallback: string = DEFAULT_POST_AUTH_PATH): string {
  // Destination explicite : on n'y touche pas et on laisse l'intention en place (elle expire seule).
  if (fallback !== DEFAULT_POST_AUTH_PATH) return fallback
  const plan = takeCheckoutIntent()
  return plan ? resumeDestination(plan) : fallback
}
