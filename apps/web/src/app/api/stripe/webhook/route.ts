// apps/web/src/app/api/stripe/webhook/route.ts

import { NextResponse, NextRequest } from 'next/server';
import { stripe }                    from "@/lib/stripe";
import { prisma }                    from "@/lib/prisma";
import { envServer }                 from "@/lib/env.server";
import { logger }                    from "@/lib/logger/Logger";
import Stripe                        from "stripe";
import { z }                         from "zod";
import { computePackExpiry } from "@/lib/plans";
import { rateLimit } from "@/lib/rate-limiting/rate-limit.middleware";
import { RouteType, RateLimitScope } from "@/lib/rate-limiting/centralized-rate-limit.service";

export const maxDuration = 10;

const StripeMetadataSchema = z.object({
  user_id:        z.string().uuid(),
  resolved_price: z.string().optional(),
  plan:           z.string().optional(),
  type:           z.string().optional(), // e.g. "credits_purchase" or "referral_reward"
  credits:        z.string().optional(), // Amount of credits
});

export const POST = rateLimit(
  RouteType.STRIPE,
  async (req: NextRequest) => {
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
    } catch (error) {
      return NextResponse.json({ error: "Signature invalide." }, { status: 400 });
    }

  try {
    switch (event.type) {

      // â”€â”€ DÃ©marrage abonnement via Checkout â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      case "checkout.session.completed": {
        const session  = event.data.object as Stripe.Checkout.Session;

        const metadata = StripeMetadataSchema.safeParse(session.metadata);
        if (!metadata.success) {
          logger.error("[Webhook] checkout.session.completed â€” metadata invalide");
          break;
        }

        const { user_id, type, credits } = metadata.data;

        // Handle one-off credit purchases or rewards
        if (type === 'credits_purchase' || type === 'referral_reward') {
           const creditsToAdd = parseInt(credits || '0', 10);
           
           if (user_id && creditsToAdd > 0) {
              const { BillingService } = await import('@/lib/db/billing.service');
              
              // refundCredits uses add_credits_atomic and idempotency table (credit_transactions)
              // If event.id was already processed, it silently returns cached=true
              const result = await BillingService.refundCredits({
                 userId: user_id,
                 amount: creditsToAdd,
                 action: type as any,
                 operationId: event.id // Stripe Event ID is the unique idempotency key
              });
              
              if (!result.success && !(result as any).cached) {
                 logger.error(`[Webhook] Failed to add credits for ${user_id}: ${result.error}`);
              }
           }
        }

        // ── Pack Entretien (paiement unique) ───────────────────────────────────
        // "INTERVIEW_PACK" : ancien libellé, encore accepté pour les sessions
        // de paiement créées avant l'alignement sur lib/plans.ts.
        if (session.mode === "payment" && (type === "PACK" || type === "INTERVIEW_PACK")) {
          if (!session.id) {
            logger.error("[Webhook] PACK — missing checkout session id");
            break;
          }
          // Idempotence : stripeCheckoutSessionId est UNIQUE. Si l'évènement est
          // rejoué (ou concurrent), une seule ligne — et donc un seul octroi de
          // droits — peut exister ; le doublon concurrent échoue (500) puis
          // Stripe réessaie et tombe sur le « skip » ci-dessous.
          const existing = await prisma.userPurchase.findUnique({
            where: { stripeCheckoutSessionId: session.id },
          });
          if (!existing) {
            const activatedAt = new Date(event.created * 1000);
            // Achat + droits dans la même transaction : pas d'achat sans droits.
            // Un abonné PRO n'est jamais rétrogradé (garde `plan: { not: "PRO" }`),
            // même si un Pack lui parvenait par une course entre deux onglets.
            const [, entitlement] = await prisma.$transaction([
              prisma.userPurchase.create({
                data: {
                  userId:                  user_id,
                  type:                    "INTERVIEW_PACK",
                  stripeCheckoutSessionId: session.id,
                  status:                  "ACTIVE",
                  activatedAt,
                },
              }),
              prisma.user.updateMany({
                where: { id: user_id, plan: { not: "PRO" } },
                data: {
                  plan:            "PACK",
                  packExpiresAt:   computePackExpiry("PACK", activatedAt),
                  simulationsUsed: 0,
                },
              }),
            ]);
            if ((entitlement as { count?: number } | undefined)?.count === 0) {
              logger.warn("[Webhook] PACK payé mais droits non appliqués (abonné PRO actif)", {
                userId:    user_id,
                sessionId: session.id,
              });
            }
            // Rattache le client Stripe créé au paiement (portail de facturation).
            // Jamais bloquant : l'achat et les droits sont déjà enregistrés.
            if (typeof session.customer === "string") {
              try {
                await prisma.user.updateMany({
                  where: { id: user_id, stripeCustomerId: null },
                  data:  { stripeCustomerId: session.customer },
                });
              } catch (customerError) {
                logger.warn("[Webhook] PACK — stripeCustomerId non enregistré", {
                  userId: user_id,
                  error:  customerError,
                });
              }
            }
            logger.info("[Webhook] PACK purchase persisted", {
              userId:    user_id,
              sessionId: session.id,
            });
          } else {
            logger.info("[Webhook] PACK already persisted — idempotent skip", {
              userId:    user_id,
              sessionId: session.id,
            });
          }
          break;
        }

        if (session.mode !== "subscription") break;

        if (session.subscription) {
          const sub = await stripe.subscriptions.retrieve(session.subscription as string);
          await upsertSubscriptionAndPlan(user_id, sub, event.created);
        }
        break;
      }

      // â”€â”€ CrÃ©ation abonnement â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      case "customer.subscription.created":
      // â”€â”€ Mise Ã  jour abonnement â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      // eslint-disable-next-line no-fallthrough
      case "customer.subscription.updated": {
        const sub     = event.data.object as Stripe.Subscription;
        const user_id = sub.metadata?.user_id;
        if (!user_id) {
          logger.error(`[Webhook] ${event.type} â€” user_id manquant dans metadata`, { eventType: event.type });
          break;
        }
        await upsertSubscriptionAndPlan(user_id, sub, event.created);
        break;
      }

      // â”€â”€ Paiement rÃ©ussi â†’ s'assurer que status = active â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

        // S'assurer que User.plan est cohÃ©rent
        const plan = resolvePlanFromPriceId(
          (invoice as any).lines?.data?.[0]?.price?.id ?? ""
        );
        if (plan) {
          await prisma.user.update({
            where: { id: existing.userId },
            data:  { plan },
          });
        }
        break;
      }

      // â”€â”€ Fin d'abonnement â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

      // â”€â”€ Paiement Ã©chouÃ© â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
  } catch (error) {
    logger.error(`[Webhook] Erreur sur event ${event.type}`, { error: error, eventType: event.type });
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
  },
  { scopes: [RateLimitScope.IP] }
);

