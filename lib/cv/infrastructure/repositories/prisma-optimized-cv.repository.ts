import { prisma } from "@/lib/prisma";
import { Result, ok, fail } from "@/lib/core/result";
import { InfrastructureError } from "@/lib/core/result/errors";
import { OptimizedCvEntity } from "../../domain/entities/cv.entity";
import { OptimizedCvRepositoryPort } from "../../ports/optimized-cv-repository.port";

type OptimizedCvCVData = {
  cvId: string;
  type: "optimized_cv";
  version: number;
  atsContext?: string;
};

function isOptimizedCvCVData(data: unknown): data is OptimizedCvCVData {
  return (
    typeof data === "object" &&
    data !== null &&
    "cvId" in data &&
    "type" in data &&
    "version" in data
  );
}

export class PrismaOptimizedCvRepository implements OptimizedCvRepositoryPort {
  async saveOptimizedCv(cv: Omit<OptimizedCvEntity, "id" | "createdAt">): Promise<Result<OptimizedCvEntity>> {
    try {
      const cvData: OptimizedCvCVData = {
        cvId: cv.cvId,
        type: "optimized_cv",
        version: cv.version,
        atsContext: cv.atsContext,
      };

      const created = await prisma.cVAnalysis.create({
        data: {
          userId: cv.userId,
          fileName: "optimized_cv",
          originalText: "",
          optimizedText: cv.text,
          cvData: cvData as any,
          atsScoreBefore: undefined,
          atsScoreAfter: undefined,
          improvements: undefined,
          keywords: undefined,
        },
      });

      const savedCvData = created.cvData;
      if (!isOptimizedCvCVData(savedCvData)) {
        return fail(new InfrastructureError("Invalid CV data structure"));
      }

      return ok({
        id: created.id,
        cvId: savedCvData.cvId,
        userId: created.userId,
        version: savedCvData.version,
        text: created.optimizedText || cv.text,
        atsContext: savedCvData.atsContext,
        createdAt: created.createdAt,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to save optimized CV";
      return fail(new InfrastructureError(message));
    }
  }

  async getLatestOptimizedCv(cvId: string): Promise<Result<OptimizedCvEntity>> {
    try {
      const latest = await prisma.cVAnalysis.findFirst({
        where: {
          fileName: "optimized_cv",
        },
        orderBy: { createdAt: "desc" },
      });

      if (!latest) return fail(new InfrastructureError("Optimized CV not found"));

      const cvData = latest.cvData;
      if (!isOptimizedCvCVData(cvData)) {
        return fail(new InfrastructureError("Invalid CV data structure"));
      }

      return ok({
        id: latest.id,
        cvId: cvData.cvId,
        userId: latest.userId,
        version: cvData.version,
        text: latest.optimizedText || "",
        atsContext: cvData.atsContext,
        createdAt: latest.createdAt,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to get optimized CV";
      return fail(new InfrastructureError(message));
    }
  }
}
