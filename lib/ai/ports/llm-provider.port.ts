import { Prompt } from "../domain/value-objects/prompt.vo";
import { Completion } from "../domain/value-objects/completion.vo";
import { ModelConfiguration } from "../domain/value-objects/model-configuration.vo";
import { Result } from "@/lib/core/result";

export interface LlmProviderPort {
  generate(prompt: Prompt, config: ModelConfiguration): Promise<Result<Completion>>;
}
