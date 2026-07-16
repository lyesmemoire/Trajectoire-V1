// @ts-nocheck
import { Prompt } from "../domain/value-objects/prompt.vo";
import { ModelConfiguration } from "../domain/value-objects/model-configuration.vo";
import { Result } from "@/lib/core/result";

export interface StreamingProviderPort {
  stream(prompt: Prompt, config: ModelConfiguration, onToken: (token: string) => void): Promise<Result<void>>;
}
