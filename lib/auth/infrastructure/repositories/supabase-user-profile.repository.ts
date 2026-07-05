import { Result, ok, fail } from "@/lib/core/result";
import { InfrastructureError } from "@/lib/core/result/errors";
import { UserProfileRepositoryPort, UserProfileData } from "../../ports/repositories/UserProfileRepositoryPort";
import { UserId } from "../../domain/value-objects/user-id.vo";
import { createAdminClientSupabase } from "@/lib/supabase/admin";

export class SupabaseUserProfileRepository implements UserProfileRepositoryPort {
  private supabase = createAdminClientSupabase();

  async updateProfile(userId: UserId, data: UserProfileData): Promise<Result<void>> {
    try {
      const { error } = await this.supabase
        .from("profiles")
        .upsert({
          user_id: userId.value,
          display_name: data.displayName,
          avatar: data.avatar ?? null,
          bio: data.bio ?? null,
          location: data.location ?? null,
          website: data.website ?? null,
          updated_at: new Date().toISOString(),
        }, { onConflict: "user_id" });

      if (error) {
        return fail(new InfrastructureError(`Failed to update profile: ${error.message}`));
      }

      return ok(undefined);
    } catch (error: any) {
      return fail(new InfrastructureError(`Unexpected error updating profile: ${error.message}`));
    }
  }

  async getProfile(userId: UserId): Promise<Result<UserProfileData | null>> {
    try {
      const { data, error } = await this.supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId.value)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          return ok(null);
        }
        return fail(new InfrastructureError(`Failed to get profile: ${error.message}`));
      }

      if (!data) {
        return ok(null);
      }

      const profile: UserProfileData = {
        displayName: data.display_name,
        avatar: data.avatar ?? undefined,
        bio: data.bio ?? undefined,
        location: data.location ?? undefined,
        website: data.website ?? undefined,
      };

      return ok(profile);
    } catch (error: any) {
      return fail(new InfrastructureError(`Unexpected error getting profile: ${error.message}`));
    }
  }
}
