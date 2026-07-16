"use client";

import { ReactNode, useEffect, Suspense } from "react";
import { envClient } from "@/lib/env.client";
import { usePathname, useSearchParams } from "next/navigation";

function PostHogPageTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Si posthog a terminé son lazy loading, on capture le changement de page
    if (typeof window !== "undefined" && (window as any).posthog) {
      (window as any).posthog.capture("$pageview", {
        $current_url: window.location.href,
      });
    }
  }, [pathname, searchParams]);

  return null;
}

export function PostHogProviderWrapper({ children }: { children: ReactNode }) {
  useEffect(() => {
    const key = envClient.NEXT_PUBLIC_POSTHOG_KEY;

    if (!key) {
      console.warn("PostHog disabled: missing NEXT_PUBLIC_POSTHOG_KEY");
      return;
    }

    // Dynamic import strict pour exclure complètement posthog-js du bundle initial
    import("posthog-js").then(({ default: posthog }) => {
      posthog.init(key, {
        api_host: envClient.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com",
        // Désactivé car géré manuellement par PostHogPageTracker pour le routing SPA
        capture_pageview: false,
        // Par défaut pour la privacy
        autocapture: false,
        disable_session_recording: true,
        loaded: (ph) => {
          if (process.env.NODE_ENV === "development") {
            ph.opt_out_capturing();
          }
          // Pageview initial après chargement
          ph.capture("$pageview", {
            $current_url: window.location.href,
          });
        }
      });
    }).catch(err => {
      console.error("Erreur au chargement de PostHog", err);
    });
  }, []);

  return (
    <>
      <Suspense fallback={null}>
        <PostHogPageTracker />
      </Suspense>
      {children}
    </>
  );
}
