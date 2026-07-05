import { NextRequest, NextResponse } from "next/server";
import { getStrictUser } from "@/lib/auth/get-user";
import { RequestContext } from "@/lib/core/runtime/context/RequestContext";
import { appContainer } from "@/lib/core/runtime/container/app-container";
import { UpdateProfileUseCase } from "@/lib/auth/application/use-cases/update-profile.use-case";
import { AuthPresenter } from "@/lib/auth/presentation/AuthPresenter";
import { ErrorHttpMapper } from "@/lib/core/result/errors/ErrorHttpMapper";
import { envServer } from "@/lib/env.server";
import { LoggerProvider } from "@/lib/core/observability/logger";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const user = await getStrictUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return RequestContext.run(
      { userId: user.id, correlationId: crypto.randomUUID(), requestId: crypto.randomUUID() },
      async () => {
        const updateProfileUseCase = appContainer.resolve<UpdateProfileUseCase>("UpdateProfileUseCase");
        const result = await updateProfileUseCase.execute({
          userId: user.id,
          bio: "cv_editor_completed",
        });

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
        
        // Set cookie for cv-editor-completed
        const nextResponse = NextResponse.json(response);
        nextResponse.cookies.set("cv-editor-completed", "true", {
          httpOnly: true,
          secure: envServer.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 30, // 30 days
        });
        
        return nextResponse;
      }
    );
  } catch (error: any) {
    LoggerProvider.getLogger().error("[API/User/SetCvEditorCompleted] Error", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
