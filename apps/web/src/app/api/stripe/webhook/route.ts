// apps/web/src/app/api/stripe/webhook/route.ts

import { NextRequest, NextResponse } from "next/server";
import { stripe }                    from "@/lib/stripe";
import { prisma }                    from "@/lib/prisma";
import { envServer }                 from "@/lib/env.server";
import { logger }                    from "@/lib/logger/Logger";
import Stripe                        from "stripe";
import { z }                         from "zod";

const StripeMetadataSchema = z.object({
  user_id:        z.string().uuid(),
  resolved_price: z.string().optional(),
  plan:           z.string().optional(),
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
      envServer.STRIPE_WEBHOOK_SECRET ?? ""
    );
  } catch {
    return NextResponse.json({ error: "Signature invalide." }, { status: 400 });
  }

  try {
    switch (event.type) {

      // ── Démarrage abonnement via Checkout ─────────────────────────────
      case "checkout.session.completed": {
        const session  = event.data.object as Stripe.Checkout.Session;
        if (session.mode !== "subscription") break;

        const metadata = StripeMetadataSchema.safeParse(session.metadata);
        if (!metadata.success) {
          logger.error("[Webhook] checkout.session.completed — metadata invalide");
          break;
        }

        const { user_id } = metadata.data;

        if (session.subscription) {
          const sub = await stripe.subscriptions.retrieve(session.subscription as string);
          await upsertSubscriptionAndPlan(user_id, sub);
        }
        break;
      }

      // ── Création abonnement ───────────────────────────────────────────
      case "customer.subscription.created":
      // ── Mise à jour abonnement ────────────────────────────────────────
      case "customer.subscription.updated": {
        const sub     = event.data.object as Stripe.Subscription;
        const user_id = sub.metadata?.user_id;
        if (!user_id) {
          logger.error(`[Webhook] ${event.type} — user_id manquant dans metadata`, { eventType: event.type });
          break;
        }
        await upsertSubscriptionAndPlan(user_id, sub);
        break;
      }

      // ── Paiement réussi → s'assurer que status = active ───────────────
      case "invoice.payment_succeeded": {
        const invoice    = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;

        const existing = await prisma.subscription.findFirst({
          where: { stripeCustomerId: customerId },
        });
        if (!existing) break;

        await prisma.subscription.update({
          where: { id: existing.id },
          data:  { status: "active" },
        });

        // S'assurer que User.plan est cohérent
        const plan = resolvePlanFromPriceId(
          (invoice as any).lines?.data?.[0]?.price?.id ?? ""
        );
        if (plan !== "FREE") {
          await prisma.user.update({
            where: { id: existing.userId },
            data:  { plan: plan as any },
          });
        }
        break;
      }

      // ── Fin d'abonnement ──────────────────────────────────────────────
      case "customer.subscription.deleted": {
        const sub     = event.data.object as Stripe.Subscription;
        const user_id = sub.metadata?.user_id;
        if (!user_id) break;

        await prisma.$transaction([
          prisma.subscription.updateMany({
            where: { userId: user_id },
            data:  { status: "canceled", stripeSubId: "" },
          }),
          prisma.user.update({
            where: { id: user_id },
            data:  { plan: "FREE" },
          }),
        ]);
        break;
      }

      // ── Paiement échoué ───────────────────────────────────────────────
      case "invoice.payment_failed": {
        const invoice    = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;

        const existing = await prisma.subscription.findFirst({
          where: { stripeCustomerId: customerId },
        });
        if (!existing) break;

        await prisma.subscription.update({
          where: { id: existing.id },
          data:  { status: "past_due" },
        });
        break;
      }

      default:
        break;
    }
  } catch (err) {
    // Log l'erreur mais retourne 200 pour éviter que Stripe re-tente indéfiniment
    // sur des erreurs applicatives (pas des erreurs réseau)
    logger.error(`[Webhook] Erreur sur event ${event.type}`, { error: err, eventType: event.type });
  }

  return NextResponse.json({ received: true });
}

// ── Upsert Subscription + mise à jour User.plan (atomique) ───────────────────
async function upsertSubscriptionAndPlan(
  userId: string,
  sub:    Stripe.Subscription
): Promise<void> {
  const plan             = resolvePlanFromSubscription(sub);
  const currentPeriodEnd = new Date((sub as any).current_period_end * 1000);

  await prisma.$transaction([
    prisma.subscription.upsert({
      where:  { userId },
      create: {
        userId,
        stripeCustomerId: sub.customer as string,
        stripeSubId:      sub.id,
        status:           sub.status,
        currentPeriodEnd,
        plan:             plan as any,
        updatedAt:        new Date(),
      },
      update: {
        stripeCustomerId: sub.customer as string,
        stripeSubId:      sub.id,
        status:           sub.status,
        currentPeriodEnd,
        plan:             plan as any,
        updatedAt:        new Date(),
      },
    }),
    prisma.user.update({
      where: { id: userId },
      data:  { plan: plan as any },
    }),
  ]);
}

// ── Résolution plan depuis un objet Subscription Stripe ──────────────────────
function resolvePlanFromSubscription(sub: Stripe.Subscription): string {
  const priceId = sub.items.data[0]?.price.id ?? "";
  return resolvePlanFromPriceId(priceId);
}

// ── Résolution plan depuis un price ID ───────────────────────────────────────
function resolvePlanFromPriceId(priceId: string): string {
  if (!priceId) return "FREE";
  if (priceId === envServer.STRIPE_EXPERT_PRICE_ID)  return "EXPERT";
  if (priceId === envServer.STRIPE_PRO_PRICE_ID)     return "PRO";
  if (priceId === envServer.STRIPE_PRICE_EARLY)      return "PRO";
  if (priceId === envServer.STRIPE_PRICE_STARTER_MONTHLY) return "STARTER";
  return "FREE";
}
