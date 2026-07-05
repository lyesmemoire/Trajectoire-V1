import { UseCase } from "@/lib/core/application/UseCase";
import { Result, fail } from "@/lib/core/result";
import { ApplicationError } from "@/lib/core/errors";
import { LlmProviderPort } from "../../ports/llm-provider.port";
import { Prompt } from "../../domain/value-objects/prompt.vo";
import { ModelConfiguration } from "../../domain/value-objects/model-configuration.vo";
import { Completion } from "../../domain/value-objects/completion.vo";

export interface RewriteCommand {
  text: string;
  tone?: "professional" | "casual" | "persuasive" | "direct";
}

export class RewriteUseCase extends UseCase<RewriteCommand, Completion> {
  constructor(private readonly llmProvider: LlmProviderPort) {
    super();
  }

  protected async run(command: RewriteCommand): Promise<Result<Completion>> {
    let prompt: Prompt;
    try {
      const toneStr = command.tone ? ` in a ${command.tone} tone` : "";
      prompt = Prompt.create([
        { role: "system", content: `You are an expert editor. Rewrite the following text${toneStr} to improve clarity and impact.` },
        { role: "user", content: command.text }
      ]);
    } catch (e: any) {
      return fail(new ApplicationError(`Invalid Prompt: ${e.message}`, "INVALID_PROMPT"));
    }

    let config: ModelConfiguration;
    try {
      config = ModelConfiguration.create("default", 0.7);
    } catch (e: any) {
      return fail(new ApplicationError(`Invalid Configuration: ${e.message}`, "INVALID_CONFIG"));
    }

    return await this.llmProvider.generate(prompt, config);
  }
}
