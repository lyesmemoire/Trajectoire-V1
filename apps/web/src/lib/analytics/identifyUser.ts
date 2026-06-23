import posthog from "posthog-js";

interface UserIdentifyPayload {
  id: string;
  email?: string;
  plan?: string;
  objective?: string;
  role?: string;
}

/**
 * Identifie un utilisateur dans PostHog pour lier son parcours anonyme
 * à ses actions après connexion ou inscription.
 */
export function identifyUser(payload: UserIdentifyPayload) {
  if (typeof window !== "undefined" && posthog.__loaded) {
    const { id, ...traits } = payload;
    posthog.identify(id, traits);
  }
}
