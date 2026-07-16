// @ts-nocheck
import { Result } from "@/lib/core/result";
import { UserEntity, UserProfileEntity } from "../domain/entities/user.entity";

export interface UserRepositoryPort {
  findById(id: string): Promise<Result<{ user: UserEntity; profile: UserProfileEntity }>>;
  findByEmail(email: string): Promise<Result<{ user: UserEntity; profile: UserProfileEntity }>>;
  save(user: UserEntity, profile: UserProfileEntity): Promise<Result<void>>;
  updateProfile(userId: string, data: Partial<UserProfileEntity>): Promise<Result<UserProfileEntity>>;
  delete(userId: string): Promise<Result<void>>;
}
