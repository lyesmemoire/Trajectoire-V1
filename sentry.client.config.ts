import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0, // Désactivé pour économiser le quota gratuit — activer à 0.1 plus tard
  environment: process.env.NEXT_PUBLIC_SENTRY_ENV || process.env.NODE_ENV,
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
