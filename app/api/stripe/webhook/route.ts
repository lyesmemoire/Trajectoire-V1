export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createSupabaseServiceClient } from "@/lib/supabase-server";
import Stripe from "stripe";
import { logInfo } from "@/lib/logger";

/**
 * Endpoint des webhooks Stripe.
 * Séquence : Facturation -> Synchronisation Supabase -> Mise à jour UI.
 */
export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: "Webhook signature failed" },
      { status: 400 },
    );
  }

  const supabaseAdmin = createSupabaseServiceClient();

  try {
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.user_id;
        const credits = parseInt(session.metadata?.credits || "0", 10);
        const packName = session.metadata?.pack_name || "unknown";
        const resolvedPrice = session.metadata?.resolved_price || "";
        const amountCents = session.amount_total || 0;

        if (userId) {
          // ── Early Access Logic ──
          const STRIPE_PRICE_EARLY = process.env.STRIPE_PRICE_EARLY || "price_pro_early_access";
          if (resolvedPrice === STRIPE_PRICE_EARLY) {
            await supabaseAdmin.from("early_access_tracking").insert({ user_id: userId });
            console.log(`[Stripe Webhook] Recorded Early Access for User ${userId}`);
          }

          // In case credits are missing for a Pro subscription, we still want to log the payment.
          // Adjusting logic to support both credit packs and subscriptions.
          if (credits > 0 || session.mode === "payment" || session.mode === "subscription") {
          const { data, error } = await supabaseAdmin.rpc(
            "process_stripe_payment",
            {
              p_event_id: event.id,
              p_user_id: userId,
              p_credits: credits,
              p_amount_cents: amountCents,
              p_pack_name: packName,
            },
          );

          if (error) {
            console.error(
              "[STRIPE_ERROR] Error calling process_stripe_payment:",
              error,
            );
            return NextResponse.json(
              { error: "Failed to process payment" },
              { status: 500 },
            );
          }

          if (data && !data.success && data.reason === "already_processed") {
            console.log(
              `[Stripe Webhook] Event ${event.id} already processed. Ignored.`,
            );
          } else {
            console.log(
              `[Stripe] User ${userId} purchased ${credits} credits (${packName})`,
            );
            logInfo("[PAYMENT_SUCCESS]", "Payment unlocked", {
              route: "api/stripe/webhook",
              userId: userId
            });
          }
        } else {
          console.error(
            "[Stripe Webhook] Missing userId in metadata",
          );
        }
        break;

      case "customer.subscription.deleted":
        // Pour l'instant nous vendons des crédits one-off, donc pas de subscription downgrade.
        // Si besoin, appeler une RPC downgrade_subscription.
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[STRIPE_ERROR]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
