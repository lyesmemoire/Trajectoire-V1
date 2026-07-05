import { getServerDb } from "@/lib/db/client";
import { Result, ok, fail } from "@/lib/core/result";
import { InfrastructureError } from "@/lib/core/result/errors";
import { CvStorageGateway } from "../../ports/gateways/cv-storage.gateway";

export class SupabaseStorageAdapter implements CvStorageGateway {
  async uploadFile(userId: string, file: Buffer, filename: string): Promise<Result<string>> {
    try {
      const supabase = await getServerDb();
      const path = `${userId}/${Date.now()}_${filename}`;
      
      const { data, error } = await supabase.storage
        .from("cv_files")
        .upload(path, file, { contentType: "application/pdf", upsert: true });

      if (error) return fail(new InfrastructureError(error.message));

      const { data: publicUrlData } = supabase.storage.from("cv_files").getPublicUrl(path);
      return ok(publicUrlData.publicUrl);
    } catch (error: any) {
      return fail(new InfrastructureError(error.message || "Failed to upload file"));
    }
  }

  async deleteFile(fileUrl: string): Promise<Result<void>> {
    try {
      const supabase = await getServerDb();
      // Extract path from public URL
      const pathParts = fileUrl.split("/cv_files/");
      if (pathParts.length < 2 || !pathParts[1]) return fail(new InfrastructureError("Invalid file URL"));
      
      const path = pathParts[1];
      const { error } = await supabase.storage.from("cv_files").remove([path]);

      if (error) return fail(new InfrastructureError(error.message));
      return ok(undefined);
    } catch (error: any) {
      return fail(new InfrastructureError(error.message || "Failed to delete file"));
    }
  }
}
