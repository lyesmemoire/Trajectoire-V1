import { envServer } from "../../../../../lib/env.server.js";
import type { FastifyReply, FastifyRequest } from "fastify";
import Stripe from "stripe";
import { verifyVoiceToken } from "../auth.js";
import { createClient } from "@supabase/supabase-js";

export async function registerBillingRoutes(app: _FastifyInstance) {
  const stripe = new Stripe(envServer.STRIPE_SECRET_KEY, {
    apiVersion: "2025-08-27.basil",
  });

  const supabase = createClient(
    envServer.SUPABASE_URL,
    envServer.SUPABASE_SERVICE_ROLE_KEY,
  );

  app.post("/api/create-checkout-session", async (request, reply) => {
    const authHeader = request.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return reply.status(401).send({ error: "Unauthorized" });
    }

    const token = authHeader.replace("Bearer ", "");
    const user = await verifyVoiceToken(token);
    if (!user) {
      return reply.status(401).send({ error: "Unauthorized" });
    }

    const frontendUrl = envServer.FRONTEND_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      client_reference_id: user.userId,
      ...(user.email ? { customer_email: user.email as string } : {}),
      line_items: [
        {
          price: envServer.STRIPE_PRICE_PRO_ID,
          quantity: 1,
        },
      ],
      metadata: {
        user_id: user.userId,
      },
      success_url: `${frontendUrl}/success`,
      cancel_url: `${frontendUrl}/cancel`,
    });

    return reply.send({ url: session.url });
  });

  app.post("/api/create-portal-session", async (request, reply) => {
    const authHeader = request.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return reply.status(401).send({ error: "Unauthorized" });
    }

    const token = authHeader.replace("Bearer ", "");
    const user = await verifyVoiceToken(token);
    if (!user) {
      return reply.status(401).send({ error: "Unauthorized" });
    }

    const { data: usage } = await supabase
      .from("user_usage")
      .select("stripe_customer_id")
      .eq("user_id", user.userId)
      .single();

    if (!usage?.stripe_customer_id) {
      return reply.status(400).send({ error: "No active subscription found." });
    }

    const frontendUrl = envServer.FRONTEND_URL || "http://localhost:3000";

    const session = await stripe.billingPortal.sessions.create({
      customer: usage.stripe_customer_id,
      return_url: `${frontendUrl}/dashboard`,
    });

    return reply.send({ url: session.url });
  });

  // Stripe Webhook handling
  app.register(async (webhookApp) => {
    webhookApp.addContentTypeParser(
      "application/json",
      { parseAs: "buffer" },
      (req, body, done) => {
        done(null, body);
      },
    );

    webhookApp.post(
      "/api/stripe/webhook",
      async (request: FastifyRequest, reply: FastifyReply) => {
        const sig = request.headers["stripe-signature"];

        if (!sig || typeof sig !== "string") {
          return reply.status(400).send("Missing stripe signature");
        }

        let event: Stripe.Event;

        try {
          event = stripe.webhooks.constructEvent(
            request.body as Buffer,
            sig,
            envServer.STRIPE_WEBHOOK_SECRET,
          );
        } catch (err: unknown) {
          return reply.status(400).send(`Webhook Error: ${err.message}`);
        }

        // Check Idempotency
        const { data: existing } = await supabase
          .from("stripe_events")
          .select("id")
          .eq("id", event.id)
          .single();

        if (existing) {
          return reply.status(200).send({ received: true });
        }

        await supabase.from("stripe_events").insert({
          id: event.id,
          type: event.type,
        });

        // Helper functions
        async function upsertSubscription(userId: string, subscription: Stripe.Subscription) {
          const { error: updateError } = await supabase
            .from("user_usage")
            .update({
              stripe_customer_id: subscription.customer as string,
              stripe_subscription_id: subscription.id,
              subscription_status: subscription.status,
              current_period_end: new Date((subscription as unknown).current_period_end * 1000).toISOString(),
              plan: subscription.status === "active" ? "pro" : "free",
            })
            .eq("user_id", userId);

          if (updateError) {
            console.error(`Failed to upsert subscription for user ${userId}:`, updateError);
            throw updateError;
          }
        }

        async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
          if (!session.subscription) return;
          const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
          const userId = session.client_reference_id || session.metadata?.user_id;
          if (!userId) return;
          await upsertSubscription(userId, subscription);
        }

        async function handleInvoicePaid(invoice: Stripe.Invoice) {
          if (!(invoice as unknown).subscription) return;
          const subscription = await stripe.subscriptions.retrieve((invoice as unknown).subscription as string);
          const customerId = subscription.customer as string;

          const { data: user, error: lookupError } = await supabase
            .from("user_usage")
            .select("user_id")
            .eq("stripe_customer_id", customerId)
            .maybeSingle();

          if (lookupError) {
            console.error(`Failed to resolve Stripe customer ${customerId} ownership:`, lookupError);
            return;
          }

          if (!user) {
            console.warn(`Stripe webhook received for unknown customer ${customerId}`);
            return;
          }

          await upsertSubscription(user.user_id, subscription);
        }

        async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
          const customerId = subscription.customer as string;

          const { data: user, error: lookupError } = await supabase
            .from("user_usage")
            .select("user_id")
            .eq("stripe_customer_id", customerId)
            .maybeSingle();

          if (lookupError) {
            console.error(`Failed to resolve Stripe customer ${customerId} ownership:`, lookupError);
            return;
          }

          if (!user) {
            console.warn(`Stripe webhook received for unknown customer ${customerId}`);
            return;
          }

          await upsertSubscription(user.user_id, subscription);
        }

        async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
          const customerId = subscription.customer as string;

          const { data: usage, error: lookupError } = await supabase
            .from("user_usage")
            .select("user_id")
            .eq("stripe_customer_id", customerId)
            .maybeSingle();

          if (lookupError) {
            console.error(`Failed to resolve Stripe customer ${customerId} ownership:`, lookupError);
            return;
          }

          if (!usage) {
            console.warn(`Stripe webhook received for unknown customer ${customerId}`);
            return;
          }

          const { error: updateError } = await supabase
            .from("user_usage")
            .update({
              plan: "free",
              subscription_status: "canceled",
              stripe_subscription_id: null,
              current_period_end: null,
            })
            .eq("user_id", usage.user_id)
            .eq("stripe_customer_id", customerId);

          if (updateError) {
            console.error(`Failed to cancel subscription for user ${usage.user_id}:`, updateError);
            return;
          }
        }

        try {
          switch (event.type) {
            case "checkout.session.completed":
              await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
              break;
            case "invoice.paid":
              await handleInvoicePaid(event.data.object as Stripe.Invoice);
              break;
            case "customer.subscription.updated":
              await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
              break;
            case "customer.subscription.deleted":
              await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
              break;
          }
          return reply.status(200).send({ received: true });
        } catch (err: unknown) {
          console.error("🔥 Stripe webhook processing error:", err);
          return reply.status(500).send("Webhook handler failed");
        }
      },
    );
  });
}


