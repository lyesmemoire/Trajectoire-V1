"use client";

import { useReportWebVitals } from "next/web-vitals";

interface PostHogClient {
  capture: (event: string, properties?: Record<string, unknown>) => void;
}

interface WindowWithPostHog extends Window {
  posthog?: PostHogClient;
}

/**
 * Composant invisible qui envoie les Web Vitals à PostHog et Sentry.
 * Montez-le une seule fois dans le layout racine.
 *
 * Métriques capturées :
 * - TTFB  (Time to First Byte)
 * - FCP   (First Contentful Paint)
 * - LCP   (Largest Contentful Paint)
 * - FID   (First Input Delay)
 * - CLS   (Cumulative Layout Shift)
 * - INP   (Interaction to Next Paint)
 */
export function WebVitals() {
  useReportWebVitals((metric) => {
    // ─── PostHog ──────────────────────────────────────────
    if (typeof window !== "undefined") {
      const win = window as WindowWithPostHog;
      if (win.posthog) {
        win.posthog.capture("web_vital", {
          name: metric.name,
          value: metric.value,
          rating: metric.rating,       // "good" | "needs-improvement" | "poor"
          navigationType: metric.navigationType,
        });
      }
    }

    // ─── Console (dev only) ──────────────────────────────
    if (process.env.NODE_ENV === "development") {
      const color =
        metric.rating === "good"
          ? "color: #22c55e"
          : metric.rating === "needs-improvement"
          ? "color: #eab308"
          : "color: #ef4444";
      console.log(`%c[Web Vital] ${metric.name}: ${metric.value.toFixed(1)}`, color);
    }
  });

  return null;
}
