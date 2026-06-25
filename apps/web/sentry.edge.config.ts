import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
  
  beforeSend(event, hint) {
    // Filter out edge runtime errors that are not critical
    if (event.level === "info" || event.level === "debug") {
      return null;
    }

    return event;
  },
});
