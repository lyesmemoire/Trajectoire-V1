import { getServerDb } from "@/lib/db/client";
import { Result, ok, fail } from "@/lib/core/result";
import { InfrastructureError } from "@/lib/core/result/errors";
import { CVAggregate } from "../../domain/aggregates/cv.aggregate";
import { CvRepositoryPort } from "../../ports/repositories/cv-repository.port";
import { Clock } from "@/lib/core/clock/Clock";

export class SupabaseCvRepository implements CvRepositoryPort {
  constructor(private readonly clock: Clock) {}
  async save(aggregate: CVAggregate): Promise<Result<void>> {
    try {
      const supabase = await getServerDb();
      
      const payload = {
        id: aggregate.id,
        user_id: aggregate.userId,
        title: aggregate.props.title,
        original_text: aggregate.props.originalText,
        optimized_text: aggregate.props.optimizedText,
        pdf_url: aggregate.props.pdfUrl,
        updated_at: aggregate.props.updatedAt.toISOString(),
      };

      const { error } = await supabase
        .from("cvs")
        .upsert(payload)
        .eq("id", aggregate.id);

      if (error) return fail(new InfrastructureError(error.message));
      return ok(undefined);
    } catch (error: any) {
      return fail(new InfrastructureError(error.message || "Failed to save CV"));
    }
  }

  async findById(cvId: string): Promise<Result<CVAggregate>> {
    try {
      const supabase = await getServerDb();
      const { data, error } = await supabase.from("cvs").select("*").eq("id", cvId).single();

      if (error) return fail(new InfrastructureError(error.message));
      if (!data) return fail(new InfrastructureError("CV not found"));

      return ok(CVAggregate.load({
        id: data.id,
        userId: data.user_id,
        title: data.title,
        originalText: data.original_text,
        optimizedText: data.optimized_text,
        pdfUrl: data.pdf_url,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at || data.created_at),
      }, this.clock));
    } catch (error: any) {
      return fail(new InfrastructureError(error.message || "Failed to find CV"));
    }
  }

  async findByUserId(userId: string): Promise<Result<CVAggregate[]>> {
    try {
      const supabase = await getServerDb();
      const { data, error } = await supabase
        .from("cvs")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) return fail(new InfrastructureError(error.message));

      return ok(
        (data || []).map((item: any) => CVAggregate.load({
          id: item.id,
          userId: item.user_id,
          title: item.title,
          originalText: item.original_text,
          optimizedText: item.optimized_text,
          pdfUrl: item.pdf_url,
          createdAt: new Date(item.created_at),
          updatedAt: new Date(item.updated_at || item.created_at),
        }, this.clock))
      );
    } catch (error: any) {
      return fail(new InfrastructureError(error.message || "Failed to list CVs"));
    }
  }

  async delete(cvId: string): Promise<Result<void>> {
    try {
      const supabase = await getServerDb();
      const { error } = await supabase.from("cvs").delete().eq("id", cvId);

      if (error) return fail(new InfrastructureError(error.message));
      return ok(undefined);
    } catch (error: any) {
      return fail(new InfrastructureError(error.message || "Failed to delete CV"));
    }
  }
}
