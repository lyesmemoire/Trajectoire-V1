// @ts-nocheck
"use client";

import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import posthog from "posthog-js";
import { POSTHOG_KEY, POSTHOG_HOST } from "@/lib/posthog";

// Composant interne séparé pour useSearchParams (requiert Suspense)
function PostHogPageTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!POSTHOG_KEY) return;
    // Capture automatique des changements de page (SPA routing)
    posthog.capture("$pageview", {
      $current_url: window.location.href,
    });
  }, [pathname, searchParams]);

  return null;
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (!POSTHOG_KEY) return;

    posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      // Ne pas capturer les données personnelles automatiquement
      autocapture: false,
      // Respecter le Do Not Track du navigateur
      respect_dnt: true,
      // Désactiver la capture de session par défaut (RGPD)
      disable_session_recording: true,
      // Charger en différé pour ne pas bloquer le rendu
      loaded: (ph) => {
        if (process.env.NODE_ENV === "development") {
          ph.opt_out_capturing();
        }
      },
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
