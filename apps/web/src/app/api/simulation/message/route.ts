import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { Container, ServiceTokens } from "@/infrastructure/di";
import { initializeContainer } from "@/infrastructure/di/bootstrap";
import { ConversationService } from "@/application/services";
import { AuthenticationError, ValidationError } from "@/core/errors";
import { ApiResponseBuilder } from "@/core/http";
import { SendMessageSchema } from "@/validation";
import { IdempotencyService } from "@/core/idempotency/IdempotencyService";
import { BillingService } from "@/lib/db/billing.service";

const ENABLE_SIL_BILLING = process.env.ENABLE_SIL_BILLING === 'true';
const SIL_MESSAGE_COST = 5; // credits per message

export async function POST(request: NextRequest) {
  try {
    initializeContainer();

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return ApiResponseBuilder.unauthorized();
    }

    const idempotencyKey = request.headers.get("Idempotency-Key");

    const formData = await request.formData();
    const rawData = {
      sessionId: formData.get("sessionId") as string,
      content: formData.get("content") as string,
    };

    const validationResult = SendMessageSchema.safeParse(rawData);
    if (!validationResult.success) {
      const fieldErrors = validationResult.error.flatten().fieldErrors;
      const validationFields: Array<{ field: string; message: string }> = [];
      
      for (const [field, messages] of Object.entries(fieldErrors)) {
        if (messages && messages.length > 0) {
          validationFields.push({ field, message: messages[0] });
        }
      }
      
      throw new ValidationError("Invalid input data", validationFields);
    }

    const validatedData = validationResult.data;
    const conversationService = await Container.resolve(ServiceTokens.ConversationService) as ConversationService;

    const sendWithBilling = async () => {
      let txId: string | undefined;
      const opKey = idempotencyKey || `sil-msg-${user.id}-${validatedData.sessionId}-${Date.now()}`;

      // Reserve
      if (ENABLE_SIL_BILLING) {
        const reserve = await BillingService.reserveCredits({
          userId: user.id,
          amount: SIL_MESSAGE_COST,
          action: "sil_message" as any,
          operationId: opKey,
        });
        if (!reserve.success) {
          throw new Error(`BILLING_ERROR:${reserve.error}`);
        }
        txId = reserve.txId;
      }

      try {
        const data = await conversationService.sendMessage({
          userId: user.id,
          sessionId: validatedData.sessionId,
          content: validatedData.content,
        });

        // Commit
        if (txId) {
          await BillingService.commitCredits(txId, 0);
        }

        return data;
      } catch (err: any) {
        // Rollback
        if (txId) {
          await BillingService.rollbackCredits(txId, err.message || "LLM failure");
        }
        throw err;
      }
    };

    let result;
    if (idempotencyKey) {
      const idempotencyService = new IdempotencyService();
      result = await idempotencyService.execute(
        idempotencyKey,
        user.id,
        "message_send",
        validatedData,
        async () => {
          const data = await sendWithBilling();
          return { resultRef: data.messageId, data };
        },
        async (resultRef) => ({
          messageId: resultRef,
          aiResponse: "",
          messageCount: 0,
        })
      );
    } else {
      result = await sendWithBilling();
    }

    return NextResponse.redirect(new URL(`/simulation/${validatedData.sessionId}`, request.url));
  } catch (error: any) {
    if (error instanceof AuthenticationError) {
      return ApiResponseBuilder.unauthorized();
    }
    if (error?.message?.startsWith("BILLING_ERROR:")) {
      return ApiResponseBuilder.badRequest("Crédits insuffisants");
    }
    return ApiResponseBuilder.fromError(error);
  }
}
