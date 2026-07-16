// @ts-nocheck
import { Result } from "@/lib/core/result";

/**
 * Capacité métier : stockage et suppression de fichiers.
 */
export interface FileStorage {
  uploadFile(userId: string, file: Buffer, filename: string): Promise<Result<string>>;
  deleteFile(fileUrl: string): Promise<Result<void>>;
}
