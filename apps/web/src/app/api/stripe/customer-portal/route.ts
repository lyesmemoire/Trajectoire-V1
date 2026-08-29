// apps/web/src/app/api/stripe/customer-portal/route.ts

export const dynamic = "force-dynamic"

import { NextResponse, type NextRequest } from "next/server"
import { getStrictUser } from "@/lib/auth/session-logic"
import { prisma } from "@/lib/prisma"
import { envServer } from "@/lib/env.server"
import { logError } from "@/lib/logger/Logger"
import { stripe } from "@/lib/stripe"

export async function POST(_request: NextRequest) {
  if (!envServer.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: "Stripe non configuré." },
      { status: 500 }
    )
  }

  const { user } = await getStrictUser()

  if (!user) {
    return NextResponse.json(
      { error: "Non autorisé." },
      { status: 401 }
    )
  }

  try {
    const subscription = await prisma.subscription.findUnique({
      where: {
        userId: user.id,
      },
      select: {
        stripeCustomerId: true,
      },
    })

    let customerId = subscription?.stripeCustomerId ?? null

    if (!customerId) {
      const userRecord = await prisma.user.findUnique({
        where: {
          id: user.id,
        },
        select: {
          stripeCustomerId: true,
        },
      })

      customerId = userRecord?.stripeCustomerId ?? null
    }

    if (!customerId) {
      return NextResponse.json(
        {
          error:
            "Aucun profil de facturation associé à ce compte. Contactez le support si vous avez déjà un abonnement.",
        },
        { status: 404 }
      )
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${envServer.NEXT_PUBLIC_APP_URL}/dashboard`,
    })

    return NextResponse.json({
      url: session.url,
    })
  } catch (error) {
    logError("[CUSTOMER_PORTAL_ERROR]", error)

    return NextResponse.json(
      {
        error: "Impossible d'ouvrir le portail de facturation.",
      },
      { status: 500 }
    )
  }
}