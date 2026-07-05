import { Result } from "@/lib/core/result";
import { UserId } from "../../domain/value-objects/user-id.vo";

export interface UserProfileData {
  displayName: string;
  avatar?: string;
  bio?: string;
  location?: string;
  website?: string;
}

export interface UserProfileRepositoryPort {
  updateProfile(userId: UserId, data: UserProfileData): Promise<Result<void>>;
  getProfile(userId: UserId): Promise<Result<UserProfileData | null>>;
}
