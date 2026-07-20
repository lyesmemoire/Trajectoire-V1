import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { Container, ServiceTokens } from "@/infrastructure/di";
import { initializeContainer } from "@/infrastructure/di/bootstrap";
import { ConversationService } from "@/application/services";
import { AuthenticationError, ValidationError } from "@/core/errors";
import { ApiResponseBuilder } from "@/core/http";
import { SendMessageSchema } from "@/validation";
import { IdempotencyService } from "@/core/idempotency/IdempotencyService";

export async function POST(request: NextRequest) {
  try {
    // Initialize DI container
    initializeContainer();

    // Authenticate user
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return ApiResponseBuilder.unauthorized();
    }

    // Get idempotency key from headers
    const idempotencyKey = request.headers.get("Idempotency-Key");
    if (!idempotencyKey) {
      // Idempotency key is optional for now, but recommended
      // For production, you might want to make it required
    }

    // Parse form data
    const formData = await request.formData();
    const rawData = {
      sessionId: formData.get("sessionId") as string,
      content: formData.get("content") as string,
    };

    // Validate with Zod
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

    // Resolve service
    const conversationService = await Container.resolve(ServiceTokens.ConversationService) as ConversationService;

    // Execute command with idempotency if key is provided
    let result;
    if (idempotencyKey) {
      const idempotencyService = new IdempotencyService();
      result = await idempotencyService.execute(
        idempotencyKey,
        user.id,
        "message_send",
        validatedData,
        () => conversationService.sendMessage({
          userId: user.id,
          sessionId: validatedData.sessionId,
          content: validatedData.content,
        })
      );
    } else {
      result = await conversationService.sendMessage({
        userId: user.id,
        sessionId: validatedData.sessionId,
        content: validatedData.content,
      });
    }

    // Redirect to conversation page
    return NextResponse.redirect(new URL(`/simulation/${validatedData.sessionId}`, request.url));
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return ApiResponseBuilder.unauthorized();
    }

    return ApiResponseBuilder.fromError(error);
  }
}
