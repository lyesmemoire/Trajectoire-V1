// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import { getStrictUser } from "@/lib/auth/get-user";
import { RequestContext } from "@/lib/core/runtime/context/RequestContext";
import { appContainer } from "@/lib/core/runtime/container/app-container";
import { GetCurrentUserQuery } from "@/lib/auth/application/queries/get-current-user.query";
import { AuthPresenter } from "@/lib/auth/presentation/AuthPresenter";
import { ErrorHttpMapper } from "@/lib/core/result/errors/ErrorHttpMapper";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const user = await getStrictUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return RequestContext.run(
      { userId: user.id, correlationId: crypto.randomUUID(), requestId: crypto.randomUUID() },
      async () => {
        const getCurrentUserQuery = appContainer.resolve<GetCurrentUserQuery>("GetCurrentUserQuery");
        const result = await getCurrentUserQuery.execute({ userId: user.id });

        if (result.isFailure()) {
          const error = result.unwrapError();
          const httpResponse = ErrorHttpMapper.toHttpResponse(error);
          return NextResponse.json(
            { error: httpResponse.body.error, code: httpResponse.body.code },
            { status: httpResponse.status }
          );
        }

        const presenter = new AuthPresenter();
        const response = presenter.present(result.unwrap());
        return NextResponse.json(response);
      }
    );
  } catch (error: any) {
    console.error("[API/User/ExportData] Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
