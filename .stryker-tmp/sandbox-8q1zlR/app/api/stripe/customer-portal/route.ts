// @ts-nocheck
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getStrictUser } from "@/lib/auth/session-logic";
import { RequestContext } from "@/lib/core/runtime/context/RequestContext";
import { appContainer } from "@/lib/core/runtime/container/app-container";
import { OpenBillingPortalUseCase } from "@/lib/billing/application/use-cases/open-billing-portal.use-case";
import { BillingPresenter } from "@/lib/billing/presentation/BillingPresenter";
import { ErrorHttpMapper } from "@/lib/core/result/errors/ErrorHttpMapper";
import { envServer } from "@/lib/env.server";

export async function POST(request: NextRequest) {
  if (!envServer.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
  }

  const { user } = await getStrictUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return RequestContext.run(
    { userId: user.id, correlationId: crypto.randomUUID(), requestId: crypto.randomUUID() },
    async () => {
      const useCase = appContainer.resolve<OpenBillingPortalUseCase>("OpenBillingPortalUseCase");
      const result = await useCase.execute({
        userId: user.id,
        returnUrl: `${envServer.NEXT_PUBLIC_APP_URL}/dashboard`,
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
