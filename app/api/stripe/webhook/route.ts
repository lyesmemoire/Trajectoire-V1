// app/api/stripe/webhook/route.ts
// Ajouter les événements manquants + mise à jour user_usage

import { NextRequest, NextResponse } from "next/server";
import { stripe }                    from "@/lib/stripe";
import { createAdminClient }         from "@/lib/supabase/service";
import { envServer }                 from "@/lib/env.server";
import Stripe                        from "stripe";
import { z }                         from "zod";

// Validation du payload Stripe avant traitement
const StripeMetadataSchema = z.object({
  user_id:        z.string().uuid(),
  resolved_price: z.string().optional(),
  credits:        z.string().optional().transform(Number),
  pack_name:      z.string().optional(),
});

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig  = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Signature manquante." }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      envServer.STRIPE_WEBHOOK_SECRET
    );
  } catch {
    return NextResponse.json({ error: "Signature invalide." }, { status: 400 });
  }

  const supabase = createAdminClient();

  switch (event.type) {

    // ── Paiement one-shot ou démarrage abonnement ──────────────────────
    case "checkout.session.completed": {
      const session  = event.data.object as Stripe.Checkout.Session;
      const metadata = StripeMetadataSchema.safeParse(session.metadata);
      if (!metadata.success) break;

      const { user_id, resolved_price, credits, pack_name } = metadata.data;

      // Early access
      if (resolved_price === envServer.STRIPE_PRICE_EARLY) {
        await supabase.from("early_access_tracking").upsert({
          user_id,
          stripe_session_id: session.id,
          activated_at:      new Date().toISOString(),
        });
      }

      // Crédits one-shot (comportement existant préservé)
      if (credits && credits > 0) {
        await supabase.rpc("process_stripe_payment", {
          p_event_id:    event.id,
          p_user_id:     user_id,
          p_credits:     credits,
          p_amount_cents: session.amount_total ?? 0,
          p_pack_name:   pack_name ?? "unknown",
        });
      }

      // Abonnement → mettre à jour user_usage
      if (session.mode === "subscription" && session.subscription) {
        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        );
        await upsertUserUsage(supabase, user_id, subscription);
      }
      break;
    }

    // ── Mise à jour d'abonnement ───────────────────────────────────────
    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      const user_id      = subscription.metadata?.user_id;
      if (!user_id) {
        console.error("[Webhook] subscription.updated sans user_id dans metadata");
        break;
      }
      await upsertUserUsage(supabase, user_id, subscription);
      break;
    }

    // ── Fin d'abonnement ───────────────────────────────────────────────
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const user_id      = subscription.metadata?.user_id;
      if (!user_id) break;

      await supabase
        .from("user_usage")
        .update({
          plan:                "free",
          subscription_status: "canceled",
          current_period_end:  null,
          stripe_subscription_id: null,
        })
        .eq("user_id", user_id);
      break;
    }

    // ── Paiement échoué ────────────────────────────────────────────────
    case "invoice.payment_failed": {
      const invoice  = event.data.object as Stripe.Invoice;
      const customer = invoice.customer as string;

      // Retrouver user_id depuis stripe_customer_id
      const { data: usage } = await supabase
        .from("user_usage")
        .select("user_id")
        .eq("stripe_customer_id", customer)
        .single();

      if (usage?.user_id) {
        await supabase
          .from("user_usage")
          .update({ subscription_status: "past_due" })
          .eq("user_id", usage.user_id);
      }
      break;
    }

    default:
      // Événement non géré — ignoré silencieusement
      break;
  }

  return NextResponse.json({ received: true });
}

// ── Helper : upsert user_usage depuis un objet Subscription Stripe ─────────
async function upsertUserUsage(
  supabase: ReturnType<typeof createAdminClient>,
  user_id:  string,
  sub:      Stripe.Subscription
): Promise<void> {
  const plan = resolvePlanFromSubscription(sub);

  await supabase
    .from("user_usage")
    .upsert({
      user_id,
      plan,
      subscription_status:    sub.status,
      stripe_subscription_id: sub.id,
      stripe_customer_id:     sub.customer as string,
      current_period_end:     new Date(sub.current_period_end * 1000).toISOString(),
    }, { onConflict: "user_id" });
}

// ── Helper : résoudre le plan depuis les price IDs de l'abonnement ──────────
function resolvePlanFromSubscription(sub: Stripe.Subscription): string {
  const priceId = sub.items.data[0]?.price.id ?? "";

  if (priceId === envServer.STRIPE_EXPERT_PRICE_ID) return "EXPERT";
  if (priceId === envServer.STRIPE_PRO_PRICE_ID)    return "PRO";
  if (priceId === envServer.STRIPE_PRICE_EARLY)     return "PRO"; // Early = PRO
  return "free";
}
