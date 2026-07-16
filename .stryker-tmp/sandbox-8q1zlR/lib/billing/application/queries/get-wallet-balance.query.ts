// @ts-nocheck
import { Result, ok, fail } from "@/lib/core/result";
import { Query } from "@/lib/core/runtime/query-bus/QueryBus";
import { RequestContext } from "@/lib/core/runtime/context/RequestContext";
import { UnauthorizedError, InfrastructureError } from "@/lib/core/result/errors";
import { getServerDb } from "@/lib/db/client";

export class GetWalletBalanceQuery implements Query {
  readonly type = "GetWalletBalanceQuery";
}

export class GetWalletBalanceQueryHandler {
  async execute(query: GetWalletBalanceQuery): Promise<Result<number>> {
    const userId = RequestContext.userId();
    if (!userId) return fail(new UnauthorizedError("User not authenticated"));

    try {
      const supabase = await getServerDb();
      const { data, error } = await supabase
        .from("wallets")
        .select("balance")
        .eq("user_id", userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned - wallet doesn't exist yet
          return ok(0);
        }
        return fail(new InfrastructureError(`Database error: ${error.message}`));
      }

      return ok(data?.balance || 0);
    } catch (e: any) {
      return fail(new InfrastructureError(`Failed to get wallet balance: ${e.message}`));
    }
  }
}
