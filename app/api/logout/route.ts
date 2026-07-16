import { NextRequest, NextResponse } from "next/server";
import { RequestContext } from "@/lib/core/runtime/context/RequestContext";
import { appContainer } from "@/lib/core/runtime/container/app-container";
import { LogoutUserUseCase } from "@/lib/auth/application/use-cases/logout-user.use-case";
import { ErrorHttpMapper } from "@/lib/core/result/errors/ErrorHttpMapper";
import { createServerClientSupabase } from "@/lib/supabase/server";
import { auditLogger } from "@/lib/core/security/audit-logger";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerClientSupabase();
    
    // Get current session
    const sessionResult = await supabase.auth.getSession();
    const session = sessionResult.data?.session;
    const correlationId = crypto.randomUUID();
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    const userAgent = req.headers.get("user-agent") || undefined;

    if (session) {
      return RequestContext.run(
        { correlationId, requestId: crypto.randomUUID() },
        async () => {
          const logoutUserUseCase = appContainer.resolve<LogoutUserUseCase>("LogoutUserUseCase");
          const result = await logoutUserUseCase.execute({ 
            userId: session.user.id,
            email: session.user.email
          });

          if (result.isFailure()) {
            const error = result.unwrapError();
            const httpResponse = ErrorHttpMapper.toHttpResponse(error);
            return NextResponse.json(
              { 
                success: false,
                code: httpResponse.body.code,
                message: httpResponse.body.error
              },
              { status: httpResponse.status }
            );
          }
        }
      );
    }

    // Clear cookies
    const response = NextResponse.json(
      { success: true },
      { status: 204 }
    );

    response.cookies.delete("sb-access-token");
    response.cookies.delete("sb-refresh-token");

    return response;
  } catch (error: any) {
    console.error("[API/Logout] Error:", error);
    return NextResponse.json({ 
      success: false,
      code: "INTERNAL_ERROR",
      message: "Internal server error"
    }, { status: 500 });
  }
}
