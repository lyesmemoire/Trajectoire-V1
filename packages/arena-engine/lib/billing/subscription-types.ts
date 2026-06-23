// packages/arena-engine/lib/billing/subscription-types.ts

export type SubscriptionPlan   = "FREE" | "PRO" | "EXPERT";
export type SubscriptionSource = "early_access" | "subscription" | "credits_only" | "free";

export interface Subscription {
  plan:      SubscriptionPlan;
  credits:   number;
  isActive:  boolean;
  hasUsedFreeTrial: boolean;
  source:    SubscriptionSource;
  periodEnd: string | null;
}

export function hasPremiumAccess(sub: Subscription): boolean {
  return sub.isActive && (sub.plan === "PRO" || sub.plan === "EXPERT");
}
