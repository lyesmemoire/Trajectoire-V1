import { Result, ok, fail } from "@/lib/core/result";
import { Query } from "@/lib/core/runtime/query-bus/QueryBus";
import { RequestContext } from "@/lib/core/runtime/context/RequestContext";
import { UnauthorizedError, InfrastructureError } from "@/lib/core/result/errors";
// We use the supabase client directly for read-models as they don't go through aggregates
import { getServerDb } from "@/lib/db/client";

export class ListUserCvsQuery implements Query {
  readonly type = "ListUserCvsQuery";
}

export type UserCvReadModel = {
  id: string;
  userId: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  pdfUrl?: string;
};

export class ListUserCvsQueryHandler {
  async execute(query: ListUserCvsQuery): Promise<Result<UserCvReadModel[]>> {
    const userId = RequestContext.userId();
    if (!userId) return fail(new UnauthorizedError("User not authenticated"));

    try {
      const supabase = await getServerDb();
      const { data, error } = await supabase
        .from("cvs")
        .select("id, user_id, title, created_at, updated_at, pdf_url")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        return fail(new InfrastructureError(`Database error: ${error.message}`));
      }

      const models: UserCvReadModel[] = (data || []).map((row: any) => ({
        id: row.id,
        userId: row.user_id,
        title: row.title || "Untitled",
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at),
        pdfUrl: row.pdf_url
      }));

      return ok(models);
    } catch (e: any) {
      return fail(new InfrastructureError(`Failed to list CVs: ${e.message}`));
    }
  }
}
