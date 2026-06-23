
const GatewayEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL:  z.string().url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
});
const gatewayEnv = GatewayEnvSchema.parse(process.env);
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  gatewayEnv.SUPABASE_SERVICE_ROLE_KEY,
);

const PLAN_LIMITS: Record<string, number> = {
  free: 3,
  pro: 20,
  premium: Infinity,
};

function getMonthKey(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export async function getUserPlan(userId: string): Promise<string> {
  const { data } = await supabase
    .from("user_usage")
    .select("plan, subscription_status, current_period_end")
    .eq("user_id", userId)
    .single();

  if (!data) return "free";

  if (data.plan !== "free") {
    const isActive = data.subscription_status === "active";
    const isNotExpired = !data.current_period_end || new Date(data.current_period_end) > new Date();
    if (!isActive || !isNotExpired) {
      return "free";
    }
  }

  return data.plan;
}

export async function checkAndConsumeInterview(userId: string): Promise<boolean> {
  const monthKey = getMonthKey();

  const { data } = await supabase
    .from("user_usage")
    .select("*")
    .eq("user_id", userId)
    .single();

  let record = data;

  if (!record) {
    await supabase.from("user_usage").insert({
      user_id: userId,
      plan: "free",
      interviews_this_month: 0,
      month_key: monthKey,
    });

    record = {
      user_id: userId,
      plan: "free",
      interviews_this_month: 0,
      month_key: monthKey,
    };
  }

  // Reset monthly if needed
  if (record.month_key !== monthKey) {
    await supabase
      .from("user_usage")
      .update({
        interviews_this_month: 0,
        month_key: monthKey,
      })
      .eq("user_id", userId);

    record.interviews_this_month = 0;
    record.month_key = monthKey;
  }

  let actualPlan = record.plan;
  if (actualPlan !== "free") {
    const isActive = record.subscription_status === "active";
    const isNotExpired = !record.current_period_end || new Date(record.current_period_end) > new Date();
    if (!isActive || !isNotExpired) {
      actualPlan = "free";
    }
  }

  const limit = PLAN_LIMITS[actualPlan] ?? 3;

  if (record.interviews_this_month >= limit) {
    return false;
  }

  await supabase
    .from("user_usage")
    .update({
      interviews_this_month: record.interviews_this_month + 1,
    })
    .eq("user_id", userId);

  return true;
}
