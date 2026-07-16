// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import { getStrictUser } from "@/lib/auth/get-user";
import { RequestContext } from "@/lib/core/runtime/context/RequestContext";
import { appContainer } from "@/lib/core/runtime/container/app-container";
import { GetWalletQuery } from "@/lib/billing/application/queries/get-wallet.query";
import { BillingPresenter } from "@/lib/billing/presentation/BillingPresenter";
import { ErrorHttpMapper } from "@/lib/core/result/errors/ErrorHttpMapper";
import { envServer } from "@/lib/env.server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  // Check if Supabase is configured
  if (!envServer.NEXT_PUBLIC_SUPABASE_URL || !envServer.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.json(
      { error: "Service unavailable - configuration missing" },
      { status: 503 }
    );
  }

  try {
    const user = await getStrictUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return RequestContext.run(
      { userId: user.id, correlationId: crypto.randomUUID(), requestId: crypto.randomUUID() },
      async () => {
        const getWalletQuery = appContainer.resolve<GetWalletQuery>("GetWalletQuery");
        const result = await getWalletQuery.execute({ userId: user.id });

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
  } catch (error: any) {
    console.error("[API/Billing/State] Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
