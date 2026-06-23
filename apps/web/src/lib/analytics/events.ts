/**
 * Dictionnaire centralisé des événements analytics (PostHog).
 *
 * Pourquoi ce fichier existe :
 * 1. Éliminer les "magic strings" éparpillées dans le code
 * 2. Typer strictement les événements acceptés par `trackEvent`
 * 3. Permettre un refactor global (renommer un event = 1 seule ligne)
 * 4. Documenter la taxonomie analytics du produit
 *
 * Règle d'or : tout `trackEvent(...)` DOIT utiliser une constante de ce fichier.
 * Aucune string magique autorisée.
 */

// ============================================
// ÉVÉNEMENTS STATIQUES
// ============================================
export const ANALYTICS_EVENTS = {
  // ── Landing page (home) ──
  FAQ_OPENED: "faq_opened",
  FOOTER_CTA_CLICKED: "footer_cta_clicked",
  SOCIAL_CLICKED: "social_clicked",
  HERO_CTA_CLICKED: "hero_cta_clicked",
  PRICING_CTA_CLICKED: "pricing_cta_clicked",

  // ── Funnel d'inscription ──
  REGISTER_STARTED: "register_started",
  REGISTER_STEP_COMPLETED: "register_step_completed",
  REGISTER_COMPLETED: "register_completed",
  LOGIN_STARTED: "login_started",
  LOGIN_COMPLETED: "login_completed",

  // ── Pages authentifiées ──
  PROFILE_VIEWED: "profile_viewed",
  DASHBOARD_VIEWED: "dashboard_viewed",

  // ── PostHog natif ──
  POSTHOG_PAGEVIEW: "$pageview",
} as const;

// ============================================
// ÉVÉNEMENTS DYNAMIQUES (patterns)
// ============================================
// Le scroll tracking génère des events dérivés : landing_scroll_25, landing_scroll_50, etc.
// On autorise explicitement ce pattern via un template literal type.

/** Préfixe pour les événements de scroll. À concaténer avec un seuil numérique. */
export const ANALYTICS_EVENT_PREFIXES = {
  LANDING_SCROLL: "landing_scroll_",
} as const;

// ============================================
// TYPES UNIONS
// ============================================

/**
 * Nom d'événement analytics valide.
 * - Tous les events statiques du dictionnaire
 * - Tout event de la forme `landing_scroll_${number}` (scroll tracking)
 */
export type AnalyticsEventName =
  | typeof ANALYTICS_EVENTS[keyof typeof ANALYTICS_EVENTS]
  | `${typeof ANALYTICS_EVENT_PREFIXES.LANDING_SCROLL}${number}`;
