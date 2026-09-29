export const dynamic = "force-dynamic";

import { NextRequest, NextResponse }  from "next/server";
import { z }                          from "zod";
import { prisma }                     from "@/lib/prisma";
import { getStrictUser }              from "@/lib/auth/session-logic";
import { envServer }                  from "@/lib/env.server";
import { logInfo, logError }          from "@/lib/logger";
import { checkRateLimit }             from "@/lib/rate-limit";
import { stripe }                    from "@/lib/stripe";
import { PLANS, canSimulate, getRemainingSimulations, isExpired, type PlanId } from "@/lib/plans";
import Stripe from 'stripe';

// ── Client Stripe (resilient) ──────────────────────────────────────────────────────────
function getStripe() {
  return stripe;
}

// ── Plans achetables : identifiants de lib/plans.ts (source de vérité) ──────────
const CheckoutPlanSchema = z.enum(["PACK", "PRO"]);
type CheckoutPlan = z.infer<typeof CheckoutPlanSchema>;

// Résolution serveur du Price ID Stripe (dépend de l'environnement test/live).
function resolveStripePriceId(plan: CheckoutPlan): string | null {
  switch (plan) {
    case "PACK": return envServer.STRIPE_PRICE_INTERVIEW_PACK ?? null;
    case "PRO":  return envServer.STRIPE_PRO_PRICE_ID         ?? null;
  }
}

export async function POST(request: NextRequest) {

  // ── Guard : Stripe configuré ───────────────────────────────────────────
  if (!envServer.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Stripe non configuré." }, { status: 500 });
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

  // ── Validation payload : { plan: "PACK" | "PRO" } ────────────────────
  const RequestSchema = z.object({
    plan: CheckoutPlanSchema,
  });

  const body   = await request.json().catch(() => null);
  const parsed = RequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Paramètres invalides.", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const planId: CheckoutPlan = parsed.data.plan;

  // ── Résolution Price ID Stripe depuis le plan ─────────────────────────
  const priceId = resolveStripePriceId(planId);
  if (!priceId) {
    logError("[Checkout]", `Price ID non configuré pour le plan : ${planId}`);
    return NextResponse.json({ error: "Configuration paiement invalide." }, { status: 503 });
  }

  // ── Récupérer profil utilisateur ──────────────────────────────────────
  const userProfile = await prisma.user.findUnique({
    where:  { id: user.id },
    select: {
      email: true,
      plan: true,
      stripeCustomerId: true,
      simulationsUsed: true,
      packExpiresAt: true,
    },
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

  // Un abonné Pro a déjà des simulations illimitées : ni second abonnement,
  // ni Pack (qui ne lui apporterait rien).
  if (hasActiveSubscription) {
    return NextResponse.json(
      {
        error:
          planId === "PACK"
            ? "Votre abonnement Pro inclut déjà des simulations illimitées."
            : "Vous avez déjà un abonnement actif. Utilisez le portail client pour le modifier.",
      },
      { status: 400 }
    );
  }

  // Pack déjà actif avec des simulations restantes : un réachat les écraserait.
  if (planId === "PACK" && userProfile) {
    const packUser = {
      plan: userProfile.plan as PlanId,
      simulationsUsed: userProfile.simulationsUsed,
      packExpiresAt: userProfile.packExpiresAt,
    };
    if (userProfile.plan === "PACK" && !isExpired(packUser) && canSimulate(packUser)) {
      const remaining = getRemainingSimulations(packUser);
      return NextResponse.json(
        {
          error: `Il vous reste ${remaining} simulation${remaining === 1 ? "" : "s"} sur votre ${PLANS.PACK.name}. Utilisez-les avant d'en acheter un nouveau.`,
        },
        { status: 400 }
      );
    }
  }

  logInfo("[STRIPE_CHECKOUT]", "Création session checkout", {
    userId:  user.id,
    priceId,
    plan:    planId,
  });

  try {
    const isPaymentMode = planId === "PACK";
    const mode = isPaymentMode ? "payment" : "subscription";

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode,
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      metadata: {
        user_id: user.id,
        type:    planId, // "PACK" | "PRO" — lu par le webhook
        plan:    planId, // legacy
      },
      success_url: `${envServer.NEXT_PUBLIC_APP_URL}/dashboard?checkout=success`,
      cancel_url:  `${envServer.NEXT_PUBLIC_APP_URL}/pricing?checkout=cancelled`,
      expires_at:  Math.floor(Date.now() / 1000) + 30 * 60,
    };

    if (!isPaymentMode) {
      sessionParams.subscription_data = {
        metadata: {
          user_id: user.id,
          type:    planId,
          plan:    planId,
        },
      };
    }

    // Réutiliser le customer Stripe existant si disponible
    if (userProfile?.stripeCustomerId) {
      sessionParams.customer = userProfile.stripeCustomerId;
    } else if (userProfile?.email) {
      sessionParams.customer_email = userProfile.email;
    }

    // Paiement unique : Stripe ne crée pas de client par défaut. On le demande
    // pour que l'acheteur du Pack retrouve ses reçus dans le portail de facturation.
    if (isPaymentMode && !userProfile?.stripeCustomerId) {
      sessionParams.customer_creation = "always";
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
