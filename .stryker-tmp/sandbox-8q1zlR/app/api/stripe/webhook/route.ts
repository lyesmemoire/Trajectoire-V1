// @ts-nocheck
// app/api/stripe/webhook/route.ts
// 100% Abonnement — Gère checkout, update, delete, payment_failed

import { NextRequest, NextResponse } from "next/server";
import { RequestContext } from "@/lib/core/runtime/context/RequestContext";
import { appContainer } from "@/lib/core/runtime/container/app-container";
import { HandleWebhookUseCase } from "@/lib/billing/application/use-cases/handle-webhook.use-case";
import { ErrorHttpMapper } from "@/lib/core/result/errors/ErrorHttpMapper";
import { envServer } from "@/lib/env.server";
import Stripe from "stripe";

// ─── Webhook handler ─────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Signature manquante." }, { status: 400 });
  }

  // Parse Stripe event (HTTP layer responsibility)
  let event: Stripe.Event;
  try {
    const stripe = require("@/lib/stripe").stripe;
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      envServer.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return NextResponse.json({ error: "Signature invalide." }, { status: 400 });
  }

  return RequestContext.run(
    { correlationId: crypto.randomUUID(), requestId: crypto.randomUUID() },
    async () => {
      const useCase = appContainer.resolve<HandleWebhookUseCase>("HandleWebhookUseCase");
      const result = await useCase.execute({
        payload: body,
        signature: sig,
        eventType: event.type,
        eventData: event.data.object,
      });

      if (result.isFailure()) {
        const error = result.unwrapError();
        const httpResponse = ErrorHttpMapper.toHttpResponse(error);
        return NextResponse.json(
          { error: httpResponse.body.error, code: httpResponse.body.code },
          { status: httpResponse.status }
        );
      }

      return NextResponse.json({ received: true });
    }
  );
}
