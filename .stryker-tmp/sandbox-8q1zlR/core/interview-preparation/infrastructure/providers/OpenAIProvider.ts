/**
 * OpenAIProvider
 *
 * Infrastructure OpenAI provider.
 * NO business logic, NO reasoning, NO analysis.
 * ONLY OpenAI configuration abstraction.
 */
// @ts-nocheck


import { ConfigurationService, OpenAIConfig } from "../configuration/ConfigurationService";

export interface IOpenAIProvider {
  getConfig(): OpenAIConfig;
}

export class OpenAIProvider implements IOpenAIProvider {
  constructor(private readonly configurationService: ConfigurationService) {}

  getConfig(): OpenAIConfig {
    return this.configurationService.getOpenAIConfig();
  }
}
