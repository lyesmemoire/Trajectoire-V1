// @ts-nocheck
import { Result } from "@/lib/core/result";
import { CvEntity } from "../domain/entities/cv.entity";

export interface CvRepositoryPort {
  create(userId: string, originalText?: string, pdfUrl?: string): Promise<Result<CvEntity>>;
  findById(cvId: string): Promise<Result<CvEntity>>;
  findByUserId(userId: string): Promise<Result<CvEntity[]>>;
  update(cvId: string, data: Partial<CvEntity>): Promise<Result<CvEntity>>;
  delete(cvId: string): Promise<Result<void>>;
}
