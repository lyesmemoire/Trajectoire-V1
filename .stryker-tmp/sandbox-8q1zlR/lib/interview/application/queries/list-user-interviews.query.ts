// @ts-nocheck
import { Result, ok, fail } from "@/lib/core/result";
import { Query } from "@/lib/core/runtime/query-bus/QueryBus";
import { RequestContext } from "@/lib/core/runtime/context/RequestContext";
import { UnauthorizedError, InfrastructureError } from "@/lib/core/result/errors";
import { getServerDb } from "@/lib/db/client";

export class ListUserInterviewsQuery implements Query {
  readonly type = "ListUserInterviewsQuery";
}

export type InterviewReadModel = {
  id: string;
  userId: string;
  status: string;
  confidenceScore: number | null;
  company: string | null;
  persona: string;
  currentState: string;
  clarityScore: number | null;
  createdAt: Date;
  updatedAt: Date;
};

export class ListUserInterviewsQueryHandler {
  async execute(query: ListUserInterviewsQuery): Promise<Result<InterviewReadModel[]>> {
    const userId = RequestContext.userId();
    if (!userId) return fail(new UnauthorizedError("User not authenticated"));

    try {
      const supabase = await getServerDb();
      const { data, error } = await supabase
        .from("interview_sessions")
        .select("id, user_id, status, confidence_score, company, persona, current_state, clarity_score, created_at, updated_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        return fail(new InfrastructureError(`Database error: ${error.message}`));
      }

      const models: InterviewReadModel[] = (data || []).map((row: any) => ({
        id: row.id,
        userId: row.user_id,
        status: row.status,
        confidenceScore: row.confidence_score,
        company: row.company,
        persona: row.persona,
        currentState: row.current_state,
        clarityScore: row.clarity_score,
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at),
      }));

      return ok(models);
    } catch (e: any) {
      return fail(new InfrastructureError(`Failed to list interviews: ${e.message}`));
    }
  }
}
