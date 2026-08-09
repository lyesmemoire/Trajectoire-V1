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
import { rateLimit } from "@/lib/rate-limiting/rate-limit.middleware";
import { RouteType, RateLimitScope } from "@/lib/rate-limiting/centralized-rate-limit.service";
import { csrfProtect } from "@/lib/security/csrf-middleware";

const ENABLE_SIL_BILLING = process.env.ENABLE_SIL_BILLING === 'true';
const SIL_MESSAGE_COST = 5; // credits per message

export const POST = csrfProtect(
  rateLimit(
    RouteType.SIMULATION,
    async (request: NextRequest) => {
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
        return ApiResponseBuilder.badRequest("Invalid input data");
      }

      const validatedData = validationResult.data;

      const idempotencyService = new IdempotencyService();
      const effectiveIdempKey = idempotencyKey || `sil-message-${user.id}-${Date.now()}`;

      const sendWithBilling = async () => {
        if (ENABLE_SIL_BILLING) {
          const reserveResult = await BillingService.reserveCredits({
            userId: user.id,
            amount: SIL_MESSAGE_COST,
            action: "sil_message" as any,
            operationId: effectiveIdempKey,
          });

          if (!reserveResult.success) {
            throw new Error(`BILLING_ERROR:${reserveResult.error}`);
          }

          const conversationService = await Container.get<ConversationService>(
            ServiceTokens.ConversationService
          );

          const result = await conversationService.sendMessage({
            userId: user.id,
            sessionId: validatedData.sessionId,
            content: validatedData.content,
          });

          await BillingService.commitCredits(reserveResult.txId!, 0);

          return { resultRef: result.messageId, data: result } as any;
        } else {
          const conversationService = await Container.get<ConversationService>(
            ServiceTokens.ConversationService
          );

          const result = await conversationService.sendMessage({
            userId: user.id,
            sessionId: validatedData.sessionId,
            content: validatedData.content,
          });
          return { resultRef: result.messageId, data: result } as any;
        }
      };

      const result = await idempotencyService.execute(
        effectiveIdempKey,
        user.id,
        "sil_message",
        { sessionId: validatedData.sessionId },
        sendWithBilling,
        async (resultRef: string) => {
          // Reload from DB on Cache HIT
          const conversationService = await Container.get<ConversationService>(
            ServiceTokens.ConversationService
          );
          const messages = await conversationService.getMessages(validatedData.sessionId, user.id);
          return { resultRef, data: messages };
        }
      );

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
    },
    { scopes: [RateLimitScope.USER, RateLimitScope.IP] }
  )
);