// â”€â”€ Upsert Subscription + mise Ã  jour User.plan (atomique) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
async function upsertSubscriptionAndPlan(userId: string, sub: Stripe.Subscription, eventCreatedTimestamp: number): Promise<void> {
  const plan             = resolvePlanFromSubscription(sub);
  if (!plan) {
    // Prix inconnu (ancien STARTER/EXPERT, prix de test…) : on ne devine pas un
    // plan, on ne touche ni à l'abonnement ni à User.plan.
    logger.error("[Webhook] Prix d'abonnement inconnu — plan inchangé", {
      subscriptionId: sub.id,
      userId,
      priceId:        sub.items.data[0]?.price.id ?? "",
    });
    return;
  }
  const currentPeriodEnd = new Date((sub as any).current_period_end * 1000);
  const eventDate        = new Date(eventCreatedTimestamp * 1000);

  const existingSub = await prisma.subscription.findUnique({ where: { userId } });
  
  if (existingSub && existingSub.updatedAt > eventDate) {
    logger.info(`[Webhook] Ignoring stale Stripe event (eventDate: ${eventDate}, existing: ${existingSub.updatedAt})`);
    return;
  }

  await prisma.$transaction([
    prisma.subscription.upsert({
      where:  { userId },
      create: {
        userId,
        stripeCustomerId: sub.customer as string,
        stripeSubId:      sub.id,
        status:           sub.status,
        currentPeriodEnd,
        plan,
        updatedAt:        eventDate,
      },
      update: {
        stripeCustomerId: sub.customer as string,
        stripeSubId:      sub.id,
        status:           sub.status,
        currentPeriodEnd,
        plan,
        updatedAt:        eventDate,
      },
    }),
    prisma.user.update({
      where: { id: userId },
      data:  { plan },
    }),
  ]);
}

// ── Résolution plan depuis un objet Subscription Stripe ──────────────────────
// `null` = prix inconnu : l'appelant ne doit PAS modifier le plan.
function resolvePlanFromSubscription(sub: Stripe.Subscription): "PRO" | null {
  const priceId = sub.items.data[0]?.price.id ?? "";
  return resolvePlanFromPriceId(priceId);
}

// ── Résolution plan depuis un price ID ────────────────────────────────────────
// Seul PRO est un abonnement. STRIPE_PRICE_EARLY = ancien prix PRO (historique).
function resolvePlanFromPriceId(priceId: string): "PRO" | null {
  if (!priceId) return null;
  if (envServer.STRIPE_PRO_PRICE_ID && priceId === envServer.STRIPE_PRO_PRICE_ID) return "PRO";
  if (envServer.STRIPE_PRICE_EARLY && priceId === envServer.STRIPE_PRICE_EARLY)   return "PRO";
  return null;
}
