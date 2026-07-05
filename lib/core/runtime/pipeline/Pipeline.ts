import { Result, fail } from "../../result";
import { InfrastructureError } from "../../result/errors";

/**
 * A middleware receives the input and a `next` function.
 * It can:
 *   - transform the input before passing it to next
 *   - short-circuit by returning a Result without calling next
 *   - wrap next() with try/catch for error handling
 *   - perform side effects (logging, metrics, etc.)
 */
export type Middleware<TInput, TOutput> = (
  input: TInput,
  next: (input: TInput) => Promise<Result<TOutput>>
) => Promise<Result<TOutput>>;

/**
 * Composable request pipeline.
 * 
 * Usage:
 * ```ts
 * const pipeline = new Pipeline<CreateUserCommand, void>()
 *   .use(validationMiddleware)
 *   .use(authenticationMiddleware)
 *   .use(authorizationMiddleware)
 *   .use(idempotencyMiddleware)
 *   .use(transactionMiddleware);
 * 
 * const result = await pipeline.execute(command, useCase.run.bind(useCase));
 * ```
 * 
 * The route handler becomes:
 * ```ts
 * export async function POST(req) {
 *   const command = await parseRequest(req);
 *   const result = await pipeline.execute(command, useCase.run.bind(useCase));
 *   return presenter.present(result);
 * }
 * ```
 */
export class Pipeline<TInput, TOutput> {
  private middlewares: Middleware<TInput, TOutput>[] = [];

  use(middleware: Middleware<TInput, TOutput>): this {
    this.middlewares.push(middleware);
    return this;
  }

  async execute(
    input: TInput,
    handler: (input: TInput) => Promise<Result<TOutput>>
  ): Promise<Result<TOutput>> {
    // Build the chain from right to left.
    // The innermost function is the actual handler.
    let chain = handler;

    for (let i = this.middlewares.length - 1; i >= 0; i--) {
      const middleware = this.middlewares[i]!;
      const nextInChain = chain;
      chain = (inp: TInput) => middleware(inp, nextInChain);
    }

    try {
      return await chain(input);
    } catch (error: any) {
      return fail(new InfrastructureError(`Pipeline execution failed: ${error.message}`));
    }
  }
}
