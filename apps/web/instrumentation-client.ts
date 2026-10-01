// apps/web/instrumentation-client.ts
import type * as SentryModule from "@sentry/nextjs";

// Le SDK Sentry (replay compris, ≈ 550 Ko avant compression) n'est plus chargé avant l'hydratation : il est
// importé à l'idle, après l'événement load, pour ne pas retarder le premier affichage (LCP). Les erreurs
// survenues avant ce chargement ne sont pas remontées.
let Sentry: typeof SentryModule | null = null;

function initSentry(S: typeof SentryModule) {
  S.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
  
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  
  integrations: [
    S.replayIntegration({
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
}

if (typeof window !== "undefined") {
  const load = () => {
    void import("@sentry/nextjs").then((S) => {
      Sentry = S;
      initSentry(S);
    });
  };
  const idle = () => {
    if ("requestIdleCallback" in window) window.requestIdleCallback(load, { timeout: 4000 });
    else setTimeout(load, 2000);
  };
  if (document.readyState === "complete") idle();
  else window.addEventListener("load", idle, { once: true });
}

// Hook de navigation Next 15 : sans effet tant que le SDK n'est pas chargé.
export const onRouterTransitionStart = (...args: Parameters<typeof SentryModule.captureRouterTransitionStart>) => {
  Sentry?.captureRouterTransitionStart(...args);
};
