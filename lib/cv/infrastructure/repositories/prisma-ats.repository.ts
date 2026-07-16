import { prisma } from "@/lib/prisma";
import { Result, ok, fail } from "@/lib/core/result";
import { InfrastructureError } from "@/lib/core/result/errors";
import { AtsAnalysisEntity } from "../../domain/entities/cv.entity";
import { AtsRepositoryPort } from "../../ports/ats-repository.port";

type AtsCVData = {
  cvId: string;
  strengths: string[];
  weaknesses: string[];
};

type AtsKeywords = {
  matched: string[];
  missing: string[];
};

function isAtsCVData(data: unknown): data is AtsCVData {
  return (
    typeof data === "object" &&
    data !== null &&
    "cvId" in data &&
    "strengths" in data &&
    "weaknesses" in data
  );
}

function isAtsKeywords(data: unknown): data is AtsKeywords {
  return (
    typeof data === "object" &&
    data !== null &&
    "matched" in data &&
    "missing" in data
  );
}

export class PrismaAtsRepository implements AtsRepositoryPort {
  async saveAnalysis(analysis: Omit<AtsAnalysisEntity, "id" | "createdAt">): Promise<Result<AtsAnalysisEntity>> {
    try {
      const cvData: AtsCVData = {
        cvId: analysis.cvId,
        strengths: analysis.strengths,
        weaknesses: analysis.weaknesses,
      };

      const keywords: AtsKeywords = {
        matched: analysis.matchedKeywords,
        missing: analysis.missingKeywords,
      };

      const created = await prisma.cVAnalysis.create({
        data: {
          userId: analysis.userId,
          fileName: "unknown",
          originalText: "",
          optimizedText: "",
          cvData: cvData as any,
          atsScoreBefore: analysis.scoreBefore,
          atsScoreAfter: analysis.scoreAfter,
          improvements: analysis.recommendations,
          keywords: keywords as any,
        },
      });

      const savedCvData = created.cvData;
      if (!isAtsCVData(savedCvData)) {
        return fail(new InfrastructureError("Invalid CV data structure"));
      }

      const savedKeywords = created.keywords;
      if (!isAtsKeywords(savedKeywords)) {
        return fail(new InfrastructureError("Invalid keywords structure"));
      }

      return ok({
        id: created.id,
        cvId: savedCvData.cvId,
        userId: created.userId,
        scoreBefore: created.atsScoreBefore || undefined,
        scoreAfter: created.atsScoreAfter || undefined,
        matchedKeywords: savedKeywords.matched,
        missingKeywords: savedKeywords.missing,
        strengths: savedCvData.strengths,
        weaknesses: savedCvData.weaknesses,
        recommendations: (created.improvements as string[]) || [],
        createdAt: created.createdAt,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to save analysis";
      return fail(new InfrastructureError(message));
    }
  }

  async getLatestAnalysis(cvId: string): Promise<Result<AtsAnalysisEntity>> {
    try {
      const latest = await prisma.cVAnalysis.findFirst({
        orderBy: { createdAt: "desc" },
      });

      if (!latest) return fail(new InfrastructureError("Analysis not found"));

      const cvData = latest.cvData;
      if (!isAtsCVData(cvData)) {
        return fail(new InfrastructureError("Invalid CV data structure"));
      }

      const keywords = latest.keywords;
      if (!isAtsKeywords(keywords)) {
        return fail(new InfrastructureError("Invalid keywords structure"));
      }

      return ok({
        id: latest.id,
        cvId: cvData.cvId,
        userId: latest.userId,
        scoreBefore: latest.atsScoreBefore || undefined,
        scoreAfter: latest.atsScoreAfter || undefined,
        matchedKeywords: keywords.matched,
        missingKeywords: keywords.missing,
        strengths: cvData.strengths,
        weaknesses: cvData.weaknesses,
        recommendations: (latest.improvements as string[]) || [],
        createdAt: latest.createdAt,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to get analysis";
      return fail(new InfrastructureError(message));
    }
  }
}
