// packages/arena-engine/lib/billing/build-subscription.ts

import type { Subscription } from "./subscription-types.js";

export function buildSubscriptionFromDB(params: {
  usageData:   { plan: string; subscription_status: string; current_period_end: string; has_used_free_trial?: boolean } | null;
  earlyAccess: { user_id: string } | null;
  credits:     number;
}): Subscription {
  const { usageData, earlyAccess, credits } = params;
  const hasUsedFreeTrial = usageData?.has_used_free_trial ?? false;

  if (earlyAccess) {
    return { plan: "PRO", credits, isActive: true, hasUsedFreeTrial: false,
             source: "early_access", periodEnd: null };
  }

  if (usageData?.subscription_status === "active" && usageData.current_period_end) {
    const isActive = new Date(usageData.current_period_end) > new Date();
    if (isActive) {
      const plan = normalizePlan(usageData.plan);
      return { plan, credits, isActive: true, hasUsedFreeTrial,
               source: "subscription",
               periodEnd: usageData.current_period_end };
    }
  }

  if (credits > 0) {
    return { plan: "FREE", credits, isActive: false, hasUsedFreeTrial,
             source: "credits_only", periodEnd: null };
  }

  return { plan: "FREE", credits: 0, isActive: false, hasUsedFreeTrial,
           source: "free", periodEnd: null };
}

function normalizePlan(raw: string): "FREE" | "PRO" | "EXPERT" {
  const u = raw?.toUpperCase() || "";
  if (u === "EXPERT" || u === "PREMIUM") return "EXPERT";
  if (u === "PRO")                       return "PRO";
  return "FREE";
}
