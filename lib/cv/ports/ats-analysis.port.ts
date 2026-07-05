import { Result } from "@/lib/core/result";
import { AtsAnalysisEntity } from "../domain/entities/cv.entity";

export interface AtsAnalysisPort {
  analyzeCv(text: string, jobDescription?: string): Promise<Result<Omit<AtsAnalysisEntity, "id" | "cvId" | "userId" | "createdAt">>>;
}
