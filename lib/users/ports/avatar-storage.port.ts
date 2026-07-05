import { Result } from "@/lib/core/result";

export interface AvatarStoragePort {
  uploadAvatar(userId: string, file: Buffer, filename: string): Promise<Result<string>>;
  deleteAvatar(url: string): Promise<Result<void>>;
}
