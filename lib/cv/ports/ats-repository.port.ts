import { Result } from "@/lib/core/result";
import { AtsAnalysisEntity } from "../domain/entities/cv.entity";

export interface AtsRepositoryPort {
  saveAnalysis(analysis: Omit<AtsAnalysisEntity, "id" | "createdAt">): Promise<Result<AtsAnalysisEntity>>;
  getLatestAnalysis(cvId: string): Promise<Result<AtsAnalysisEntity>>;
}
