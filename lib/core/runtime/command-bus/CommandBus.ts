import { Result, fail } from "../../result";
import { InfrastructureError } from "../../result/errors";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface Command {}

export interface CommandHandler<C extends Command, R = unknown> {
  execute(command: C): Promise<Result<R>>;
}

export class LocalCommandBus {
  private handlers = new Map<string, CommandHandler<any, any>>();

  register<C extends Command, R>(commandName: string, handler: CommandHandler<C, R>): void {
    if (this.handlers.has(commandName)) {
      throw new Error(`CommandHandler already registered for ${commandName}`);
    }
    this.handlers.set(commandName, handler);
  }

  async dispatch<R>(commandName: string, command: Command): Promise<Result<R>> {
    const handler = this.handlers.get(commandName);
    if (!handler) {
      return fail(new InfrastructureError(`No handler registered for command: ${commandName}`));
    }
    return handler.execute(command);
  }
}
