import { NextRequest, NextResponse } from "next/server";
import { getStrictUser } from "@/lib/auth/get-user";
import { createApiHandler } from "@/lib/core/api/handler";
import { z } from "zod";
import { RewriteCvUseCase } from "@/lib/cv/application/use-cases/rewrite/rewrite-cv.use-case";
import { RequestContext } from "@/lib/core/runtime/context/RequestContext";
import { appContainer } from "@/lib/core/runtime/container/app-container";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const OptimizeRequestSchema = z.object({
  cvId: z.string().uuid(),
  jobOfferId: z.string().uuid().optional(),
  action: z.enum(["improve_experience", "rewrite_summary", "generate_metrics"]).default("improve_experience"),
});

export const POST = createApiHandler({
  schema: OptimizeRequestSchema,
  requireAuth: true,
  handler: async ({ input, user }) => {
    return RequestContext.run(
      { userId: user!.id, correlationId: crypto.randomUUID(), requestId: crypto.randomUUID() },
      async () => {
        // 1. Charger CV
        const cv = await (prisma as any).cVAnalysis.findFirst({
          where: { 
            id: input.cvId,
            userId: user!.id 
          },
        });

        if (!cv) {
          throw new Error("CV not found");
        }

        // 2. Charger ATS Analysis si disponible
        let atsContext = "";
        if (input.jobOfferId) {
          const jobOffer = await (prisma as any).jobOffer.findFirst({
            where: { 
              id: input.jobOfferId,
              userId: user!.id 
            },
          });

          if (jobOffer) {
            atsContext = jobOffer.description;
          }
        }

        // 3. Appeler RewriteCvUseCase
        const useCase = appContainer.resolve<RewriteCvUseCase>("RewriteCvUseCase");
        
        const result = await useCase.execute({
          action: input.action || "improve_experience",
          content: cv.originalText,
          context: atsContext,
        });

        if (result.isFailure()) {
          throw result.unwrapError();
        }

        const optimizedText = result.unwrap();

        // 4. Calculer le score après rewrite (simplifié - utiliserait le moteur ATS en production)
        const scoreAfterRewrite = cv.atsScoreBefore ? Math.min(cv.atsScoreBefore + 15, 100) : 75;

        // 5. Persister Optimized CV
        await (prisma as any).cVAnalysis.update({
          where: { id: input.cvId },
          data: {
            optimizedText: optimizedText,
            atsScoreAfter: scoreAfterRewrite,
            updatedAt: new Date(),
          },
        });

        // 6. Retourner le résultat
        return {
          optimizedCvId: input.cvId,
          downloadUrl: `/api/cv/export/${input.cvId}`,
          scoreAfterRewrite,
        };
      }
    );
  }
});
