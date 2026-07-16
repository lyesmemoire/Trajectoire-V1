// @ts-nocheck
import { UseCase } from "@/lib/core/application/UseCase";
import { Result, fail } from "@/lib/core/result";
import { ApplicationError } from "@/lib/core/errors";
import { LlmProviderPort } from "../../ports/llm-provider.port";
import { Prompt } from "../../domain/value-objects/prompt.vo";
import { ModelConfiguration } from "../../domain/value-objects/model-configuration.vo";
import { Completion } from "../../domain/value-objects/completion.vo";

export interface AnalyzeCommand {
  text: string;
  aspects: string[];
}

export class AnalyzeUseCase extends UseCase<AnalyzeCommand, Completion> {
  constructor(private readonly llmProvider: LlmProviderPort) {
    super();
  }

  protected async run(command: AnalyzeCommand): Promise<Result<Completion>> {
    let prompt: Prompt;
    try {
      const aspectsStr = command.aspects.join(", ");
      prompt = Prompt.create([
        { role: "system", content: `You are an expert analyst. Analyze the provided text focusing strictly on the following aspects: ${aspectsStr}. Return a structured analysis.` },
        { role: "user", content: command.text }
      ]);
    } catch (e: any) {
      return fail(new ApplicationError(`Invalid Prompt: ${e.message}`, "INVALID_PROMPT"));
    }

    let config: ModelConfiguration;
    try {
      config = ModelConfiguration.create("default", 0.2); // Low temperature for analytical tasks
    } catch (e: any) {
      return fail(new ApplicationError(`Invalid Configuration: ${e.message}`, "INVALID_CONFIG"));
    }

    return await this.llmProvider.generate(prompt, config);
  }
}
