import { NextRequest, NextResponse } from "next/server";
import { RequestContext } from "@/lib/core/runtime/context/RequestContext";
import { appContainer } from "@/lib/core/runtime/container/app-container";
import { GetConversationsUseCase } from "@/modules/copilot/application/use-cases/get-conversations.use-case";
import { ErrorHttpMapper } from "@/lib/core/result/errors/ErrorHttpMapper";
import { createServerClientSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createServerClientSupabase();
    
    // Get session from cookies
    const sessionResult = await supabase.auth.getSession();
    const session = sessionResult.data?.session;
    const sessionError = sessionResult.error;

    if (sessionError || !session) {
      return NextResponse.json(
        { 
          success: false,
          code: "NO_SESSION",
          message: "No active session"
        },
        { status: 401 }
      );
    }

    return RequestContext.run(
      { correlationId: crypto.randomUUID(), requestId: crypto.randomUUID() },
      async () => {
        const getConversationsUseCase = appContainer.resolve<GetConversationsUseCase>("GetConversationsUseCase");
        const result = await getConversationsUseCase.execute({ userId: session.user.id });

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

        const data = result.unwrap();

        return NextResponse.json({
          success: true,
          data: data.conversations,
        });
      }
    );
  } catch (error: any) {
    console.error("[API/Copilot/Conversations] Error:", error);
    return NextResponse.json({ 
      success: false,
      code: "INTERNAL_ERROR",
      message: "Internal server error"
    }, { status: 500 });
  }
}
