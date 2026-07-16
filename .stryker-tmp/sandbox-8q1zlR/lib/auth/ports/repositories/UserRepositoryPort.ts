// @ts-nocheck
import { Result } from "@/lib/core/result";
import { UserAggregate } from "../../domain/aggregates/user.aggregate";
import { UserId } from "../../domain/value-objects/user-id.vo";
import { Email } from "../../domain/value-objects/email.vo";

export interface UserRepositoryPort {
  save(user: UserAggregate): Promise<Result<void>>;
  findById(id: UserId): Promise<Result<UserAggregate | null>>;
  findByEmail(email: Email): Promise<Result<UserAggregate | null>>;
  delete(id: UserId): Promise<Result<void>>;
  existsByEmail(email: Email): Promise<Result<boolean>>;
}
