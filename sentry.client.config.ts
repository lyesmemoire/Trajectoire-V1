import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 0.2,
  environment: process.env.NEXT_PUBLIC_SENTRY_ENV || process.env.NODE_ENV,
  beforeSend(event) {
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
