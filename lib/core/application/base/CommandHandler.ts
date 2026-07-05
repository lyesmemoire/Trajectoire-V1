import { Result } from "../../result";

/**
 * Base abstract class for Command Handlers.
 * Handlers remain independent of the Bus implementation itself.
 */
export abstract class CommandHandler<TCommand, TResult = void> {
  abstract execute(command: TCommand): Promise<Result<TResult>>;
}
