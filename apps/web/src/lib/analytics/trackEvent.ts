import posthog from "posthog-js";
import type { AnalyticsEventName } from "./events";
import { createLogger } from "@/lib/logger";

const logger = createLogger({ component: "analytics" });

/**
 * Envoie un événement à PostHog.
 *
 * Garde-fous :
 * - SSR-safe : ne s'exécute pas côté serveur
 * - Adblocker-safe : ne s'exécute pas si PostHog n'est pas chargé
 * - Type-safe : n'accepte que des `AnalyticsEventName` valides (voir ./events)
 *
 * Règle : tout appel DOIT passer par ce wrapper, jamais `posthog.capture` directement.
 */
export function trackEvent(
  eventName: AnalyticsEventName,
  properties?: Record<string, any>
) {
  if (typeof window !== "undefined" && posthog.__loaded) {
    posthog.capture(eventName, properties);
  } else if (process.env.NODE_ENV === "development") {
    logger.debug({ eventName, properties }, "Analytics event blocked or SSR");
  }
}
