// @ts-nocheck
import { UseCase } from "@/lib/core/application/UseCase";
import { Result, fail } from "@/lib/core/result";
import { ApplicationError } from "@/lib/core/errors";
import { LlmProviderPort } from "../../ports/llm-provider.port";
import { Prompt, PromptMessage } from "../../domain/value-objects/prompt.vo";
import { ModelConfiguration } from "../../domain/value-objects/model-configuration.vo";
import { Completion } from "../../domain/value-objects/completion.vo";

export interface GenerateCompletionCommand {
  messages: PromptMessage[];
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export class GenerateCompletionUseCase extends UseCase<GenerateCompletionCommand, Completion> {
  constructor(private readonly llmProvider: LlmProviderPort) {
    super();
  }

  protected async run(command: GenerateCompletionCommand): Promise<Result<Completion>> {
    let prompt: Prompt;
    try {
      prompt = Prompt.create(command.messages);
    } catch (e: any) {
      return fail(new ApplicationError(`Invalid Prompt: ${e.message}`, "INVALID_PROMPT"));
    }

    let config: ModelConfiguration;
    try {
      config = ModelConfiguration.create(
        command.model || "default",
        command.temperature,
        command.maxTokens
      );
    } catch (e: any) {
      return fail(new ApplicationError(`Invalid Configuration: ${e.message}`, "INVALID_CONFIG"));
    }

    return await this.llmProvider.generate(prompt, config);
  }
}
