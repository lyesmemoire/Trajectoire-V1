// lib/posthog.ts
// Configuration centralisée PostHog
import posthog from "posthog-js";

export const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY ?? "";
export const POSTHOG_HOST =
  process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://eu.posthog.com";

// Événements trackés — liste exhaustive et intentionnellement limitée
// Règle : ne tracker QUE les événements business critiques
export const ANALYTICS_EVENTS = {
  // Acquisition
  SIGNUP_STARTED: "signup_started",
  SIGNUP_COMPLETED: "signup_completed",

  // Activation
  CV_UPLOADED: "cv_uploaded",
  ATS_SCORE_VIEWED: "ats_score_viewed",

  // Engagement (actions payantes)
  OPTIMIZE_CLICKED: "optimize_clicked",
  OPTIMIZE_COMPLETED: "optimize_completed",
  INTERVIEW_STARTED: "interview_started",
  INTERVIEW_COMPLETED: "interview_completed",
  COMMITTEE_DECISION_GENERATED: "committee_decision_generated",
  CAREER_TRAJECTORY_UPDATED: "career_trajectory_updated",
  COMMITTEE_CTA_CLICKED: "committee_cta_clicked",

  // Revenus
  CHECKOUT_INITIATED: "checkout_initiated",
  PURCHASE_COMPLETED: "purchase_completed",
} as const;

export type AnalyticsEvent =
  (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];

/**
 * Wrapper typé autour de posthog.capture
 * Utilisé uniquement côté client ('use client')
 */
export function trackEvent(event: AnalyticsEvent, properties?: Record<string, string | number | boolean>, ) {
  if (typeof window === "undefined") return;
  if (!POSTHOG_KEY) return;

  posthog.capture(event, properties);
}

/**
 * Identifie l'utilisateur après connexion
 */
export function identifyUser(userId: string, traits?: Record<string, string | number>, ) {
  if (typeof window === "undefined") return;
  if (!POSTHOG_KEY) return;

  posthog.identify(userId, traits);
}

/**
 * Réinitialise l'identité à la déconnexion
 */
export function resetUser() {
  if (typeof window === "undefined") return;
  if (!POSTHOG_KEY) return;

  posthog.reset();
}
