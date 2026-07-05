import * as Sentry from "@sentry/nextjs";
import { envServer } from "@/lib/env.server";

Sentry.init({
  dsn: envServer.SENTRY_DSN,

  tracesSampleRate: 0, // Désactivé pour économiser le quota gratuit — activer à 0.1 plus tard

  environment: envServer.NODE_ENV,

  beforeSend(event) {
    // Ignorer les erreurs Redis/Timeout (déjà gérées par Circuit Breaker)
    const exType = event.exception?.values?.[0]?.type;
    if (exType === 'TimeoutError' || exType === 'RedisTimeoutError') {
      return null;
    }
    // Remove sensitive CV data from events
    if (event.request?.data) {
      delete event.request.data;
    }
    return event;
  },
});
