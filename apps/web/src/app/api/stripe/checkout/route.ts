// apps/web/src/app/api/stripe/checkout/route.ts

export const dynamic = "force-dynamic";

import { NextRequest, NextResponse }  from "next/server";
import { z }                          from "zod";
import { prisma }                     from "@/lib/prisma";
import { getStrictUser }              from "@/lib/auth/session-logic";
import { envServer }                  from "@/lib/env.server";
import { logInfo, logError }          from "@/lib/logger";
import { checkRateLimit }             from "@/lib/rate-limit";
import { stripe }                    from "@/lib/stripe";
import Stripe from 'stripe';

// ── Client Stripe (resilient) ──────────────────────────────────────────────────────
function getStripe() {
  return stripe;
}

// ── Plans autorisés — source de vérité côté serveur ──────────────────────────
// Ces IDs doivent correspondre exactement aux Price IDs dans le Stripe Dashboard
function getAllowedPriceIds(): string[] {
  return [
    envServer.STRIPE_PRICE_STARTER_MONTHLY,
    envServer.STRIPE_PRO_PRICE_ID,
    envServer.STRIPE_EXPERT_PRICE_ID,
    envServer.STRIPE_PRICE_EARLY,
  ].filter((id): id is string => typeof id === "string" && id.length > 0);
}

// ── Résolution plan depuis price ID ──────────────────────────────────────────
function resolvePlanLabel(priceId: string): string {
  if (priceId === envServer.STRIPE_EXPERT_PRICE_ID)       return "EXPERT";
  if (priceId === envServer.STRIPE_PRO_PRICE_ID)          return "PRO";
  if (priceId === envServer.STRIPE_PRICE_EARLY)           return "PRO";
  if (priceId === envServer.STRIPE_PRICE_STARTER_MONTHLY) return "STARTER";
  return "FREE";
}

export async function POST(request: NextRequest) {

  // ── Guard : Stripe configuré ──────────────────────────────────────────
  if (!envServer.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Stripe non configuré." }, { status: 500 });
  }

  // ── Guard : au moins un prix configuré ───────────────────────────────
  const allowedPriceIds = getAllowedPriceIds();
  if (allowedPriceIds.length === 0) {
    logError("[Checkout]", "Aucun STRIPE_PRICE_* configuré dans les variables d'environnement");
    return NextResponse.json({ error: "Configuration paiement invalide." }, { status: 503 });
  }

  // ── Authentification ──────────────────────────────────────────────────
  const { user } = await getStrictUser();
  if (!user) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  // ── Rate limiting ─────────────────────────────────────────────────────
  const rateLimitResult = await checkRateLimit(user.id, "stripe_checkout");
  if (rateLimitResult.blocked) {
    return NextResponse.json(
      { error: "Trop de requêtes. Réessayez plus tard." },
      { 
        status: 429,
        headers: rateLimitResult.headers
      }
    );
  }

  // ── Validation payload ────────────────────────────────────────────────
  const RequestSchema = z.object({
    priceId: z.string().refine(
      (id) => allowedPriceIds.includes(id),
      { message: "Plan invalide." }
    ),
  });

  const body   = await request.json().catch(() => null);
  const parsed = RequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Paramètres invalides.", details: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const { priceId } = parsed.data;

  // ── Récupérer profil utilisateur ──────────────────────────────────────
  const userProfile = await prisma.user.findUnique({
    where:  { id: user.id },
    select: { email: true, plan: true, stripeCustomerId: true },
  });

  // ── Guard : pas de double abonnement ─────────────────────────────────
  // Vérifier via la table Subscription (source de vérité)
  const existingSubscription = await prisma.subscription.findUnique({
    where:  { userId: user.id },
    select: { status: true, stripeSubId: true },
  });

  const hasActiveSubscription =
    existingSubscription?.status === "active" &&
    existingSubscription?.stripeSubId;

  if (hasActiveSubscription) {
    return NextResponse.json(
      { error: "Vous avez déjà un abonnement actif. Utilisez le portail client pour le modifier." },
      { status: 400 }
    );
  }

  // ── Résolution plan ───────────────────────────────────────────────────
  const planLabel = resolvePlanLabel(priceId);

  logInfo("[STRIPE_CHECKOUT]", "Création session checkout", {
    userId:  user.id,
    priceId,
    plan:    planLabel,
  });

  try {
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode:                 "subscription",  // ← TOUJOURS subscription
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      // Métadonnées signées par Stripe — source de vérité pour le webhook
      subscription_data: {
        metadata: {
          user_id: user.id,
          plan:    planLabel,
        },
      },
      metadata: {
        user_id: user.id,
        plan:    planLabel,
      },
      success_url: `${envServer.NEXT_PUBLIC_APP_URL}/dashboard?checkout=success`,
      cancel_url:  `${envServer.NEXT_PUBLIC_APP_URL}/pricing?checkout=cancelled`,
      expires_at:  Math.floor(Date.now() / 1000) + 30 * 60,
    };

    // Réutiliser le customer Stripe existant si disponible
    if (userProfile?.stripeCustomerId) {
      sessionParams.customer = userProfile.stripeCustomerId;
    } else if (userProfile?.email) {
      sessionParams.customer_email = userProfile.email;
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    // Sauvegarder stripeCustomerId immédiatement si Stripe en a créé un
    if (session.customer && !userProfile?.stripeCustomerId) {
      await prisma.user.update({
        where: { id: user.id },
        data:  { stripeCustomerId: session.customer as string },
      });
    }

    return NextResponse.json({ url: session.url });

  } catch (err: any) {
    logError("[STRIPE_ERROR]", err, { route: "api/stripe/checkout", userId: user.id });
    const message = err instanceof Error ? err.message : "Erreur Stripe";
    return NextResponse.json(
      { error: `Impossible de créer la session de paiement : ${message}` },
      { status: 500 }
    );
  }
}
