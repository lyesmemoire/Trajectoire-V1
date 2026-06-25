import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
  
  beforeSend(event, hint) {
    // Filter out server-side errors that are not critical
    if (event.level === "info" || event.level === "debug") {
      return null;
    }

    // Add custom context for server errors
    if (event.request) {
      event.contexts = {
        ...event.contexts,
        server: {
          url: event.request.url,
          method: event.request.method,
        },
      };
    }

    return event;
  },

  beforeBreadcrumb(breadcrumb) {
    // Filter out sensitive breadcrumbs
    if (breadcrumb.category === "http") {
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
