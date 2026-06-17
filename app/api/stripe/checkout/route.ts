export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createSupabaseServiceClient } from "@/lib/supabase-server";
import { getStrictUser } from "@/lib/auth/session-logic";
import { logInfo, logError } from "@/lib/logger";

let stripeClient: Stripe | null = null;

let stripeClient: Stripe | null = null;
function getStripe(): Stripe {
  if (!stripeClient) {
    stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY || "dummy", {
      apiVersion: "2025-08-27.basil" as any,
    });
  }
  return stripeClient;
}

// Source de vérité des prix — jamais depuis le client
const VALID_PRICE_IDS = new Set([
  "price_starter_5credits",
  "price_pro_15credits",
  "price_executive_analysis",
  "price_premium_access" // Logical price ID sent by frontend
]);

// Actual Stripe Price IDs (to be configured in Stripe)
const STRIPE_PRICE_EARLY = process.env.STRIPE_PRICE_EARLY || "price_pro_early_access";
const STRIPE_PRICE_STANDARD = process.env.STRIPE_PRICE_STANDARD || "price_pro_standard";


export async function POST(request: NextRequest) {
  // ── Stripe Configuration Guard ────────────────────────────────
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: "Stripe not configured." },
      { status: 500 }
    );
  }

  const { user } = await getStrictUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = user.id;
  const userEmail = user.email || "";

  const { priceId } = await request.json();

  // Valider que le priceId est connu et autorisé
  if (!priceId || !VALID_PRICE_IDS.has(priceId)) {
    return NextResponse.json({ error: "Invalid price ID" }, { status: 400 });
  }

  const supabase = createSupabaseServiceClient();

  // Récupérer l'email depuis le profil si non disponible dans le header
  const { data } = await supabase
    .from("profiles")
    .select("email, full_name")
    .eq("id", userId)
    .single();

  let resolvedPriceId = priceId;

  // ── Early Access Pricing Logic ──
  if (priceId === "price_premium_access") {
    const { count, error } = await supabase
      .from("early_access_tracking")
      .select("*", { count: "exact", head: true });
      
    if (!error && count !== null && count < 30) {
      resolvedPriceId = STRIPE_PRICE_EARLY;
    } else {
      resolvedPriceId = STRIPE_PRICE_STANDARD;
    }
  }

  const profile = data as any;
  const customerEmail = profile?.email ?? userEmail;

  logInfo("[STRIPE_CHECKOUT]", "Creating checkout session", {
    route: "api/stripe/checkout"
  });

  try {
    const session = await getStripe().checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        customer_email: customerEmail,
        line_items: [
          {
            price: resolvedPriceId,
            quantity: 1,
          },
        ],
        // Métadonnées signées par Stripe — source de vérité pour le webhook
        metadata: {
          user_id: userId,
          plan: priceId === "price_executive_analysis" ? "EXECUTIVE" : (priceId.includes("pro") || priceId === "price_premium_access" ? "PRO" : "STARTER"),
          credits: priceId === "price_executive_analysis" ? "0" : (priceId.includes("15credits") ? "15" : "5"),
          pack_name: priceId,
          resolved_price: resolvedPriceId
        },
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/report?session_id={CHECKOUT_SESSION_ID}&unlocked=true`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/report`,
        // Expiration de la session Stripe (30 min)
        expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
      });

      return NextResponse.json({ url: session.url });
    } catch (err) {
    logError("[STRIPE_ERROR]", err, {
      route: "api/stripe/checkout"
    });
    const message = err instanceof Error ? err.message : "Stripe error";
    return NextResponse.json(
      { error: `Failed to create checkout session: ${message}` },
      { status: 500 },
    );
  }
}
