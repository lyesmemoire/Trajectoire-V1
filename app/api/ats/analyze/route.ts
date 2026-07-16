import { NextRequest, NextResponse } from "next/server";
import { getStrictUser } from "@/lib/auth/get-user";
import { createApiHandler } from "@/lib/core/api/handler";
import { z } from "zod";
import { MistralAtsAnalysisAdapter } from "@/lib/cv/infrastructure/adapters/mistral-ats-analysis.adapter";
import { PrismaAtsRepository } from "@/lib/cv/infrastructure/repositories/prisma-ats.repository";
import { RequestContext } from "@/lib/core/runtime/context/RequestContext";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const AtsAnalyzeRequestSchema = z.object({
  cvId: z.string().uuid(),
  jobOfferId: z.string().uuid().optional(),
  jobDescription: z.string().optional(),
});

export const POST = createApiHandler({
  schema: AtsAnalyzeRequestSchema,
  requireAuth: true,
  handler: async ({ input, user }) => {
    return RequestContext.run(
      { userId: user!.id, correlationId: crypto.randomUUID(), requestId: crypto.randomUUID() },
      async () => {
        // 1. Récupérer CV text
        const cv = await (prisma as any).cVAnalysis.findFirst({
          where: { 
            id: input.cvId,
            userId: user!.id 
          },
        });

        if (!cv) {
          throw new Error("CV not found");
        }

        let jobDescription = input.jobDescription;

        // 2. Si jobOfferId fourni, récupérer la description depuis JobOffer
        if (input.jobOfferId && !jobDescription) {
          const jobOffer = await (prisma as any).jobOffer.findFirst({
            where: { 
              id: input.jobOfferId,
              userId: user!.id 
            },
          });

          if (jobOffer) {
            jobDescription = jobOffer.description;
          }
        }

        // 3. Appeler le moteur ATS existant
        const atsAdapter = new MistralAtsAnalysisAdapter();
        const result = await atsAdapter.analyzeCv(cv.originalText, jobDescription);

        if (result.isFailure()) {
          throw result.unwrapError();
        }

        const atsResult = result.unwrap();

        // 4. Persister le résultat
        const atsRepository = new PrismaAtsRepository();
        await atsRepository.saveAnalysis({
          cvId: input.cvId,
          userId: user!.id,
          scoreBefore: cv.atsScoreBefore,
          scoreAfter: atsResult.score,
          matchedKeywords: atsResult.matchedKeywords,
          missingKeywords: atsResult.missingKeywords,
          strengths: atsResult.strengths,
          weaknesses: atsResult.weaknesses,
          recommendations: atsResult.recommendations,
        });

        // 5. Retourner le résultat
        return {
          score: atsResult.score,
          matchedKeywords: atsResult.matchedKeywords,
          missingKeywords: atsResult.missingKeywords,
          strengths: atsResult.strengths,
          weaknesses: atsResult.weaknesses,
          recommendations: atsResult.recommendations,
        };
      }
    );
  }
});
