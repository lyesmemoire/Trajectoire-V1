// apps/web/src/app/api/stripe/customer-portal/route.ts
// Pas de changement logique — corrections mineures uniquement

export const dynamic = "force-dynamic";

import { NextResponse, NextRequest } from 'next/server';
import Stripe                        from "stripe";
import { getStrictUser }             from "@/lib/auth/session-logic";
import { prisma }                    from "@/lib/prisma";
import { envServer }                 from "@/lib/env.server";
import { logError }                  from "@/lib/logger/Logger";

let stripeClient: Stripe | null = null;
function getStripe(): Stripe {
  if (!stripeClient) {
    stripeClient = new Stripe(envServer.STRIPE_SECRET_KEY ?? "", {
      apiVersion: "2025-08-27.basil" as Stripe.LatestApiVersion,
    });
  }
  return stripeClient;
}

export async function POST(_request: NextRequest) {

  if (!envServer.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Stripe non configuré." }, { status: 500 });
  }

  const { user } = await getStrictUser();
  if (!user) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  try {
    // 1. Chercher le stripeCustomerId dans Subscription d'abord
    const subscription = await prisma.subscription.findUnique({
      where:  { userId: user.id },
      select: { stripeCustomerId: true },
    });

    let customerId = subscription?.stripeCustomerId;

    // 2. Fallback : chercher dans User
    if (!customerId) {
      const userRecord = await prisma.user.findUnique({
        where:  { id: user.id },
        select: { stripeCustomerId: true },
      });
      customerId = userRecord?.stripeCustomerId ?? undefined;
    }

    // 3. Fallback final : chercher via l'email dans l'API Stripe
    if (!customerId && user.email) {
      const customers = await getStripe().customers.list({
        email: user.email,
        limit: 1,
      });

      if (customers.data.length > 0) {
        customerId = customers.data[0].id;
        // Sauvegarder pour éviter ce lookup à l'avenir
        await prisma.user.update({
          where: { id: user.id },
          data:  { stripeCustomerId: customerId },
        });
      }
    }

    if (!customerId) {
      return NextResponse.json(
        { error: "Aucun profil de facturation trouvé. Avez-vous souscrit un abonnement ?" },
        { status: 404 }
      );
    }

    const session = await getStripe().billingPortal.sessions.create({
      customer:   customerId,
      return_url: `${envServer.NEXT_PUBLIC_APP_URL}/dashboard`,
    });

    return NextResponse.json({ url: session.url });

  } catch (error) {
    logError("[CUSTOMER_PORTAL_ERROR]", error);
    const message = error instanceof Error ? error.message : "Erreur inconnue";
    return NextResponse.json(
      { error: `Impossible d'ouvrir le portail : ${message}` },
      { status: 500 }
    );
  }
}
