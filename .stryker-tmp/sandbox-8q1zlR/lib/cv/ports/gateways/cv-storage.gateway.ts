// @ts-nocheck
import { Result } from "@/lib/core/result";

export interface CvStorageGateway {
  /**
   * Uploads a file to storage and returns its URL.
   */
  uploadFile(userId: string, file: Buffer, filename: string): Promise<Result<string>>;
}
