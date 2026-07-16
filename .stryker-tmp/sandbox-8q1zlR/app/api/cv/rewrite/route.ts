// @ts-nocheck
import { createApiHandler } from "@/lib/core/api/handler";
import { z } from "zod";
import { sanitizeInput } from "@/lib/security/sanitize-cv";
import { appContainer } from "@/lib/core/runtime/container/app-container";
import { RewriteCvUseCase } from "@/lib/cv/application/use-cases/rewrite/rewrite-cv.use-case";
import { RequestContext } from "@/lib/core/runtime/context/RequestContext";

export const dynamic = "force-dynamic";

const RewriteRequestSchema = z.object({
  action: z.enum(["improve_experience", "rewrite_summary", "generate_metrics"]),
  content: z.string().min(5).max(3000),
  context: z.string().max(1000).optional(),
});

export const POST = createApiHandler({
  schema: RewriteRequestSchema,
  requireAuth: true,
  handler: async ({ input, user }) => {
    // Run within RequestContext
    return RequestContext.run(
      { userId: user!.id, correlationId: crypto.randomUUID(), requestId: crypto.randomUUID() },
      async () => {
        const sanitizedContent = sanitizeInput(input.content);
        const sanitizedContext = input.context ? sanitizeInput(input.context) : undefined;

        const useCase = appContainer.resolve<RewriteCvUseCase>("RewriteCvUseCase");
        
        const result = await useCase.execute({
          action: input.action,
          content: sanitizedContent,
          context: sanitizedContext,
        });

        if (result.isFailure()) {
          throw result.unwrapError();
        }

        return result.unwrap();
      }
    );
  }
});
