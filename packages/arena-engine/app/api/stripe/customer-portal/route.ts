export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getStrictUser } from "@/lib/auth/session-logic";
import { createSupabaseServiceClient } from "@/lib/supabase-server";

let stripeClient: Stripe | null = null;
function getStripe(): Stripe {
  if (!stripeClient) {
    stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY || "dummy", {
      apiVersion: "2025-08-27.basil" as any,
    });
  }
  return stripeClient;
}

export async function POST(request: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
  }

  const { user } = await getStrictUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = createSupabaseServiceClient();

    // Attempt to get the stripe_customer_id from user_usage
    const { data: usage } = await supabase
      .from("user_usage")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .single();

    let customerId = usage?.stripe_customer_id;

    if (!customerId) {
      // If we don't have it saved, try to find it via Stripe API using email
      const stripe = getStripe();
      const customers = await stripe.customers.list({
        email: user.email,
        limit: 1
      });

      if (customers.data.length > 0) {
        customerId = customers.data[0].id;

        // Save it for next time
        await supabase
          .from("user_usage")
          .update({ stripe_customer_id: customerId })
          .eq("user_id", user.id);
      } else {
        return NextResponse.json({ error: "No billing profile found. Have you made a purchase yet?" }, { status: 404 });
      }
    }

    const session = await getStripe().billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("[CUSTOMER_PORTAL_ERROR]", err);
    return NextResponse.json(
      { error: `Failed to create portal session: ${err.message}` },
      { status: 500 }
    );
  }
}
