import { Result, fail } from "../../result";
import { InfrastructureError } from "../../result/errors";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface Query {}

export interface QueryHandler<Q extends Query, R = unknown> {
  execute(query: Q): Promise<Result<R>>;
}

export class LocalQueryBus {
  private handlers = new Map<string, QueryHandler<any, any>>();

  register<Q extends Query, R>(queryName: string, handler: QueryHandler<Q, R>): void {
    if (this.handlers.has(queryName)) {
      throw new Error(`QueryHandler already registered for ${queryName}`);
    }
    this.handlers.set(queryName, handler);
  }

  async execute<R>(queryName: string, query: Query): Promise<Result<R>> {
    const handler = this.handlers.get(queryName);
    if (!handler) {
      return fail(new InfrastructureError(`No handler registered for query: ${queryName}`));
    }
    return handler.execute(query);
  }
}
