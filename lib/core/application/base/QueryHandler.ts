import { Result } from "../../result";

/**
 * Base abstract class for Query Handlers.
 * Handlers remain independent of the Bus implementation itself.
 */
export abstract class QueryHandler<TQuery, TResult> {
  abstract execute(query: TQuery): Promise<Result<TResult>>;
}
