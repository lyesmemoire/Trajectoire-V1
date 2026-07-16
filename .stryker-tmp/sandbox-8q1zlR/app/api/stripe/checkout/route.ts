// @ts-nocheck
export const dynamic = "force-dynamic";

import { z } from "zod";
import { envServer } from "@/lib/env.server";
import { NextRequest, NextResponse } from "next/server";
import { getStrictUser } from "@/lib/auth/session-logic";
import { RequestContext } from "@/lib/core/runtime/context/RequestContext";
import { appContainer } from "@/lib/core/runtime/container/app-container";
import { CreateCheckoutSessionUseCase } from "@/lib/billing/application/use-cases/create-checkout-session.use-case";
import { BillingPresenter } from "@/lib/billing/presentation/BillingPresenter";
import { ErrorHttpMapper } from "@/lib/core/result/errors/ErrorHttpMapper";
import { logInfo } from "@/lib/core";

// ─── Plan → Price ID mapping ─────────────────────────────────────────────────

type PlanSlug = "essentiel" | "performance" | "strategique";

function getPriceId(plan: PlanSlug): string | undefined {
  const map: Record<PlanSlug, string | undefined> = {
    essentiel:    envServer.STRIPE_PRICE_ESSENTIEL,
    performance:  envServer.STRIPE_PRICE_PERFORMANCE,
    strategique:  envServer.STRIPE_PRICE_STRATEGIQUE,
  };
  return map[plan];
}

// ─── Route ───────────────────────────────────────────────────────────────────

const RequestSchema = z.object({
  plan: z.enum(["essentiel", "performance", "strategique"]),
});

export async function POST(request: NextRequest) {
  // ── Stripe Configuration Guard ────────────────────────────────
  if (!envServer.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: "Stripe not configured." },
      { status: 500 }
    );
  }

  const { user } = await getStrictUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = RequestSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Plan invalide.", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { plan } = parsed.data;
  const priceId = getPriceId(plan);

  if (!priceId) {
    return NextResponse.json(
      { error: `Price ID non configuré pour le plan "${plan}".` },
      { status: 503 }
    );
  }

  logInfo("[STRIPE_CHECKOUT]", "Creating subscription checkout", {
    route: "api/stripe/checkout",
    plan,
  });

  return RequestContext.run(
    { userId: user.id, correlationId: crypto.randomUUID(), requestId: crypto.randomUUID() },
    async () => {
      const useCase = appContainer.resolve<CreateCheckoutSessionUseCase>("CreateCheckoutSessionUseCase");
      const result = await useCase.execute({
        userId: user.id,
        email: user.email || "",
        priceId,
        successUrl: `${envServer.NEXT_PUBLIC_APP_URL}/dashboard/cvs?upgraded=true`,
        cancelUrl: `${envServer.NEXT_PUBLIC_APP_URL}/pricing`,
        metadata: { plan },
      });

      if (result.isFailure()) {
        const error = result.unwrapError();
        const httpResponse = ErrorHttpMapper.toHttpResponse(error);
        return NextResponse.json(
          { error: httpResponse.body.error, code: httpResponse.body.code },
          { status: httpResponse.status }
        );
      }

      const presenter = new BillingPresenter();
      const response = presenter.present(result.unwrap());
      return NextResponse.json(response);
    }
  );
}
