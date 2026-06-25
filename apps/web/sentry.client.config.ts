import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
  
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  
  integrations: [
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],

  beforeSend(event, hint) {
    // Filter out client-side errors that are not critical
    if (event.level === "info" || event.level === "debug") {
      return null;
    }

    // Add custom context
    if (event.request) {
      event.contexts = {
        ...event.contexts,
        request: {
          url: event.request.url,
          method: event.request.method,
        },
      };
    }

    return event;
  },

  beforeBreadcrumb(breadcrumb) {
    // Filter out sensitive breadcrumbs
    if (breadcrumb.category === "xhr" || breadcrumb.category === "fetch") {
      if (breadcrumb.data?.url?.includes("/api/")) {
        breadcrumb.data = {
          ...breadcrumb.data,
          url: breadcrumb.data.url.replace(/\/api\/[^\s]+/, "/api/[REDACTED]"),
        };
      }
    }
    return breadcrumb;
  },
});
