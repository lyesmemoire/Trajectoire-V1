"use client";

import { useEffect, useRef } from "react";
import { trackEvent } from "@/lib/analytics/trackEvent";
import { ANALYTICS_EVENT_PREFIXES } from "@/lib/analytics/events";

export function useScrollTracking() {
  const tracked = useRef({
    25: false,
    50: false,
    75: false,
    100: false,
  });

  useEffect(() => {
    // Ne pas exécuter si posthog n'est pas initialisé ou s'il n'y a pas de clé
    if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return;

    const handleScroll = () => {
      // Hauteur totale de la page (scrollHeight) moins la hauteur de la fenêtre (clientHeight)
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (scrollHeight <= 0) return;

      const scrollPosition = window.scrollY;
      const scrollPercentage = (scrollPosition / scrollHeight) * 100;

      const thresholds = [25, 50, 75, 100] as const;

      thresholds.forEach((threshold) => {
        if (scrollPercentage >= threshold && !tracked.current[threshold]) {
          tracked.current[threshold] = true;
          trackEvent(`${ANALYTICS_EVENT_PREFIXES.LANDING_SCROLL}${threshold}` as any);
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    
    // Vérification initiale au cas où la page est déjà scrollée
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
}
