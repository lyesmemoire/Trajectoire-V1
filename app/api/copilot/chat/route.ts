import { NextRequest, NextResponse } from "next/server";
import { RequestContext } from "@/lib/core/runtime/context/RequestContext";
import { appContainer } from "@/lib/core/runtime/container/app-container";
import { SendMessageUseCase } from "@/modules/copilot/application/use-cases/send-message.use-case";
import { ErrorHttpMapper } from "@/lib/core/result/errors/ErrorHttpMapper";
import { createServerClientSupabase } from "@/lib/supabase/server";
import { z } from "zod";

export const dynamic = "force-dynamic";

const ChatRequestSchema = z.object({
  content: z.string().min(1, "Message cannot be empty"),
  conversationId: z.string().optional(),
});

export async function POST(req: NextRequest) {
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

    const body = await req.json();
    const input = ChatRequestSchema.parse(body);

    return RequestContext.run(
      { correlationId: crypto.randomUUID(), requestId: crypto.randomUUID() },
      async () => {
        const sendMessageUseCase = appContainer.resolve<SendMessageUseCase>("SendMessageUseCase");
        const result = await sendMessageUseCase.execute({
          userId: session.user.id,
          conversationId: input.conversationId,
          content: input.content,
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

        const data = result.unwrap();

        return NextResponse.json({
          success: true,
          data: {
            conversationId: data.conversationId,
            message: data.message,
          },
        });
      }
    );
  } catch (error: any) {
    console.error("[API/Copilot/Chat] Error:", error);
    return NextResponse.json({ 
      success: false,
      code: "INTERNAL_ERROR",
      message: "Internal server error"
    }, { status: 500 });
  }
}
