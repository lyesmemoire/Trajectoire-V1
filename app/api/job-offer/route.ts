import { NextRequest, NextResponse } from "next/server";
import { getStrictUser } from "@/lib/auth/get-user";
import { createApiHandler } from "@/lib/core/api/handler";
import { z } from "zod";
import { createJourneyUseCase } from "@/modules/candidate-journey/composition/journey.factory";
import { RequestContext } from "@/lib/core/runtime/context/RequestContext";

export const dynamic = "force-dynamic";

const JobOfferRequestSchema = z.object({
  description: z.string().min(10).max(10000),
  source: z.string().optional(),
  sourceType: z.enum(["URL_LINKEDIN", "URL_INDEED", "URL_WTTJ", "RAW_TEXT"]).optional(),
});

export const POST = createApiHandler({
  schema: JobOfferRequestSchema,
  requireAuth: true,
  handler: async ({ input, user }) => {
    return RequestContext.run(
      { userId: user!.id, correlationId: crypto.randomUUID(), requestId: crypto.randomUUID() },
      async () => {
        const journeyUseCase = createJourneyUseCase();
        
        // Generate a journey ID for this job offer upload
        const journeyId = crypto.randomUUID();
        
        const result = await journeyUseCase.uploadJobOffer(journeyId, {
          description: input.description,
          source: input.source,
          sourceType: input.sourceType,
        });

        if (result.isFailure()) {
          throw result.unwrapError();
        }

        return { journeyId };
      }
    );
  }
});
