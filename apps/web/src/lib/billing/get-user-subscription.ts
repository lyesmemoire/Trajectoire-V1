// apps/web/src/lib/billing/get-user-subscription.ts
// Le fichier existe — on le remplace par une version robuste

import { createClient }   from "@/lib/supabase/server";
import { createClient as createBrowserClient } from "@/lib/supabase/client";
import { z }              from "zod";

// ── Schéma de sortie ──────────────────────────────────────────────────────────
export const SubscriptionSchema = z.object({
  plan:     z.enum(["FREE", "PRO", "EXPERT"]),
  credits:  z.number().int().min(0),
  isActive: z.boolean(),
  hasUsedFreeTrial: z.boolean().default(false),
  // Contexte additionnel pour l'UI
  source:   z.enum(["early_access", "subscription", "credits_only", "free"]),
  periodEnd: z.string().datetime().nullable(),
});

export type Subscription = z.infer<typeof SubscriptionSchema>;

// ── Fonction principale (server-side) ─────────────────────────────────────────
export async function getUserSubscription(
  userId?: string
): Promise<Subscription> {
  const supabase = await createClient();

  // Résoudre userId si non fourni
  let resolvedUserId = userId;
  if (!resolvedUserId) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return defaultFreeSubscription();
    resolvedUserId = user.id;
  }

  // 1. Early access → PRO immédiat
  const { data: earlyAccess } = await (supabase as any)
    .from("early_access_tracking")
    .select("user_id")
    .eq("user_id", resolvedUserId)
    .maybeSingle();

  const credits = await fetchCredits(supabase, resolvedUserId);

  if (earlyAccess) {
    return SubscriptionSchema.parse({
      plan:      "PRO",
      credits,
      isActive:  true,
      hasUsedFreeTrial: false, // Pas pertinent pour Early Access qui est PRO
      source:    "early_access",
      periodEnd: null,
    });
  }

  // 2. Abonnement Stripe → via user_usage
  const { data: usage } = await (supabase as any)
    .from("user_usage")
    .select("plan, subscription_status, current_period_end, has_used_free_trial")
    .eq("user_id", resolvedUserId)
    .maybeSingle();

  const hasUsedFreeTrial = usage?.has_used_free_trial ?? false;

  if (usage?.subscription_status === "active" && usage.current_period_end) {
    const periodEnd = new Date(usage.current_period_end);
    const isActive  = periodEnd > new Date();

    if (isActive) {
      const plan = normalizePlan(usage.plan);
      return SubscriptionSchema.parse({
        plan,
        credits,
        isActive: true,
        hasUsedFreeTrial,
        source:   "subscription",
        periodEnd: usage.current_period_end,
      });
    }
  }

  // 3. Crédits uniquement → pas d'abonnement actif mais des crédits
  if (credits > 0) {
    return SubscriptionSchema.parse({
      plan:      "FREE",
      credits,
      isActive:  false,
      hasUsedFreeTrial,
      source:    "credits_only",
      periodEnd: null,
    });
  }

  // 4. Free par défaut
  return defaultFreeSubscription(hasUsedFreeTrial);
}

// ── hasPremiumAccess — helper pour les gates ──────────────────────────────────
export function hasPremiumAccess(sub: Subscription): boolean {
  return sub.isActive && (sub.plan === "PRO" || sub.plan === "EXPERT");
}

// ── Helpers privés ────────────────────────────────────────────────────────────
async function fetchCredits(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId:   string
): Promise<number> {
  const { data } = await (supabase as any)
    .from("profiles")
    .select("credits")
    .eq("id", userId)
    .maybeSingle();
  return data?.credits ?? 0;
}

function normalizePlan(raw: string | null): "FREE" | "PRO" | "EXPERT" {
  const upper = (raw ?? "").toUpperCase();
  if (upper === "EXPERT" || upper === "PREMIUM") return "EXPERT";
  if (upper === "PRO")                           return "PRO";
  return "FREE";
}

function defaultFreeSubscription(hasUsedFreeTrial: boolean = false): Subscription {
  return {
    plan:      "FREE",
    credits:   0,
    isActive:  false,
    hasUsedFreeTrial,
    source:    "free",
    periodEnd: null,
  };
}
