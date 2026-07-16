import { prisma } from "@/lib/prisma";
import { Result, ok, fail } from "@/lib/core/result";
import { InfrastructureError } from "@/lib/core/result/errors";
import { ProfileExtractionEntity } from "../../domain/entities/cv.entity";
import { ProfileExtractionRepositoryPort } from "../../ports/profile-extraction-repository.port";

type ProfileExtractionCVData = {
  cvId: string;
  type: "profile_extraction";
  skills: string[];
  experiences: Array<{
    title: string;
    company: string;
    duration: string;
    description?: string;
  }>;
  languages: Array<{
    language: string;
    level: string;
  }>;
  certifications: string[];
  summary: string;
  detectedProfession: string;
};

function isProfileExtractionCVData(data: unknown): data is ProfileExtractionCVData {
  return (
    typeof data === "object" &&
    data !== null &&
    "cvId" in data &&
    "type" in data &&
    "skills" in data &&
    "experiences" in data &&
    "languages" in data &&
    "certifications" in data &&
    "summary" in data &&
    "detectedProfession" in data
  );
}

export class PrismaProfileExtractionRepository implements ProfileExtractionRepositoryPort {
  async saveExtraction(extraction: Omit<ProfileExtractionEntity, "id" | "createdAt">): Promise<Result<ProfileExtractionEntity>> {
    try {
      const cvData: ProfileExtractionCVData = {
        cvId: extraction.cvId,
        type: "profile_extraction",
        skills: extraction.skills,
        experiences: extraction.experiences,
        languages: extraction.languages,
        certifications: extraction.certifications,
        summary: extraction.summary,
        detectedProfession: extraction.detectedProfession,
      };

      const created = await prisma.cVAnalysis.create({
        data: {
          userId: extraction.userId,
          fileName: "profile_extraction",
          originalText: "",
          optimizedText: "",
          cvData: cvData as any,
          atsScoreBefore: undefined,
          atsScoreAfter: undefined,
          improvements: undefined,
          keywords: undefined,
        },
      });

      const savedCvData = created.cvData;
      if (!isProfileExtractionCVData(savedCvData)) {
        return fail(new InfrastructureError("Invalid CV data structure"));
      }

      return ok({
        id: created.id,
        cvId: savedCvData.cvId,
        userId: created.userId,
        skills: savedCvData.skills,
        experiences: savedCvData.experiences,
        languages: savedCvData.languages,
        certifications: savedCvData.certifications,
        summary: savedCvData.summary,
        detectedProfession: savedCvData.detectedProfession,
        createdAt: created.createdAt,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to save profile extraction";
      return fail(new InfrastructureError(message));
    }
  }

  async getLatestExtraction(cvId: string): Promise<Result<ProfileExtractionEntity>> {
    try {
      const latest = await prisma.cVAnalysis.findFirst({
        where: {
          fileName: "profile_extraction",
        },
        orderBy: { createdAt: "desc" },
      });

      if (!latest) return fail(new InfrastructureError("Profile extraction not found"));

      const cvData = latest.cvData;
      if (!isProfileExtractionCVData(cvData)) {
        return fail(new InfrastructureError("Invalid CV data structure"));
      }

      return ok({
        id: latest.id,
        cvId: cvData.cvId,
        userId: latest.userId,
        skills: cvData.skills,
        experiences: cvData.experiences,
        languages: cvData.languages,
        certifications: cvData.certifications,
        summary: cvData.summary,
        detectedProfession: cvData.detectedProfession,
        createdAt: latest.createdAt,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to get profile extraction";
      return fail(new InfrastructureError(message));
    }
  }
}
