import { CreditsGateway } from "../../ports/gateways/credits.gateway";
import { LocalCommandBus } from "@/lib/core/runtime/command-bus/CommandBus";
import { LocalQueryBus } from "@/lib/core/runtime/query-bus/QueryBus";
import { Result, ok, fail } from "@/lib/core/result";
import { InfrastructureError } from "@/lib/core/result/errors";

export class BillingCreditsGateway implements CreditsGateway {
  constructor(
    private readonly commandBus: LocalCommandBus,
    private readonly queryBus: LocalQueryBus
  ) {}

  async hasCredits(userId: string, amount: number): Promise<Result<boolean>> {
    try {
      const queryResult = await this.queryBus.execute<boolean>("HasCreditsQuery", { userId, amount });
      
      if (queryResult.isFailure()) {
        return fail(queryResult.unwrapError());
      }
      return ok(queryResult.unwrap());
    } catch (e: any) {
      return fail(new InfrastructureError(`Failed to check credits: ${e.message}`));
    }
  }

  async consume(userId: string, amount: number, reason: string): Promise<Result<void>> {
    try {
      const commandResult = await this.commandBus.dispatch<void>("ConsumeCreditsCommand", { userId, amount, action: reason });

      if (commandResult.isFailure()) {
        return fail(commandResult.unwrapError());
      }
      return ok(undefined);
    } catch (e: any) {
      return fail(new InfrastructureError(`Failed to consume credits: ${e.message}`));
    }
  }
}
