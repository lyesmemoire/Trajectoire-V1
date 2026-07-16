// @ts-nocheck
import { Result, ok, fail } from "@/lib/core/result";
import { InfrastructureError } from "@/lib/core/result/errors";
import { UserRepositoryPort } from "../../ports/repositories/UserRepositoryPort";
import { UserAggregate } from "../../domain/aggregates/user.aggregate";
import { UserId } from "../../domain/value-objects/user-id.vo";
import { Email } from "../../domain/value-objects/email.vo";
import { UserMapper, UserPersistence } from "../mappers/user.mapper";
import { createAdminClientSupabase } from "@/lib/supabase/admin";
import { Clock } from "@/lib/core/clock/Clock";

export class SupabaseUserRepository implements UserRepositoryPort {
  private supabase = createAdminClientSupabase();

  constructor(private readonly clock: Clock) {}

  async save(user: UserAggregate): Promise<Result<void>> {
    try {
      const persistence = UserMapper.toPersistence(user);
      
      const { error } = await this.supabase
        .from("users")
        .upsert(persistence, { onConflict: "id" });

      if (error) {
        return fail(new InfrastructureError(`Failed to save user: ${error.message}`));
      }

      return ok(undefined);
    } catch (error: any) {
      return fail(new InfrastructureError(`Unexpected error saving user: ${error.message}`));
    }
  }

  async findById(id: UserId): Promise<Result<UserAggregate | null>> {
    try {
      const { data, error } = await this.supabase
        .from("users")
        .select("*")
        .eq("id", id.value)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          return ok(null);
        }
        return fail(new InfrastructureError(`Failed to find user: ${error.message}`));
      }

      if (!data) {
        return ok(null);
      }

      const user = UserMapper.toDomain(data as UserPersistence, this.clock);
      return ok(user);
    } catch (error: any) {
      return fail(new InfrastructureError(`Unexpected error finding user: ${error.message}`));
    }
  }

  async findByEmail(email: Email): Promise<Result<UserAggregate | null>> {
    try {
      const { data, error } = await this.supabase
        .from("users")
        .select("*")
        .eq("email", email.value)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          return ok(null);
        }
        return fail(new InfrastructureError(`Failed to find user by email: ${error.message}`));
      }

      if (!data) {
        return ok(null);
      }

      const user = UserMapper.toDomain(data as UserPersistence, this.clock);
      return ok(user);
    } catch (error: any) {
      return fail(new InfrastructureError(`Unexpected error finding user by email: ${error.message}`));
    }
  }

  async delete(id: UserId): Promise<Result<void>> {
    try {
      const { error } = await this.supabase
        .from("users")
        .delete()
        .eq("id", id.value);

      if (error) {
        return fail(new InfrastructureError(`Failed to delete user: ${error.message}`));
      }

      return ok(undefined);
    } catch (error: any) {
      return fail(new InfrastructureError(`Unexpected error deleting user: ${error.message}`));
    }
  }

  async existsByEmail(email: Email): Promise<Result<boolean>> {
    try {
      const { data, error } = await this.supabase
        .from("users")
        .select("id")
        .eq("email", email.value)
        .limit(1);

      if (error) {
        return fail(new InfrastructureError(`Failed to check email existence: ${error.message}`));
      }

      return ok(data && data.length > 0);
    } catch (error: any) {
      return fail(new InfrastructureError(`Unexpected error checking email existence: ${error.message}`));
    }
  }
}
