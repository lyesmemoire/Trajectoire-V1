import { Result, ok, fail } from "../../result";
import { InfrastructureError } from "../../result/errors";
import { getServerDb } from "@/lib/db/client";

/**
 * Base class for Supabase Repositories.
 * Centralizes client resolution and error translation (PostgREST errors).
 */
export abstract class SupabaseRepository {
  /**
   * Encapsulates Supabase calls with automatic client resolution and error translation.
   */
  protected async safeExecute<T>(
    operation: (supabase: any) => Promise<{ data: T | null; error: any }>
  ): Promise<Result<T>> {
    try {
      const supabase = await getServerDb();
      const { data, error } = await operation(supabase);

      if (error) {
        return fail(this.translateError(error));
      }

      // Sometimes data might be explicitly null if not found
      return ok(data as T);
    } catch (err: any) {
      return fail(this.translateError(err));
    }
  }

  /**
   * Translates Supabase/PostgREST errors to standard InfrastructureError.
   */
  protected translateError(error: any): InfrastructureError {
    let message = "Supabase Error";
    
    if (error?.code) {
      // PostgREST errors mapping (similar to Prisma)
      switch (error.code) {
        case "23505":
          message = "Unique violation";
          break;
        case "PGRST116":
          message = "Result contains 0 rows";
          break;
        default:
          message = `Supabase error ${error.code}: ${error.message}`;
      }
    } else if (error instanceof Error) {
      message = error.message;
    }
    
    return new InfrastructureError(message);
  }
}
