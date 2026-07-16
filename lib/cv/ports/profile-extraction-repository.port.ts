import { Result } from "@/lib/core/result";
import { ProfileExtractionEntity } from "../domain/entities/cv.entity";

export interface ProfileExtractionRepositoryPort {
  saveExtraction(extraction: Omit<ProfileExtractionEntity, "id" | "createdAt">): Promise<Result<ProfileExtractionEntity>>;
  getLatestExtraction(cvId: string): Promise<Result<ProfileExtractionEntity>>;
}
