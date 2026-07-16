// @ts-nocheck
import { Result } from "../result/Result";
import { DomainError } from "../result/errors/DomainError";
import { fail } from "../result";

export abstract class UseCase<Input, Output> {

  public async execute(input: Input): Promise<Result<Output, DomainError>> {
    try {
      await this.beforeExecute(input);
      const result = await this.run(input);
      await this.afterExecute(input, result);
      return result;
    } catch (error) {
      if (error instanceof DomainError) {
        return fail(error);
      }
      throw error; // Unhandled unexpected error
    }
  }

  protected async beforeExecute(input: Input): Promise<void> {
    // Override this method to perform pre-execution logic (e.g. validation)
  }

  protected abstract run(input: Input): Promise<Result<Output, DomainError>>;

  protected async afterExecute(input: Input, result: Result<Output, DomainError>): Promise<void> {
    // Override this method to perform post-execution logic (e.g. publish events)
  }
}
