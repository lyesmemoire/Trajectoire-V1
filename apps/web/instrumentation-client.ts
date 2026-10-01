// apps/web/instrumentation-client.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
  
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  

  // Le tracing de performance du navigateur est ajouté plus tard, à l'idle (voir plus bas), comme Replay.
  integrations: (defaults) => defaults.filter((integration) => integration.name !== "BrowserTracing"),

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

// Le cœur de Sentry (capture des erreurs, y compris d'hydratation) est chargé tout de suite. Seuls le tracing de performance
// du navigateur et l'intégration Replay, les parties les plus lourdes, sont ajoutés plus tard, à l'idle après le chargement de la page.
if (typeof window !== "undefined") {
  const addReplay = () => {
    void import("@sentry/nextjs").then((S) => {
      S.addIntegration(S.browserTracingIntegration());
      S.addIntegration(S.replayIntegration({ maskAllText: true, blockAllMedia: true }));
    });
  };
  const idle = () => {
    if ("requestIdleCallback" in window) window.requestIdleCallback(addReplay, { timeout: 4000 });
    else setTimeout(addReplay, 2000);
  };
  if (document.readyState === "complete") idle();
  else window.addEventListener("load", idle, { once: true });
}

// Required hooks for Next.js 15 + Sentry
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
export const onRequestError = Sentry.captureRequestError;
