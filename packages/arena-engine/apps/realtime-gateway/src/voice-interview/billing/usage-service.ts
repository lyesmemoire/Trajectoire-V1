import { createClient } from "@supabase/supabase-js";
import { buildSubscriptionFromDB } from "../../../../../lib/billing/build-subscription.js";
import { hasPremiumAccess } from "../../../../../lib/billing/subscription-types.js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

const PLAN_LIMITS: Record<string, number> = {
  FREE: 3,
  PRO: 20,
  EXPERT: Infinity,
};

function getMonthKey(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

async function getSubscription(userId: string) {
  const { data: usageData } = await supabase
    .from("user_usage")
    .select("plan, subscription_status, current_period_end")
    .eq("user_id", userId)
    .maybeSingle();

  const { data: earlyAccess } = await supabase
    .from("early_access_tracking")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle();

  const { data: profileData } = await supabase
    .from("profiles")
    .select("credits")
    .eq("id", userId)
    .maybeSingle();

  return buildSubscriptionFromDB({
    usageData: usageData as any,
    earlyAccess: earlyAccess as any,
    credits: profileData?.credits ?? 0,
  });
}

export async function getUserPlan(userId: string): Promise<string> {
  const sub = await getSubscription(userId);
  return sub.plan;
}

export async function checkAndConsumeInterview(userId: string): Promise<boolean> {
  const subscription = await getSubscription(userId);
  
  const limit = PLAN_LIMITS[subscription.plan] ?? PLAN_LIMITS.FREE;
  const monthKey = getMonthKey();

  if (subscription.isActive) {
    const { data: usage } = await supabase
      .from("user_usage")
      .select("interviews_this_month, month_key")
      .eq("user_id", userId)
      .maybeSingle();

    const currentMonth = usage?.month_key === monthKey
      ? (usage?.interviews_this_month ?? 0)
      : 0;

    if (currentMonth >= limit) return false;

    await supabase
      .from("user_usage")
      .upsert({
        user_id: userId,
        interviews_this_month: currentMonth + 1,
        month_key: monthKey,
      }, { onConflict: "user_id" });

    return true;
  }

  // Si pas d'abonnement actif mais a des crédits
  if (subscription.credits > 0) {
    return true;
  }

  return false;
}
