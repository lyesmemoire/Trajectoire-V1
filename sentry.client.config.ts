import * as Sentry from "@sentry/nextjs";
import { envClient } from "@/lib/env.client";

Sentry.init({
  dsn: envClient.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0, // Désactivé pour économiser le quota gratuit — activer à 0.1 plus tard
  environment: envClient.NEXT_PUBLIC_SENTRY_ENV || envClient.NODE_ENV,
  beforeSend(event) {
    // Ignorer les erreurs Redis/Timeout (déjà gérées par Circuit Breaker)
    const exType = event.exception?.values?.[0]?.type;
    if (exType === 'TimeoutError' || exType === 'RedisTimeoutError') {
      return null;
    }
    // Remove any CV‑related PII from the event payload
    if (event.request?.data) {
      delete event.request.data;
    }
    // Remove user info to avoid leaking personal data
    if (event.user) {
      delete event.user;
    }
    // Remove cookies that may contain sensitive info
    if (event.request?.cookies) {
      delete event.request.cookies;
    }
    return event;
  },
});
