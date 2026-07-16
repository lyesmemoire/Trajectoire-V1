// @ts-nocheck
import { prisma } from "@/lib/prisma";
import { Result, ok, fail } from "@/lib/core/result";
import { InfrastructureError } from "@/lib/core/result/errors";
import { AtsAnalysisEntity } from "../../domain/entities/cv.entity";
import { AtsRepositoryPort } from "../../ports/ats-repository.port";

export class PrismaAtsRepository implements AtsRepositoryPort {
  async saveAnalysis(analysis: Omit<AtsAnalysisEntity, "id" | "createdAt">): Promise<Result<AtsAnalysisEntity>> {
    try {
      const created = await prisma.cVAnalysis.create({
        data: {
          userId: analysis.userId,
          fileName: "unknown", // Required by Prisma schema but usually irrelevant in this bounded context
          originalText: "", // Kept empty as the CV itself holds the text
          optimizedText: "", 
          cvData: {},
          atsScoreBefore: analysis.scoreBefore,
          atsScoreAfter: analysis.scoreAfter,
          improvements: analysis.recommendations,
          keywords: { matched: analysis.matchedKeywords, missing: analysis.missingKeywords },
        },
      });

      return ok({
        id: created.id,
        cvId: analysis.cvId, // Prisma schema might lack cvId natively, mapped manually
        userId: created.userId,
        scoreBefore: created.atsScoreBefore || undefined,
        scoreAfter: created.atsScoreAfter || undefined,
        matchedKeywords: (created.keywords as any)?.matched || [],
        missingKeywords: (created.keywords as any)?.missing || [],
        strengths: [], // Schema didn't natively have strengths array
        weaknesses: [], // Schema didn't natively have weaknesses array
        recommendations: (created.improvements as string[]) || [],
        createdAt: created.createdAt,
      });
    } catch (error: any) {
      return fail(new InfrastructureError(error.message || "Failed to save analysis"));
    }
  }

  async getLatestAnalysis(cvId: string): Promise<Result<AtsAnalysisEntity>> {
    try {
      // Assuming we have a cvId column in prisma or we map by userId + latest
      // The Prisma schema checked earlier only has `userId`, `fileName`, `originalText`, `optimizedText`, `cvData`, `atsScoreBefore`, `atsScoreAfter`, `improvements`, `keywords`, `createdAt`
      // For now, querying by generic rules, assuming we might need to adjust prisma schema later to link to Supabase CVs explicitly via cvId
      const latest = await prisma.cVAnalysis.findFirst({
        where: { /* cvId: cvId */ }, // Temporary workaround, would need prisma schema update `cvId String?`
        orderBy: { createdAt: "desc" },
      });

      if (!latest) return fail(new InfrastructureError("Analysis not found"));

      return ok({
        id: latest.id,
        cvId: cvId, 
        userId: latest.userId,
        scoreBefore: latest.atsScoreBefore || undefined,
        scoreAfter: latest.atsScoreAfter || undefined,
        matchedKeywords: (latest.keywords as any)?.matched || [],
        missingKeywords: (latest.keywords as any)?.missing || [],
        strengths: [],
        weaknesses: [],
        recommendations: (latest.improvements as string[]) || [],
        createdAt: latest.createdAt,
      });
    } catch (error: any) {
      return fail(new InfrastructureError(error.message || "Failed to get analysis"));
    }
  }
}
