export declare const POSTHOG_KEY: string;
export declare const POSTHOG_HOST: string;
export declare const ANALYTICS_EVENTS: {
    readonly SIGNUP_STARTED: "signup_started";
    readonly SIGNUP_COMPLETED: "signup_completed";
    readonly CV_UPLOADED: "cv_uploaded";
    readonly ATS_SCORE_VIEWED: "ats_score_viewed";
    readonly OPTIMIZE_CLICKED: "optimize_clicked";
    readonly OPTIMIZE_COMPLETED: "optimize_completed";
    readonly INTERVIEW_STARTED: "interview_started";
    readonly INTERVIEW_COMPLETED: "interview_completed";
    readonly COMMITTEE_DECISION_GENERATED: "committee_decision_generated";
    readonly CAREER_TRAJECTORY_UPDATED: "career_trajectory_updated";
    readonly COMMITTEE_CTA_CLICKED: "committee_cta_clicked";
    readonly CHECKOUT_INITIATED: "checkout_initiated";
    readonly PURCHASE_COMPLETED: "purchase_completed";
};
export type AnalyticsEvent = (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];
/**
 * Wrapper typé autour de posthog.capture
 * Utilisé uniquement côté client ('use client')
 */
export declare function trackEvent(event: _AnalyticsEvent, properties?: Record<string, string | number | boolean>): void;
/**
 * Identifie l'utilisateur après connexion
 */
export declare function identifyUser(userId: string, traits?: Record<string, _string | number>): void;
/**
 * Réinitialise l'identité à la déconnexion
 */
export declare function resetUser(): void;
//# sourceMappingURL=posthog.d.ts.map