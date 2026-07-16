import { Result } from "@/lib/core/result";
import { OptimizedCvEntity } from "../domain/entities/cv.entity";

export interface OptimizedCvRepositoryPort {
  saveOptimizedCv(cv: Omit<OptimizedCvEntity, "id" | "createdAt">): Promise<Result<OptimizedCvEntity>>;
  getLatestOptimizedCv(cvId: string): Promise<Result<OptimizedCvEntity>>;
}
