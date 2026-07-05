import { sanitizeAnalyticsPayload } from "./privacy/analytics-filter";

export const EVENTS = {
  LANDING_VIEW: "landing_view",
  HERO_CTA_CLICK: "hero_cta_click",
  WAITLIST_SUBMIT: "waitlist_submit",
  REGISTER_COMPLETE: "register_complete",
  FIRST_CV_UPLOAD: "first_cv_upload",
  INTERVIEW_COMPLETE: "interview_complete",
  UPGRADE_CLICK: "upgrade_click",
};

/**
 * Enhanced track function with mandatory privacy scrubbing.
 */
export function track(event: string, properties?: any) {
  if (typeof window === "undefined") return;

  // Apply mandatory GDPR filter
  const cleanProperties = sanitizeAnalyticsPayload(properties || {});

  const enrichedProps = {
    ...cleanProperties,
    timestamp: new Date().toISOString(),
  };

  // Client-side file - console.log is appropriate for browser debugging
  console.log(`[Privacy-Safe Analytics] ${event}`, enrichedProps);

  if ((window as any).posthog) {
    (window as any).posthog.capture(event, enrichedProps);
  }
}
