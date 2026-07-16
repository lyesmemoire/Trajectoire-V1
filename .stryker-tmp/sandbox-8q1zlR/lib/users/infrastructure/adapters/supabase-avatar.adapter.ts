// @ts-nocheck
import { getServerDb } from "@/lib/db/client";
import { Result, ok, fail } from "@/lib/core/result";
import { InfrastructureError } from "@/lib/core/result/errors";
import { AvatarStoragePort } from "../../ports/avatar-storage.port";

export class SupabaseAvatarAdapter implements AvatarStoragePort {
  async uploadAvatar(userId: string, file: Buffer, filename: string): Promise<Result<string>> {
    try {
      const supabase = await getServerDb();
      const path = `${userId}/${Date.now()}_${filename}`;
      
      const { data, error } = await supabase.storage
        .from("avatars")
        .upload(path, file, { upsert: true });

      if (error) return fail(new InfrastructureError(error.message));

      const { data: publicUrlData } = supabase.storage.from("avatars").getPublicUrl(path);
      return ok(publicUrlData.publicUrl);
    } catch (error: any) {
      return fail(new InfrastructureError(error.message || "Failed to upload avatar"));
    }
  }

  async deleteAvatar(url: string): Promise<Result<void>> {
    try {
      const supabase = await getServerDb();
      const pathParts = url.split("/avatars/");
      if (pathParts.length < 2 || !pathParts[1]) return fail(new InfrastructureError("Invalid avatar URL"));
      
      const path = pathParts[1];
      const { error } = await supabase.storage.from("avatars").remove([path]);

      if (error) return fail(new InfrastructureError(error.message));
      return ok(undefined);
    } catch (error: any) {
      return fail(new InfrastructureError(error.message || "Failed to delete avatar"));
    }
  }
}
