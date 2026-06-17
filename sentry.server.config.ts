import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,

  tracesSampleRate: 0.2,

  environment: process.env.NODE_ENV,

  beforeSend(event) {
    // Remove sensitive CV data from events
    if (event.request?.data) {
      delete event.request.data;
    }
    return event;
  },
});
