import { Result, ok, fail } from "@/lib/core/result";
import { Query } from "@/lib/core/runtime/query-bus/QueryBus";
import { RequestContext } from "@/lib/core/runtime/context/RequestContext";
import { UnauthorizedError, InfrastructureError } from "@/lib/core/result/errors";
import { getServerDb } from "@/lib/db/client";

export class GetCareerProfileQuery implements Query {
  readonly type = "GetCareerProfileQuery";
}

export type CareerProfileReadModel = {
  id: string;
  userId: string;
  targetRole: string | null;
  targetCompany: string | null;
  targetIndustry: string | null;
  currentRole: string | null;
  currentCompany: string | null;
  currentIndustry: string | null;
  careerScore: number | null;
  readinessLevel: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export class GetCareerProfileQueryHandler {
  async execute(query: GetCareerProfileQuery): Promise<Result<CareerProfileReadModel | null>> {
    const userId = RequestContext.userId();
    if (!userId) return fail(new UnauthorizedError("User not authenticated"));

    try {
      const supabase = await getServerDb();
      const { data, error } = await supabase
        .from("career_profiles")
        .select("id, user_id, target_role, target_company, target_industry, current_role, current_company, current_industry, career_score, readiness_level, created_at, updated_at")
        .eq("user_id", userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned - profile doesn't exist yet
          return ok(null);
        }
        return fail(new InfrastructureError(`Database error: ${error.message}`));
      }

      if (!data) {
        return ok(null);
      }

      const model: CareerProfileReadModel = {
        id: data.id,
        userId: data.user_id,
        targetRole: data.target_role,
        targetCompany: data.target_company,
        targetIndustry: data.target_industry,
        currentRole: data.current_role,
        currentCompany: data.current_company,
        currentIndustry: data.current_industry,
        careerScore: data.career_score,
        readinessLevel: data.readiness_level,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
      };

      return ok(model);
    } catch (e: any) {
      return fail(new InfrastructureError(`Failed to get career profile: ${e.message}`));
    }
  }
}
